// Imports
import express from 'express';
import SmsTemplate from '../models/SmsTemplate.js';





// Defining router
const router = express.Router();





// Fetching sms templates types
router.get('/types', async (req, res) => {
    try {

        // Sms templates
        const smsTemplates = await SmsTemplate.find({}, {sms_type:1});


        // Response
        res.status(200).json(smsTemplates);

    } catch (err) {
        res.status(500).json(err);
    }
});





// Export
export default router;