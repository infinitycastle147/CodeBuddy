import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect() {
  if (connection.isConnected) {
    return;
  }

  const atlasUri = process.env.MONGODB_URI;
  const localUri = process.env.MONGODB_LOCAL_URI || "mongodb://localhost:27017/CodeBuddy";

  // Try Atlas connection first
  if (atlasUri) {
    try {
      const db = await mongoose.connect(atlasUri, {});
      connection.isConnected = db.connections[0].readyState;
      console.log("Database connected successfully to Atlas:", atlasUri);
      return;
    } catch (error) {
      console.warn("Atlas connection failed, trying local MongoDB:", error.message);
    }
  }

  // Fallback to local MongoDB
  try {
    const db = await mongoose.connect(localUri, {});
    connection.isConnected = db.connections[0].readyState;
    console.log("Database connected successfully to local MongoDB:", localUri);
  } catch (error) {
    console.error("Both Atlas and local MongoDB connection failed:", error);
    process.exit(1);
  }
}

export default dbConnect;
