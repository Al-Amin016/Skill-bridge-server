import express from 'express';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
import config from './config';
import cors from "cors"
import errorHandler from './middleware/globalErrorHandler';
import { notFound } from './middleware/notFound';
import { studentRouter } from './module/student/student.route';
import { tutorRouter } from './module/tutor/tutor.route';
import { adminRouter } from './module/admin/admin.route';
const app = express ();

app.use(express.json())

app.use(cors({
    origin: config.app_url || "http://localhost:3000",
    credentials: true
}))


app.use("/api/v1/student", studentRouter);
app.use("/api/v1/tutor", tutorRouter);
app.use("/api/v1/admin", adminRouter);

app.all("/api/auth/*splat", toNodeHandler(auth));
app.get('/', (req, res) =>{
    res.send("My Skill Bridge server API Works!")
})

app.use(errorHandler)
app.use(notFound)

export default app