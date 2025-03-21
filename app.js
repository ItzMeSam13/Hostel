import express from "express"; // to create server
import authRouter from "./src/routes/AuthRoute.js"; //importing AuthRoutes
import ProtectedRoutes from "./src/routes/ProtectedRoutes.js"; //importing ProtectedRoutes
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 8000;
const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);
app.use("/protected", ProtectedRoutes);
app.get("/", (req, res) => {
	res.send("welcome to API");
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
