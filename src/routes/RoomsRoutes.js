import { Router } from "express";
import {
	getRooms,
	getRoom,
	booking
} from "../controllers/rooms.js";
const router = Router();

router.get("/", getRooms);
router.get("/:room_no", getRoom);
router.patch("/:room_no/book", booking);
export default router;
