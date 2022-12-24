import { UserStore } from '../models/user';
import { Request, Response, Application } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import { verifyJwtToken } from '../middlewares/authentication';

const userStore = new UserStore();

dotenv.config();

const index = async (req: Request, res: Response) => {
  try {
    const usersResult = (await userStore.index()).map((userResult) => ({
      id: userResult.id,
      username: userResult.username,
      firstName: userResult.firstName,
      lastName: userResult.lastName
    }))
    res.status(200).json(usersResult);
  } catch (err) {
    console.log(err);
    res.status(400).json(null);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    if (Number(userId)) {
     const userResult = await userStore.show(Number(userId))
      res.status(200).json({
        id: userResult.id,
        username: userResult.username,
        firstName: userResult.firstName,
        lastName: userResult.lastName
      });
    }
    else 
    res.status(400).json('Invalid ID error');
  } catch (err) {
    console.log(err);
    res.status(400).json(null);
  }
};

const create = async (req: Request, res: Response) => {
  const user = {
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
  };
  try {
    const userResult = await userStore.create(user);
    const token = jsonwebtoken.sign(
      {
        id: userResult.id,
        username: userResult.username,
      },
      process.env.JWT_TOKEN_SECRET as string
    );
    res.status(200).json(token);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: 'INTERNAL SERVER ERROR',
    });
  }
};

const authenticate = async (req: Request, res: Response) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
  };
  try {
    const userResult = await userStore.authenticate(user);
    if (userResult) {
      const token = jsonwebtoken.sign(
        {
          id: userResult.id,
          username: userResult.username,
        },
        process.env.JWT_TOKEN_SECRET as string
      );
      res.status(200).json(token);
    } else
      res.status(401).json({
        error: 'Incorrect credentials',
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: 'INTERNAL SERVER ERROR',
    });
  }
};


const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    if(Number(userId))
      res.status(200).json(await userStore.delete(Number(userId)));
    else 
    res.status(400).json('Invalid ID error');
  } catch (err) {
    console.log(err);
    res.status(400).json(null);
  }
};

const update = async (req: Request, res: Response) => {
  const user = {
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };

  const userId = Number(req.params.id)

  try {
    const userResult = await userStore.update(user, userId);
    res.status(200).json({
      id: userResult.id,
      username: userResult.username,
      firstName: userResult.firstName,
      lastName: userResult.lastName
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: 'INTERNAL SERVER ERROR',
    });
  }
};

export const userRoutes = (app: Application) => {
  app.get('/users', verifyJwtToken, index);
  app.get('/users/:id', verifyJwtToken, show);
  app.post('/users', create);
  app.post('/login', authenticate);
  app.patch('/users/:id', verifyJwtToken, update);
  app.delete('/users/:id', deleteUser);
};
