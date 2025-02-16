import { Router } from "express";
import { getRooms, getRoom } from "../controllers/rooms.js";
const router = Router();

router.get("/", getRooms);
router.get("/:room_no", getRoom);
export default router;
