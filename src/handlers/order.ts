import { Order, OrderProduct, OrderStore } from '../models/orders';
import { Request, Response, Application, NextFunction } from 'express';
import { verifyJwtToken } from '../middlewares/authentication';
import { OrderService } from '../services/orders';

const orderStore = new OrderStore();
const orderService = new OrderService();


const index = async (req: Request, res: Response) => {
  try {
    res.status(200).json(await orderStore.index());
  } catch (err) {
    console.log(err);
    res.status(400).json(null);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;
    if(Number(orderId))
      res.status(200).json(await orderStore.show(Number(orderId)));
    else 
    res.status(400).json('Invalid ID error');
  } catch (err) {
    console.log(err);
    res.status(400).json(null);
  }
};

const create = async (req: Request, res: Response) => {
  const order: Order = {
      status: req.body.status,
      userId: Number(req.body.userId)
  };
  console.log(order)
  try {
    const orderResult = await orderStore.create(order);
    res.status(200).json(orderResult);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: 'INTERNAL SERVER ERROR',
    });
  }
};

const addProductToOrder = async (req: Request, res: Response, next: NextFunction) => {

  try {
   const orderId = req.params.orderId
  if (!Number(orderId) || !Number(req.body.productId) || !Number(req.body.quantity)) {
    res.status(400).json({
      error: 'Something went wrong. The validation of data has failed.',
    });
    next();
  }
    
  const orderProduct: OrderProduct = {
      orderId: Number(orderId),
      productId: Number(req.body.productId),
      quantity: Number(req.body.quantity)
  };

    console.log(orderProduct)

    const orderProductResult = await orderStore.addProductToOrder(orderProduct);
    res.status(200).json(orderProductResult);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: 'INTERNAL SERVER ERROR',
    });
  }
};

const getUserActiveOrder = async (req: Request, res: Response) => {
  try {
  const userId = req.params.userId;
    if(Number(userId))
      res.status(200).json(await orderService.getUserCurrentOrder(Number(userId)));
    else 
    res.status(400).json('Invalid ID error');
  } catch (err) {
     console.log(err);
    res.status(400).json();
  }
};

export const orderRoutes = (app: Application) => {
    app.get('/orders', verifyJwtToken, index);
    app.get('/orders/:id', verifyJwtToken, show);
    app.post('/orders', verifyJwtToken, create);
    app.post('/orders/:orderId/products', verifyJwtToken, addProductToOrder);
    app.get('/users/:userId/active_order', verifyJwtToken, getUserActiveOrder);
};
