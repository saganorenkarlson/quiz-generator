declare namespace Express {
    export interface Request {
      auth?: {
        payload: {
          sub: string;
        };
      };
    }
  }