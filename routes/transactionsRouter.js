// Imports
import express from 'express';
import bodyParser from 'body-parser';





// Defining router
const router = express.Router();
router.use(express.urlencoded({extended:true}));
router.use(express.json());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));





// Create received transaction
router.post('/receive', async (req, res) => {
    try {

        console.log('Received webhook data:', req.body);  // Log raw data
        
        // Assuming you're verifying the hash
        const isHashValid = verifyHash(req.body, req.body.hash);
        
        if (!isHashValid) {
            console.error('Invalid hash!');
            return res.status(400).send('Invalid hash');
        }
        
        res.status(200).send('Webhook received successfully');

    } catch (err) {
        res.status(500).send(`Error while creating received transaction: ${err}`);
    }
});





// Export
export default router;