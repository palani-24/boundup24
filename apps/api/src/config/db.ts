import mongoose from 'mongoose';

export const connectDB = async () => {
  const connUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/boundup';
  try {
    const conn = await mongoose.connect(connUri);
    console.log(`[BOUNDUP API] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[BOUNDUP API] MongoDB Connection Error:`, error);
    process.exit(1);
  }
};
