import { Request, Response } from 'express';

import Upload from 'utils/Upload';

const uploadInstance = new Upload({
    formats: ['jpg', 'jpeg', 'png', 'gif']
});

export const updateDetails = async (
    req: Request,
    res: Response
): Promise<void> => {
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
