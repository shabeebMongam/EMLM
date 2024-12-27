import express from 'express';
import router from './routes/router.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());


app.use('/api/v1', router)

app.use("*", errorHandler.notFound)

app.use(errorHandler.errorHandler);




export default app;