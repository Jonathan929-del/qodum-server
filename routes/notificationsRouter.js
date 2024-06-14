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

        // Reqyest body
        const {title, body, topic, type, assignment_id, answer_id} = req.body;

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
            to:topic,
            title:title || 'New Notification',
            body:body || 'You have a new message.',
            viewed:false,
            type:type || 'added_assignment',
            assignment_id:assignment_id || '',
            answer_id:answer_id || '',
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
        const {topic} = req.body;


        // Fetching
        const snapshot = await db.collection('notifications').where('to', 'in', topic).get();
        const notifications = snapshot.docs.map(doc => ({
            id:doc.id,
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
        const {topic} = req.body;


        // Fetching
        const notificationsCount = (await db.collection('notifications').where('to', 'in', topic).where('viewed', '==', false).get()).size;


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

        // Request body
        const {title, body, topic, type, created_by} = req.body;

        // Message
        const message = {
            notification: {
                title:title || 'New Notification',
                body:body || 'You have a new message.'
            },
            topic:topic
        };

    
        // Sending
        await getMessaging().send(message);

    
        // Saving the message to firestore
        await db.collection('class_notices').add({
            topic,
            title:title || 'New Notification',
            body:body || 'You have a new message.',
            viewed:false,
            type:type || 'added_assignment',
            created_at:new Date(),
            created_by
        });


        // Response
        res.status(200).send('Class notice sent successfully');

    } catch (err) {
        res.status(500).json(err.message);
    }
});





// Edit class notice
router.post('/edit-class-notice', async (req, res) => {
    try {

        // Request params
        const {id, title, body} = req.body;


        // Updating class notice
        const batch = getFirestore().batch();
        const notificationsCollection = getFirestore().collection('class_notices');
        const notificationRef = notificationsCollection.doc(id);
        batch.update(notificationRef, {title, body});
        await batch.commit();


        // Response
        res.status(200).json('Class notice edited');

    } catch (err) {
        res.status(500).json(err.message);
    }
});





// Delete class notice
router.post('/delete-class-notice', async (req, res) => {
    try {

        // Request params
        const {id} = req.body;


        // Updating class notice
        const batch = getFirestore().batch();
        const notificationsCollection = getFirestore().collection('class_notices');
        const notificationRef = notificationsCollection.doc(id);
        batch.delete(notificationRef);
        await batch.commit();


        // Response
        res.status(200).json('Class notice deleted');

    } catch (err) {
        res.status(500).json(err.message);
    }
});





// Get user's class notices
router.post('/user-class-notices', async (req, res) => {
    try {

        // Request params
        const {topic} = req.body;


        // Fetching
        const snapshot = await db.collection('class_notices').where('topic', 'in', topic).get();
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





// Class notices count
router.post('/class-notices-count', async (req, res) => {
    try {

        // Request params
        const {topic} = req.body;


        // Fetching
        const notificationsCount = (await db.collection('class_notices').where('topic', 'in', topic).where('viewed', '==', false).get()).size;


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


















































// Sending notice
router.post('/send-notice', async (req, res) => {
    try {

        // Request body
        const {title, body, topic, type, created_by, notice_id} = req.body;

        // Message
        const message = {
            notification: {
                title:title || 'New Notification',
                body:body || 'You have a new message.'
            },
            topic:topic
        };

    
        // Sending
        await getMessaging().send(message);

    
        // Saving the message to firestore
        await db.collection('notices').add({
            topic,
            title:title || 'New Notification',
            body:body || 'You have a new message.',
            viewed:false,
            type:type || 'added_assignment',
            created_at:new Date(),
            created_by,
            notice_id
        });


        // Response
        res.status(200).send('Notice sent successfully');

    } catch (err) {
        res.status(500).json(err.message);
    }
});





// Edit notice
router.post('/edit-notice', async (req, res) => {
    try {

        // Request params
        const {notice_id, title, body} = req.body;


        // Get Firestore instance
        const db = getFirestore();


        // Fetching documents with notice_id
        const notificationsCollection = db.collection('notices');
        const querySnapshot = await notificationsCollection.where('notice_id', '==', notice_id).get();


        // Empty validations
        if(querySnapshot.empty){
            res.send('No notices found with the given notice_id');
            return;
        };


        // Updating
        const batch = db.batch();
        querySnapshot.forEach(doc => {
            const notificationRef = notificationsCollection.doc(doc.id);
            batch.update(notificationRef, { title, body });
        });
        await batch.commit();

    
        // Response
        res.status(200).json('Notices edited');

    } catch (err) {
        res.status(500).json(err);
    }
});





// Delete notice
router.post('/delete-notice', async (req, res) => {
    try {

    // Request body
    const {notice_id} = req.body;


    // Get Firestore instance
    const db = getFirestore();


    // Query to find all documents with the specified notice_id
    const notificationsCollection = db.collection('notices');
    const querySnapshot = await notificationsCollection.where('notice_id', '==', notice_id).get();


    // Empty validation
    if(querySnapshot.empty){
        res.send('No notices found with the given notice_id');
        return;
    };


    // Deleting
    const batch = db.batch();
    querySnapshot.forEach((doc) => {
        const notificationRef = notificationsCollection.doc(doc.id);
        batch.delete(notificationRef);
    });
    await batch.commit();


    // Response
    res.status(200).json('Notices deleted');

    } catch (err) {
        res.status(500).json(err);
    }
});





// Get user's notices
router.post('/user-notices', async (req, res) => {
    try {

        // Request params
        const {topic} = req.body;


        // Fetching
        const snapshot = await db.collection('notices').where('topic', 'in', topic).get();
        const notifications = snapshot.docs.map(doc => ({
            id:doc.id,
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





// Notices count
router.post('/notices-count', async (req, res) => {
    try {

        // Request params
        const {topic} = req.body;


        // Fetching
        const notificationsCount = (await db.collection('notices').where('topic', 'in', topic).where('viewed', '==', false).get()).size;


        // Response
        res.status(200).json(notificationsCount);

    } catch (err) {
        res.status(500).json(err);
    }
});





// View notices
router.post('/view-notices', async (req, res) => {
    try {

        // Request params
        const {notifications_ids} = req.body;


        // Updating notifications documents
        const batch = getFirestore().batch();
        const notificationsCollection = getFirestore().collection('notices');
        notifications_ids.forEach(id => {
            const notificationRef = notificationsCollection.doc(id);
            batch.update(notificationRef, {viewed:true});
        });
        await batch.commit();


        // Response
        res.status(200).json('Notice marked as viewed successfully');

    } catch (err) {
        res.status(500).json(err);
    }
});





// Export
export default router;