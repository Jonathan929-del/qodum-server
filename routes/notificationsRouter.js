// Imports
import moment from 'moment';
import dotenv from 'dotenv';
import cron from 'node-cron';
import express from 'express';
import admin from 'firebase-admin';
import {getFirestore} from 'firebase-admin/firestore';
import {getMessaging} from 'firebase-admin/messaging';





// Defining router
const router = express.Router();
dotenv.config();





// Initializing app
admin.initializeApp({
    credential:admin.credential.cert({
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
    })
});
const db = admin.firestore();







// Sending notification
router.post('/send-notification', async (req, res) => {
    try {

        // Reqyest body
        const {title, body, topic, type, assignment_id, answer_id} = req.body;

        // Message
        const message = {
            notification: {
                title:title || 'New Notification',
                body:body || 'You have a new message.'
            },
            topic
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
        const snapshot = await db.collection('notifications').where('to', 'in', topic).orderBy('created_at', 'desc').get();
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
        const {title, body, topic, type, created_by, class_notice_id} = req.body;

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
            class_notice_id,
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
        const {class_notice_id, title, body} = req.body;


        // Get Firestore instance
        const db = getFirestore();


        // Fetching documents with class_notice_id
        const notificationsCollection = db.collection('class_notices');
        const querySnapshot = await notificationsCollection.where('class_notice_id', '==', class_notice_id).get();


        // Empty validations
        if(querySnapshot.empty){
            res.send('No notices found with the given class_notice_id');
            return;
        };


        // Updating
        const batch = db.batch();
        querySnapshot.forEach(doc => {
            const notificationRef = notificationsCollection.doc(doc.id);
            batch.update(notificationRef, {title, body});
        });
        await batch.commit();

    
        // Response
        res.status(200).json('Notices edited');

    } catch (err) {
        res.status(500).json(err.message);
    }
});





// Delete class notice
router.post('/delete-class-notice', async (req, res) => {
    try {

    // Request body
    const {class_notice_id} = req.body;


    // Get Firestore instance
    const db = getFirestore();


    // Query to find all documents with the specified class_notice_id
    const notificationsCollection = db.collection('class_notices');
    const querySnapshot = await notificationsCollection.where('class_notice_id', '==', class_notice_id).get();


    // Empty validation
    if(querySnapshot.empty){
        res.send('No class notices found with the given class_notice_id');
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
    res.status(200).json('Class notices deleted');

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
        const snapshot = await db.collection('class_notices').where('topic', 'in', topic).orderBy('created_at', 'desc').get();
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





// Schedule notice
router.post('/schedule-notice', async (req, res) => {
    try {

        // Request body
        const {title, body, topic, type, created_by, notice_id, schedule_date} = req.body;


        // Message
        const message = {
            notification: {
                title:title || 'New Notification',
                body:body || 'You have a new message.'
            },
            topic:topic
        };


        // Schedule date
        const scheduleDate = new Date(schedule_date);


        // Validate schedule date
        if(scheduleDate <= new Date()){
            return res.status(400).send('Schedule date must be in the future.');
        };


        // Schedule the job
        cron.schedule(`${scheduleDate.getUTCSeconds()} ${scheduleDate.getUTCMinutes()} ${scheduleDate.getUTCHours()} ${scheduleDate.getUTCDate()} ${scheduleDate.getUTCMonth() + 1} *`, 
            async () => {
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
            }
        );


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
        const snapshot = await db.collection('notices').where('topic', 'in', topic).orderBy('created_at', 'desc').get();
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








































// Sending e-diary
router.post('/send-ediary', async (req, res) => {
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
        await db.collection('ediaries').add({
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
        res.status(200).send('E-diary sent successfully');

    } catch (err) {
        res.status(500).json(err.message);
    }
});





// Edit e-diary
router.post('/edit-ediary', async (req, res) => {
    try {

        // Request params
        const {notice_id, title, body} = req.body;


        // Get Firestore instance
        const db = getFirestore();


        // Fetching documents with notice_id
        const notificationsCollection = db.collection('ediaries');
        const querySnapshot = await notificationsCollection.where('notice_id', '==', notice_id).get();


        // Empty validations
        if(querySnapshot.empty){
            res.send('No e-diaries found with the given notice_id');
            return;
        };


        // Updating
        const batch = db.batch();
        querySnapshot.forEach(doc => {
            const notificationRef = notificationsCollection.doc(doc.id);
            batch.update(notificationRef, {title, body});
        });
        await batch.commit();

    
        // Response
        res.status(200).json('E-diaries edited');

    } catch (err) {
        res.status(500).json(err);
    }
});





// Delete e-diary
router.post('/delete-ediary', async (req, res) => {
    try {

    // Request body
    const {notice_id} = req.body;


    // Get Firestore instance
    const db = getFirestore();


    // Query to find all documents with the specified notice_id
    const notificationsCollection = db.collection('ediaries');
    const querySnapshot = await notificationsCollection.where('notice_id', '==', notice_id).get();


    // Empty validation
    if(querySnapshot.empty){
        res.send('No e-diaries found with the given notice_id');
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
    res.status(200).json('E-diaries deleted');

    } catch (err) {
        res.status(500).json(err);
    }
});





// Get user's e-diaries
router.post('/user-ediaries', async (req, res) => {
    try {

        // Request params
        const {topic} = req.body;


        // Fetching
        const snapshot = await db.collection('ediaries').where('topic', 'in', topic).orderBy('created_at', 'desc').get();
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





// E-diaries count
router.post('/ediaries-count', async (req, res) => {
    try {

        // Request params
        const {topic} = req.body;


        // Fetching
        const notificationsCount = (await db.collection('ediaries').where('topic', 'in', topic).where('viewed', '==', false).get()).size;


        // Response
        res.status(200).json(notificationsCount);

    } catch (err) {
        res.status(500).json(err);
    }
});





// View ediaries
router.post('/view-ediaries', async (req, res) => {
    try {

        // Request params
        const {ediaries_ids} = req.body;


        // Updating notifications documents
        const batch = getFirestore().batch();
        const notificationsCollection = getFirestore().collection('ediaries');
        ediaries_ids.forEach(id => {
            const notificationRef = notificationsCollection.doc(id);
            batch.update(notificationRef, {viewed:true});
        });
        await batch.commit();


        // Response
        res.status(200).json('E-diary marked as viewed successfully');

    } catch (err) {
        res.status(500).json(err);
    }
});


























// Creating flash message
router.post('/create-flash-message', async (req, res) => {
    try {

        // Request body
        const {message, expires_on} = req.body;

    
        // Saving the message to firestore
        await db.collection('flash_messages').add({
            message,
            expires_on:new Date(expires_on),
            created_at:new Date()
        });


        // Response
        res.status(200).send('Flash message sent successfully');

    } catch (err) {
        res.status(500).json(err.message);
    }
});





// Fetch flash message
router.get('/fetch-flash-messages', async (req, res) => {
    try {


        // Fetching
        const snapshot = await db.collection('flash_messages').orderBy('created_at', 'desc').get();
        const flashMessages = snapshot.docs.map(doc => ({
            id:doc.id,
            ...doc.data()
        }));


        // Response
        res.status(200).json(flashMessages);

    } catch (err) {
        res.status(500).json('Error fetching flash messages', err);
    }
});





// Schedule flash message
router.post('/schedule-flash-message', async (req, res) => {
    try {

        // Request body
        const {message, expires_on, schedule_date} = req.body;


        // Schedule date
        const scheduleDate = new Date(schedule_date);


        // Validate schedule date
        if(scheduleDate <= new Date()){
            return res.status(400).send('Schedule date must be in the future.');
        };


        // Schedule the job
        cron.schedule(`${scheduleDate.getUTCSeconds()} ${scheduleDate.getUTCMinutes()} ${scheduleDate.getUTCHours()} ${scheduleDate.getUTCDate()} ${scheduleDate.getUTCMonth() + 1} *`, 
            async () => {
                await db.collection('flash_messages').add({
                    message,
                    expires_on:new Date(expires_on),
                    created_at:new Date()
                });
            }
        );


        // Response
        res.status(200).send('Flash message sent successfully');

    } catch (err) {
        res.status(500).json(err.message);
    }
});





// Setting is active to be false if past last date of submission
cron.schedule('* * * * *', async () => {
    try{

        const currentDate = new Date();
        const snapshot = await db.collection('flash_messages').where('expires_on', '<=', currentDate).get();
    
        const batch = db.batch();
        snapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
    
        await batch.commit();
        console.log('Expired flash messages deleted successfully.');

    } catch (error) {
        console.error('Error updating assignments:', error);
    }
});





// Export
export default router;