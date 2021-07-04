import mongoose from 'mongoose';
import mongoose_delete from 'mongoose-delete';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: false,
            trim: true,
            text: true
        },
        email: {
            type: String,
            required: true,
            index: true
        },
        role: {
            type: String,
            default: 'USER',
            enum: ['ADMIN', 'USER']
        },
        password: {
            type: String
        },
        lastLoggedIn: {
            type: Date
        }
    },
    { timestamps: { createdAt: 'createdDate', updatedAt: 'modifiedDate' } }
);

userSchema.plugin(mongoose_delete, { overrideMethods: true });

export default mongoose.model('User', userSchema);
