import express, { Application } from 'express';

const app: Application = express();
const port: Number = 3002;

app.get("/api/s3/ping", (req, res) => {
    res.send({ message: "ping from service 3" });
})

app.listen(port, () => {
    console.warn(`Server is running on port ${port}`)
})