import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import patientsRoutes from "./src/routes/patients.js"

const app = express();

app.use(cors({
    origin: ["http://localhost:5173","http://localhost:5174"],
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use("/api/patients",patientsRoutes);
export default app