import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/database.js';
import app from './server.js';

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exit(1);
});