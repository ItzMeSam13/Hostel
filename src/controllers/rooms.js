import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getRooms = async (req, res) => {
	try {
		const rooms = await prisma.rooms.findMany({
			orderBy: {
				room_no: "asc",
			},
		});
		res.status(200).json({ success: true, rooms });
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching rooms",
			error: error.message,
		});
	}
};

export const getRoom = async (req, res) => {
	const room_no = parseInt(req.params.room_no, 10);

	if (isNaN(room_no)) {
		return res.status(400).json({
			success: false,
			message: "Invalid room number provided",
		});
	}

	try {
		const room = await prisma.rooms.findUnique({
			where: {
				room_no: room_no,
			},
		});

		if (!room) {
			return res.status(404).json({
				success: false,
				message: "Room not found",
			});
		}

		res.status(200).json({
			success: true,
			room,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching room details",
			error: error.message,
		});
	}
};
export const booking = async (req, res) => {
	const room_no = parseInt(req.params.room_no, 10);
	try {
		const room = await prisma.rooms.findUnique({
			where: { room_no },
		});
		if (!room) {
			return res.status(404).json({ error: "Room not found" });
		}
		if (room.status === "unavailable") {
			return res.status(400).json({
				success: false,
				message: "Room is already unavailable",
			});
		}
		const newCapacity = room.room_capacity - 1;
		const updatedStatus = newCapacity === 0 ? "unavailable" : "available";
		const updatedRoom = await prisma.rooms.update({
			where: { room_no },
			data: {
				room_capacity: newCapacity,
				status: updatedStatus,
			},
		});
		res.status(200).json({
			success: true,
			message: "Room booked successfully",
			room: updatedRoom,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error booking room",
			error: error.message,
		});
	}
};
