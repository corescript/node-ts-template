import mongoose, { CallbackError } from 'mongoose';
import UserModel from './models/User';

mongoose.Promise = global.Promise;

let mongoConfig: object = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    //dbName: mongoConfig.conn.database
};


// Register required db models here......
export const User = UserModel;



export const Mongoose = mongoose;

export const connect = () => {

    const connString: string = process.env.DB_CONNECTION || "";

    mongoose.connect(connString, mongoConfig, (error: CallbackError): void => {
        if (error) console.log('Connection error - ', error);
        else console.log('MongoDB connection established');
    });

};
