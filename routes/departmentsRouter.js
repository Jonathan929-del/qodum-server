// Imports
import express from 'express';
import Department from '../models/Department.js';





// Defining router
const router = express.Router();





// Fetching departments
router.get('/names', async (req, res) => {
    try {

        // Designations
        const departments = await Department.find({}, {department:1});


        // Response
        res.status(200).json(departments);

    } catch (err) {
        res.status(500).json(err);
    }
});





// Export
export default router;