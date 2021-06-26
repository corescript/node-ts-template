import mongoose from "mongoose";
import mongoose_delete from 'mongoose-delete';

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: false,
            trim: true,
            text: true
        },
        lastName: {
            type: String,
            required: false,
            text: true
        }
    },
    { timestamps: { createdAt: 'createdDate', updatedAt: 'modifiedDate' } }
);

userSchema.plugin(mongoose_delete, { overrideMethods: true });

export default mongoose.model('User', userSchema);
