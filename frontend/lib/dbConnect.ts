import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect() {
  if (connection.isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/CodeBuddy", {});

    connection.isConnected = db.connections[0].readyState;
    console.log("Database connected successfully", process.env.MONGODB_URI);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit the process with an error code
  }
}

export default dbConnect;
