const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const app = express();
const authRoutes = require('./Routes/auth');
const protectedRoute = require('./Routes/protectedRoute');
const bookingroutes = require('./Routes/Booking');


app.use(express.json());
dotenv.config();

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/Usermangement', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Connected to MongoDB database");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB database:", err);
    });

// Use routes
app.use('/auth', authRoutes);
app.use('/protected', protectedRoute);
app.use('/booking', bookingroutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
