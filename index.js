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
import smsTemplatesRouter from './routes/smsTemplatesRouter.js';
import TranactionsRouter from './routes/transactionsRouter.js';
import AcademicYearsRouter from './routes/academicYearsRouter.js';
import StaffApplicationsRouter from './routes/staffApplicationsRouter.js';
import StaffTypesRouter from './routes/staffTypesRouter.js';
import DesignationsRouter from './routes/designationsRouter.js';
import DepartmentsRouter from './routes/departmentsRouter.js';
import AdmissionStatesRouter from './routes/admissionStatesRouter.js';
import jobsRouter from './routes/jobsRouter.js';
import stationaryDetailsRouter from './routes/stationaryDetailsRouter.js';
import enquiriesRouter from './routes/enquiriesRouter.js';
import guideLinesRouter from './routes/guidelinesRouter.js';
import alumniRouter from './routes/alumniRouter.js';
import awsRouter from './routes/awsRouter.js';





// Middleware
dotenv.config();
const app = express();
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit:'50mb', extended:true}));
app.use(cors({origin:'*'}));
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
app.use('/sms-templates', smsTemplatesRouter);
app.use('/transactions', TranactionsRouter);
app.use('/academic-years', AcademicYearsRouter);
app.use('/staff-applications', StaffApplicationsRouter);
app.use('/staff-types', StaffTypesRouter);
app.use('/designations', DesignationsRouter);
app.use('/departments', DepartmentsRouter);
app.use('/admission-states', AdmissionStatesRouter);
app.use('/jobs', jobsRouter);
app.use('/stationary-details', stationaryDetailsRouter);
app.use('/enquiries', enquiriesRouter);
app.use('/guide-lines', guideLinesRouter);
app.use('/alumni', alumniRouter);
app.use('/aws', awsRouter);





// Database Connect
mongoose.connect(process.env.MONGO_DB).then(() => console.log('Connected to the database')).catch(err => console.log(err));





// Server Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Is Running On Port ${PORT}`);
});