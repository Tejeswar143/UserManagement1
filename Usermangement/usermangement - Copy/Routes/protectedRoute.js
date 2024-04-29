const express = require('express');
const router = express.Router();
const { verifyUser, verifyAdmin } = require('../middleware/authMiddleware');


// Protected route
router.get('/admin-page', verifyAdmin, (req, res) => {
    res.status(200).json({ message: 'admin dashboard access' });
});

router.get('/user-page', verifyUser, (req, res) => {
    res.status(200).json({ message: 'user dashboard access' });
});



module.exports = router;