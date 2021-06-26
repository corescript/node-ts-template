import { Request } from 'express';
import multer from 'multer';
import mime from 'mime-types';

const getDestination = (path: string) => (req: Request, file: any, cb: any) => {
    if (path) {
        cb(null, path);
        return;
    }
    cb(null, 'data/temp');
};

const defaultNameHandler = (req: Request, file: Express.Multer.File, cb: any) => {
    const ext = mime.extension(file.mimetype);
    const filename = file.originalname
        .split('.')[0]
        .toLowerCase()
        .replace(' ', '');
    const uniqueName = `${filename}${req.user?._id ? '-' + req.user._id : ''
        }-${Date.now()}.${ext}`;
    cb(null, uniqueName);
};

const getFileFilter = (formats: string[] = []) => (req: Request, file: Express.Multer.File, cb: any) => {

    if (!formats.length) {
        cb(null, true);
        return;
    }

    let extension = mime.extension(file.mimetype);

    if (extension && formats.includes(extension)) {
        cb(null, true);
        return;
    }

    let err = new Error();

    err.message = 'InvalidFile';
    
    cb(err);
};

interface UploadOptions {
    path?: string,
    mem?: boolean,
    formats?: string[],
    maxSize?: number
}

class Upload {

    private multer: multer.Multer = multer();
    private path: string = '/data/temp';
    private mem: boolean = false;
    private formats: string[] = [];
    private maxSize: number = 52428800;

    constructor(options: UploadOptions = {}) {

        let { path, mem, formats, maxSize } = options;

        this.path = path || '/data/temp';

        this.mem = mem || false;

        this.formats = formats || this.formats;

        let multerOptions: multer.Options = {
            limits: {}
        };

        if (mem) {
            multerOptions.storage = multer.memoryStorage();
        } else {
            multerOptions.storage = multer.diskStorage({
                destination: getDestination(this.path),
                filename: defaultNameHandler
            });
        }

        if (multerOptions?.limits) {
            multerOptions.limits.fileSize = maxSize || 52428800;
        }

        multerOptions.fileFilter = getFileFilter(this.formats);
        this.multer = multer(multerOptions);
    }
    fields(fields: readonly multer.Field[]) {
        return this.multer.fields(fields)
    }
}

export default Upload;
