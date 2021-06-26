import { Request, Response } from 'express';

import Upload from 'utils/Upload';

const uploadInstance = new Upload({
    formats: ['jpg', 'jpeg', 'png', 'gif'],
})

export const updateDetails = (req: Request, res: Response) => {
    try {
        res.send({
            success: true
        });
    } catch (e) {
        res.send({
            success: false
        });
    }
};


updateDetails.upload = uploadInstance.fields([{ name: 'avatar' }]);