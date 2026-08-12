import { User } from './db';

declare module 'express' {
  export interface Request {
    user?: User;
    firebaseUid?: string;
  }
}

declare module 'express-serve-static-core' {
  export interface Request {
    user?: User;
    firebaseUid?: string;
  }
}
