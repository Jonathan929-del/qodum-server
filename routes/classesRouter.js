// Imports
import express from 'express';
import Class from '../models/Class.js';





// Defining router
const router = express.Router();





// Fetching classes names
router.get('/names', async (req, res) => {
    try {

        // Classes
        const classes = await Class.find({}, {class_name:1});


        // Response
        res.status(200).json(classes);

    } catch (err) {
        res.status(500).json(err);
    }
});





// Export
export default router;