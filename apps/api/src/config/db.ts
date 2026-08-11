import mongoose from 'mongoose';

let isConnected = 0;

export const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = 1;
    return;
  }

  const connUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/boundup';
  try {
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 4000, // 4s timeout to prevent Vercel 10s function timeout
    });
    isConnected = conn.connection.readyState;
    console.log(`[BOUNDUP API] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[BOUNDUP API] MongoDB Connection Error:`, error);
  }
};
