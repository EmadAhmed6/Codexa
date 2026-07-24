declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        isAdmin: boolean;
        username?: string;
      };
    }
  }
}

export {};
