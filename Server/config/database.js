const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    const dbName = process.env.DB_NAME;

    if (!mongoURI || !dbName) {
      throw new Error("MONGO_URI and DB_NAME must be set in environment variables");
    }

    console.log(`Connecting to MongoDB at: ${mongoURI}/${dbName}`);

    const conn = await mongoose.connect(`${mongoURI}/${dbName}`);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    throw error; // Re-throw so app.js can handle it
  }
};

module.exports = connectDB;
