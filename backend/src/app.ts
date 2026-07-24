import dotenv from "dotenv";
import express from "express";
import connectToDB from "./config/db.js";
import { notFound, errorHandler } from "./middlewares/errors.js";
import auth from "./modules/auth/auth.routes.js";
import users from "./modules/user/user.routes.js";
import posts from "./modules/posts/post.routes.js";
import helmet from "helmet";
import cors from "cors";
import swaggerui from "swagger-ui-express";
import spacs from "./config/swagger.js";
dotenv.config();
const app = express();

connectToDB();

app.use(helmet());
app.use(cors({ origin: "http://localhost:3000" }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", auth);
app.use("/users", users);
app.use("/posts", posts);

app.use("/api-docs", swaggerui.serve, swaggerui.setup(spacs));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
