import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {};

async function dbConnect() {
    if (connection.isConnected) {
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {});

        connection.isConnected = db.connections[0].readyState;
        console.log("Database connected successfully");
    }
    catch (error) {
        console.error("Database connection error:", error);
        process.exit(1); // Exit the process with an error code
    }
}

export default dbConnect;