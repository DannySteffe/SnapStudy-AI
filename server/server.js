import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import moduleRoutes from "./routes/moduleRoutes.js";

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/modules", moduleRoutes);

app.get("/", (req, res) => {
    res.json({ status: "Backend operational" });
});

app.listen(process.env.PORT || 5000, () =>
    console.log("Server running")
);
