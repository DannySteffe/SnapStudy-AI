import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

const connectDB = async () => {
    try {
        // Connection options for production
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            bufferCommands: false, // Disable mongoose buffering
            bufferMaxEntries: 0, // Disable mongoose buffering
        };

        const conn = await mongoose.connect(process.env.MONGO_URI, options);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        
        // Connection event listeners
        mongoose.connection.on('connected', () => {
            console.log('📶 Mongoose connected to MongoDB');
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ Mongoose connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('📵 Mongoose disconnected from MongoDB');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('🔄 MongoDB connection closed through app termination');
            process.exit(0);
        });

        // Create indexes on startup
        await createIndexes();

        return conn;
    } catch (error) {
        console.error(`❌ MongoDB connection error: ${error.message}`);
        
        // If connection fails, provide helpful error messages
        if (error.message.includes('ENOTFOUND')) {
            console.log('💡 Tip: Check your MongoDB URI and network connection');
        } else if (error.message.includes('authentication failed')) {
            console.log('💡 Tip: Check your MongoDB username and password');
        } else if (error.message.includes('timeout')) {
            console.log('💡 Tip: Check your MongoDB server status and network');
        }
        
        process.exit(1);
    }
};

// Create database indexes for performance
const createIndexes = async () => {
    try {
        const db = mongoose.connection.db;
        
        // User indexes
        await db.collection('users').createIndex({ email: 1 }, { unique: true });
        await db.collection('users').createIndex({ createdAt: -1 });
        
        // Module indexes
        await db.collection('modules').createIndex({ user: 1, createdAt: -1 });
        await db.collection('modules').createIndex({ status: 1 });
        await db.collection('modules').createIndex({ user: 1, status: 1 });
        await db.collection('modules').createIndex({ title: 'text', description: 'text' });
        
        console.log('✅ Database indexes created successfully');
    } catch (error) {
        console.error('⚠️ Index creation error:', error.message);
        // Don't fail startup if indexes can't be created
    }
};

// Health check function
export const checkDBHealth = async () => {
    try {
        const adminDb = mongoose.connection.db.admin();
        const result = await adminDb.ping();
        return { status: 'healthy', result };
    } catch (error) {
        return { status: 'unhealthy', error: error.message };
    }
};

export default connectDB;
