import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, jwtSecret as string, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      next()
    });
  } else {
    return res.sendStatus(401)
  }
};