declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username?: string;
        role: "User" | "Admin" | "SuperAdmin";
      };
    }
  }
}

export {};
