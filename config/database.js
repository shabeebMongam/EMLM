import mongoose from 'mongoose';

const connectDB = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(process.env.MONGO_URI
        )
            .then((conn) => {
                console.log(`MongoDB Connected: ${conn.connection.host}`);
                resolve(conn);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export default connectDB;