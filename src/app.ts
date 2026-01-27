import express, { Application } from "express";

const app: Application = express();

app.get("/", (req, res) =>{
    res.send("Skill bridge server api is Working")
})

export default app