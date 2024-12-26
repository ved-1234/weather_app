import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing
import OtpVerification from './models/otpVerification.js';

dotenv.config();

const app = express();

// Middleware
// Replace with your frontend URL
const corsOptions = {
  origin: 'https://skycast12345.netlify.app',  // Replace with your frontend URL
  methods: ['GET', 'POST'],  // Specify allowed methods
  credentials: true,  // Allow credentials like cookies to be sent
};

app.use(cors(corsOptions));  // Apply CORS with specific options

app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  mobileno: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or App Password
  },
  logger: true, // Log SMTP traffic
  debug: true,
  pool: true,   // This allows reuse of connections, which is helpful if you're sending many emails
  maxConnections: 5, 
});

// Function to send OTP
const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's email
    to: email, // Recipient's email
    subject: 'OTP Verification Code',
    text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
  };

  try {
    console.log('Sending OTP to:', email); // Log the email address
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully');
  } catch (error) {
    console.error('Error sending OTP email:', error); // Log the error to help debug
    throw new Error('Error sending OTP email');
  }
};

// Route to Check User for Sign-In
app.post('/api/check-user', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    // Check if password matches (assuming password is hashed)
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    // User verified successfully
    res.status(200).json({ message: 'User verified successfully', userId: user._id });
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Route to Create User and Send OTP
app.post('/api/users', async (req, res) => {
  const { username, password, email, mobileno } = req.body;

  if (!username || !password || !email || !mobileno) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create a new user
    const newUser = new User({ username, password: hashedPassword, email, mobileno });
    await newUser.save();

    // Generate OTP and expiration time
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to database
    const otpRecord = new OtpVerification({
      userId: newUser._id, // Reference the new user
      otp,
      expiresAt: otpExpiresAt,
    });
    await otpRecord.save();

    // Send OTP to the user's email
    try {
      await sendOtpEmail(email, otp);
      return res.status(201).json({
        message: 'User created. OTP sent to email.',
        userId: newUser._id,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error sending OTP, user created but OTP could not be sent',
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Route to Verify OTP
app.post('/api/verify-otp', async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.status(400).json({ message: 'User ID and OTP are required' });
  }

  try {
    const otpRecord = await OtpVerification.findOne({ userId, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // OTP verified
    res.status(200).json({ message: 'OTP verified successfully' });

    // Delete OTP record after successful verification
    await OtpVerification.deleteOne({ userId, otp });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
