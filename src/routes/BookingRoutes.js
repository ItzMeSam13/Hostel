import { Router } from "express";
import {
	request_booking,
	updatebookingstatus,
	getBookings,
	getUserBookingStatus,
} from "../controllers/Booking.js";

const router = Router();

router.post("/request", request_booking);
router.patch("/:bookingId/status", updatebookingstatus);
router.get("/", getBookings);
router.get("/status/:userId", getUserBookingStatus);

export default router;
