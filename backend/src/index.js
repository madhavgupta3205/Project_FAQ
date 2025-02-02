import 'dotenv/config';
import express from 'express';


const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/faqs', faqRoutes);


const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    const PORT = process.env.PORT ;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
