import { Request, Response, NextFunction } from 'express';
import jsonwebtoken from 'jsonwebtoken';

export const verifyJwtToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = `${req.headers.authorization?.split(' ')[1]}`;
    jsonwebtoken.verify(token, process.env.JWT_TOKEN_SECRET as string);
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({
      error: 'Unauthorized',
    });
  }
};
