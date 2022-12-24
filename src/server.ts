import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors';
import { userRoutes } from './handlers/user';
import { orderRoutes } from './handlers/order';
import { productRoutes } from './handlers/product';

export const app: express.Application = express()
const address: string = "0.0.0.0:3003"

app.use(bodyParser.json());
app.use(cors());

app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!')
})

userRoutes(app);
productRoutes(app);
orderRoutes(app);

app.listen(3003, function () {
    console.log(`starting app on: ${address}`)
})