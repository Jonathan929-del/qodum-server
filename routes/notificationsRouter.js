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
            type:req.body.type || 'added_assignment',
            assignment_id:req.body.assignment_id || '',
            answer_id:req.body.answer_id || '',
            created_at:new Date()
        });


        // Response
        res.status(200).send('Notification sent successfully');

    } catch (err) {
        res.status(500).json(err.message);
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


        // Separate notifications into viewed and unviewed
        const unviewed_notifications = notifications.filter(notification => !notification.viewed);
        const viewed_notifications = notifications.filter(notification => notification.viewed);


        // Response
        res.status(200).json({
            unviewed_notifications,
            viewed_notifications
        });

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







// View notifications
router.post('/view-notifications', async (req, res) => {
    try {

        // Request params
        const {notifications_ids} = req.body;


        // Updating notifications documents
        const batch = getFirestore().batch();
        const notificationsCollection = getFirestore().collection('notifications');
        notifications_ids.forEach(id => {
            const notificationRef = notificationsCollection.doc(id);
            batch.update(notificationRef, {viewed:true});
        });
        await batch.commit();


        // Response
        res.status(200).json('Notifications marked as viewed successfully');

    } catch (err) {
        res.status(500).json(err);
    }
});





// Sending class notice
router.post('/send-class-notice', async (req, res) => {
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
        await db.collection('class_notices').add({
            to:req.body.topic.split('.')[req.body.topic.split('.').length - 1].replace(/_/g, '/'),
            title:req.body.title || 'New Notification',
            body:req.body.body || 'You have a new message.',
            viewed:false,
            type:req.body.type || 'added_assignment',
            created_at:new Date()
        });


        // Response
        res.status(200).send('Class notice sent successfully');

    } catch (err) {
        res.status(500).json(err.message);
    }
});





// Get user's class notices
router.post('/user-class-notices', async (req, res) => {
    try {

        // Request params
        const {to} = req.body;


        // Fetching
        const snapshot = await db.collection('class_notices').where('to', 'in', to).get();
        const notifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));


        // Separate notifications into viewed and unviewed
        const unviewed_notifications = notifications.filter(notification => !notification.viewed);
        const viewed_notifications = notifications.filter(notification => notification.viewed);


        // Response
        res.status(200).json({
            unviewed_notifications,
            viewed_notifications
        });

    } catch (err) {
        res.status(500).json(err);
    }
});







// CLass notices count
router.post('/class-notices-count', async (req, res) => {
    try {

        // Request params
        const {to} = req.body;


        // Fetching
        const notificationsCount = (await db.collection('class_notices').where('to', 'in', to).where('viewed', '==', false).get()).size;


        // Response
        res.status(200).json(notificationsCount);

    } catch (err) {
        res.status(500).json(err);
    }
});







// View class notices
router.post('/view-class-notices', async (req, res) => {
    try {

        // Request params
        const {notifications_ids} = req.body;


        // Updating notifications documents
        const batch = getFirestore().batch();
        const notificationsCollection = getFirestore().collection('class_notices');
        notifications_ids.forEach(id => {
            const notificationRef = notificationsCollection.doc(id);
            batch.update(notificationRef, {viewed:true});
        });
        await batch.commit();


        // Response
        res.status(200).json('Class notice marked as viewed successfully');

    } catch (err) {
        res.status(500).json(err);
    }
});





// Export
export default router;