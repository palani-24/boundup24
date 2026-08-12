import mongoose from 'mongoose';

let isConnected = 0;
const DEFAULT_ATLAS_URI = 'mongodb+srv://kingravanan1234_db_user:HuzzuGdDIDBdEf79@cluster0.qtyu75k.mongodb.net/boundup?retryWrites=true&w=majority';

export const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = 1;
    return;
  }

  let connUri = process.env.MONGODB_URI || DEFAULT_ATLAS_URI;

  if (connUri.includes('localhost') || connUri.includes('127.0.0.1')) {
    connUri = DEFAULT_ATLAS_URI;
  }

  // Clean up angle brackets if user copied template brackets into Vercel environment variables
  if (connUri.includes('<') || connUri.includes('>')) {
    connUri = connUri.replace(/<([^>]+)>/g, '$1').replace(/[<>]/g, '');
  }

  try {
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 5000,
    });
    const hostName = conn.connection.host || conn.connection.name || 'Atlas';
    console.log(`[BOUNDUP API] MongoDB Connected: ${hostName}`);
  } catch (error) {
    console.error(`[BOUNDUP API] MongoDB Connection Error:`, error);
  }
};
