// Imports
import dotenv from 'dotenv';
import express from 'express';
import {getFirestore} from 'firebase-admin/firestore';
import {getMessaging} from 'firebase-admin/messaging';
import {initializeApp, cert} from 'firebase-admin/app';





// Defining router
const router = express.Router();
dotenv.config();





// Initializing app
const serviceAccount = {
    type:process.env.TYPE,
    project_id:process.env.PROJECT_ID,
    private_key_id:process.env.PRIVATE_KEY_ID,
    private_key:process.env.PRIVATE_KEY,
    client_email:process.env.CLIENT_EMAIL,
    client_id:process.env.CLIENT_ID,
    auth_uri:process.env.AUTH_URI,
    token_uri:process.env.TOKEN_URI,
    auth_provider_x509_cert_url:process.env.AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url:process.env.CLIENT_CERT_URL,
    universe_domain:process.env.UNIVERSE_DOMAIN
  }
initializeApp({
    credential:cert(serviceAccount),
});
const db = getFirestore();







// Sending notification
router.post('/send-notification', async (req, res) => {
    try {

        // Message
        const message = {
            notification: {
                title:req.body.title || 'New Notification',
                body:req.body.body || 'You have a new message.'
            },
            topic:req.body.topic
        };

    
        // Sending
        await getMessaging().send(message);

    
        // Saving the message to firestore
        await db.collection('notifications').add({
            to:req.body.topic.split('.')[req.body.topic.split('.').length - 1].replace(/_/g, '/'),
            title:req.body.title || 'New Notification',
            body:req.body.body || 'You have a new message.',
            viewed:false,
            created_at:new Date()
        });


        // Response
        res.status(200).send('Notification sent successfully');

    } catch (err) {
        res.status(500).json(err);
    }
});







// Get user's notifications
router.post('/user-notifications', async (req, res) => {
    try {

        // Request params
        const {to} = req.body;


        // Fetching
        const snapshot = await db.collection('notifications').where('to', 'in', to).get();
        const notifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));


        // Response
        res.status(200).json(notifications);

    } catch (err) {
        res.status(500).json(err);
    }
});







// Notifications count
router.post('/notifications-count', async (req, res) => {
    try {

        // Request params
        const {to} = req.body;


        // Fetching
        const notificationsCount = (await db.collection('notifications').where('to', 'in', to).where('viewed', '==', false).get()).size;


        // Response
        res.status(200).json(notificationsCount);

    } catch (err) {
        res.status(500).json(err);
    }
});







// Export
export default router;