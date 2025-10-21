import express from "express";
import cors from "cors"
const app = express();
app.use(express.json());
app.use(cors());

import mainRouter from "./routes/index.js";

app.use("/api/v1/", mainRouter);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});