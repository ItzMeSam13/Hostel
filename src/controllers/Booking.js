import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const request_booking = async (req, res) => {
	const { userId, roomId } = req.body;

	try {
		const existingBooking = await prisma.Bookings.findFirst({
			where: {
				userId: userId,
				OR: [{ status: "pending" }, { status: "approved" }],
			},
		});

		if (existingBooking) {
			return res
				.status(400)
				.json({ error: "You already have an active booking" });
		}
		const room = await prisma.rooms.findUnique({
			where: { room_id: roomId },
		});
		if (!room) {
			return res.status(404).json({ message: "Room not found" });
		}
		if (room.room_capacity === 0) {
			return res.status(400).json({ error: "Room is unavailable" });
		}
		const booking = await prisma.Bookings.create({
			data: {
				userId,
				roomId,
				status: "pending",
			},
		});
		res.status(201).json({ message: "Booking request submitted", booking });
	} catch (error) {
		res
			.status(500)
			.json({ error: "Internal server error", details: error.message });
	}
};
export const updatebookingstatus = async (req, res) => {
	const { bookingId } = req.params;
	const { status } = req.body;
	try {
		const booking = await prisma.Bookings.findUnique({
			where: { bookingId: bookingId },
		});
		if (!booking) {
			return res.status(404).json({ error: "Booking not found" });
		}
		if (status === "approved") {
			const room = await prisma.rooms.findUnique({
				where: { room_id: booking.roomId },
			});
			if (!room) {
				return res.status(404).json({ error: "Room not found" });
			}
			if (room.room_capacity === 0) {
				return res.status(400).json({ error: "Room is unavailable" });
			}

			const newCapacity = room.room_capacity - 1;
			const updatedStatus = newCapacity === 0 ? "unavailable" : "available";
			await prisma.rooms.update({
				where: { room_id: booking.roomId },
				data: {
					room_capacity: newCapacity,
					status: updatedStatus,
				},
			});
			res
				.status(200)
				.json({ message: `Booking ${status}`, updatebookingstatus });
			await prisma.Bookings.update({
				where: { bookingId },
				data: { status: "approved" }, // Mark booking as approved
			});
		}
		if (status === "rejected") {
			await prisma.Bookings.update({
				where: { bookingId },
				data: { status },
			});
			res
				.status(200)
				.json({ message: `Booking ${status}`, updatebookingstatus });
		}
	} catch (error) {
		res
			.status(500)
			.json({ error: "Internal server error", details: error.message });
	}
};
export const getBookings = async (req, res) => {
	try {
		const bookings = await prisma.Bookings.findMany({
			include: {
				user: true,
				room: true,
			},
		});

		res.status(200).json({ bookings });
	} catch (error) {
		res
			.status(500)
			.json({ error: "Error fetching bookings", details: error.message });
	}
};

export const getUserBookingStatus = async (req, res) => {
	const { userId } = req.params;

	try {
		const booking = await prisma.Bookings.findFirst({
			where: {
				userId,
				OR: [{ status: "pending" }, { status: "approved" }],
			},
			include: { room: true },
		});

		if (!booking) {
			return res.status(404).json({ message: "No active booking found" });
		}

		res.status(200).json({
			message: `Your booking status is ${booking.status}`,
			booking,
		});
	} catch (error) {
		res.status(500).json({
			error: "Internal server error",
			details: error.message,
		});
	}
};
