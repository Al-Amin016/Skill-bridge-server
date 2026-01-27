import express from 'express';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
import config from './config';
import cors from "cors"
import { postRout } from './module/post/post.route';
const app = express ();

app.use(express.json())

app.use(cors({
    origin: config.app_url || "http://localhost:3000",
    credentials: true
}))

app.use('/post', postRout);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.get('/', (req, res) =>{
    res.send("My prisma server is running with Al-Amin Islam")
})

export default app