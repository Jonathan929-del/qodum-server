// Imports
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import schoolsRouter from './routes/schoolsRouter.js';
import classesRouter from './routes/classesRouter.js';
import studentsRouter from './routes/studentsRouter.js';
import teachersRouter from './routes/teachersRouter.js';
import subjectsRouter from './routes/subjectsRouter.js';
import paymentsRouter from './routes/paymentsRouter.js';
import assignemtsRouter from './routes/assignmentsRouter.js';
import notificationsRouter from './routes/notificationsRouter.js';
import feeTypesRouter from './routes/feeTypesRouter.js';
import installmentsRouter from './routes/installmentsRouter.js';





// Middleware
dotenv.config();
const app = express();
app.use(cors({origin:'*'}));
app.use(express.json());
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));





// Routes
app.use('/students', studentsRouter);
app.use('/teachers', teachersRouter);
app.use('/schools', schoolsRouter);
app.use('/assignments', assignemtsRouter);
app.use('/classes', classesRouter);
app.use('/subjects', subjectsRouter);
app.use('/notifications', notificationsRouter);
app.use('/payments', paymentsRouter);
app.use('/fee-types', feeTypesRouter);
app.use('/installments', installmentsRouter);





// Database Connect
mongoose.connect(process.env.MONGO_DB).then(() => console.log('Connected to the database')).catch(err => console.log(err));





// Server Port
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server Is Running On Port ${PORT}`);
});