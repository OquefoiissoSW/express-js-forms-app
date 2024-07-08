import express from "express";
import routes from './routes/routes'
import bodyParser from 'body-parser';
import swaggerDocs from "./utils/swagger";
import * as dotenv from 'dotenv'
import { PrismaClient } from "@prisma/client";

const app = express();

const PORT = 3000;

dotenv.config();

app.use(bodyParser.json())
app.use(routes)

app.get('/api', (request: express.Request, response: express.Response) => {
    response.send('qwertt');
})

const prisma = new PrismaClient()


app.listen(PORT, async () => {
    console.log('Running on Port', PORT);
    swaggerDocs(app, PORT)
})