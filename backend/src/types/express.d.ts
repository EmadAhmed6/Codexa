declare global {
  namespace Express {
    interface User {
      id?: string;
      _id?: any;
      userId?: string;
      username?: string;
      role?: "User" | "Admin" | "SuperAdmin";
      generateToken?: () => string;
    }
    interface Request {
      user?: User & {
        id?: string;
        userId?: string;
        username?: string;
        role?: "User" | "Admin" | "SuperAdmin";
      };
    }
  }
}

export {};
