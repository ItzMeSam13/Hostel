import express from "express"; // to create server
import authRouter from "./src/routes/AuthRoute.js"; //importing AuthRoutes
import roomsRouter from "./src/routes/RoomsRoutes.js"; //importing RoomsRoutes
import bookingRouter from "./src/routes/BookingRoutes.js"; //importing BookingRoutes
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 8000;
const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);
app.use("/Rooms", roomsRouter);
app.use("/bookings", bookingRouter);
app.get("/", (req, res) => {
	res.send("welcome to API");
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
