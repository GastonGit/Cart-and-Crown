import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
dotenv.config();

import routes from "./routes";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(morgan("tiny"));
app.use(express.json());
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
