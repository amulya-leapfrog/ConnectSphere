import { Request } from 'express';

export interface JwtPayload {
  id: number;
}

export interface CustomRequest extends Request {
  user: JwtPayload;
}
