import pg from "pg";
const { Client } = pg;

let db;

export const connectDB = async () => {
  if (!db) {
    const connectionString = process.env.DATABASE_URL;

    db = new Client({
      connectionString,
      ssl: {
        rejectUnauthorized: false, // required on Render
      },
    });

    try {
      await db.connect();
      console.log("✅ Connected to PostgreSQL database");
    } catch (error) {
      console.error("❌ Database connection failed:", error.message);
      throw error;
    }
  }

  return db;
};

export const getDB = () => {
  if (!db) {
    throw new Error("Database not connected. Call connectDB first.");
  }
  return db;
};
