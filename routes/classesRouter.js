// Imports
import express from 'express';
import Class from '../models/Class.js';





// Defining router
const router = express.Router();





// Fetching classes
router.get('/', async (req, res) => {
    try {

        // Classes
        const classes = await Class.find();


        // Response
        res.status(200).json(classes);

    } catch (err) {
        res.status(500).json(err);
    }
});





// Export
export default router;