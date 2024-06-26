// src/index.ts
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB using Mongoose
mongoose.connect("mongodb://localhost:27017/typeScriptOfDaily", {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// route will be here

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
