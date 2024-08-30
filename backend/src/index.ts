import express from "express";
import dotenv from "dotenv";
dotenv.config();

import routes from "./routes";
import app from "./app";

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
