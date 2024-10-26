import express, { Application } from 'express';

const app: Application = express();
const port: Number = 3000;

app.get("/api/s1/ping", (req, res) => {
    res.send({ message: "ping from service 1" });
})

app.listen(port, () => {
    console.warn(`Server is running on port ${port}`)
})  