import express, { Application } from 'express';

const app: Application = express();
const port: Number = 3001;

app.get("/api/s2/ping", (req, res) => {
    res.send({ message: "ping from service 2" });
})

app.listen(port, () => {
    console.warn(`Server is running on port ${port}`)
})