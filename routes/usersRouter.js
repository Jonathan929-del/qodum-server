// Imports
import express from 'express';
import User from '../models/User.js';





// Defining router
const router = express.Router();





// Fetching user
router.get('/', async (req, res) => {
    try {
        const user = await User.find();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});





// Creating user
router.post('/', async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json(err);
    }
});





// Export
export default router;