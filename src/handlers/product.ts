import { Product, ProductStore } from '../models/products';
import { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import { verifyJwtToken } from '../middlewares/authentication';

const productStore = new ProductStore();
dotenv.config();

const index = async (req: Request, res: Response) => {
  try {
    res.status(200).json(await productStore.index());
  } catch (err) {
    console.log(err);
    res.status(400).json(null);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    if(Number(productId))
      res.status(200).json(await productStore.show(Number(productId)));
    else 
    res.status(400).json('Invalid ID error');
  } catch (err) {
    console.log(err);
    res.status(400).json(null);
  }
};

const create = async (req: Request, res: Response) => {
  const product: Product = {
      name: req.body.name,
      price: req.body.price   
  };
  try {
    const productResult = await productStore.create(product);
    res.status(200).json(productResult);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: 'INTERNAL SERVER ERROR',
    });
  }
};


const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    if(Number(productId))
      res.status(200).json(await productStore.delete(Number(productId)));
    else 
    res.status(400).json('Invalid ID error');
  } catch (err) {
    console.log(err);
    res.status(400).json(null);
  }
};

export const productRoutes = (app: Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', verifyJwtToken, create);
  app.delete('/products/:id', deleteProduct);
};
