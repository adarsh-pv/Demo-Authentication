const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors')
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection URI
const uri = process.env.MONGODB_URL || 'mongodb+srv://adarsh:adarshMern@cluster0.ewbbp1z.mongodb.net/?retryWrites=true&w=majority'
console.log(process.env.MONGODB_URL);

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Handle connection events
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB database');
});
app.use(cors())
app.use(bodyParser.json());
app.use(morgan('dev'));

// Routes
app.use('/api', authRoutes);

app.listen(PORT, () => {
    console.log(`Authentication server is running on port ${PORT}`);
});
