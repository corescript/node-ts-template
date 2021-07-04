import mongoose from 'mongoose';
import mongoose_delete from 'mongoose-delete';

const tokenSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            index: true
        },
        token: {
            type: String,
            index: true
        }
    },
    { timestamps: { createdAt: 'createdDate' } }
);

tokenSchema.plugin(mongoose_delete, { overrideMethods: true });

export default mongoose.model('Token', tokenSchema);
