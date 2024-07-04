// Imports
import fs from 'fs';
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
    // credential:admin.credential.cert(JSON.parse(fs.readFileSync('./qodum-9c179-firebase-adminsdk-zylgw-84904d0ba2.json', 'utf8')))
    credential:admin.credential.cert({
        "type": "service_account",
        "project_id": "qodum-9c179",
        "private_key_id": "84904d0ba23240242079747d29c7c4fc783667b1",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCvsINd6cvYNESb\nt3T3/gxO466yGn1EIbLPXSvXvvCcooNLjeLyYrKKSyLBsTRkYJLEbAAOIgKjALMA\nwpi/bcoLZlwbja95H7z0gVvNPmoIozGbsP1otfPfgvPByCPvgSbrvOO6b9kr5Lxh\na7beM2Z0vlqMj3A9HwXRvu4TxKRM7WciRFomkfDlSDthAlhRgO1ROQFXvdlQBS3F\nb5DxDN/5JArWscNj1L+BnNllsC38zyBe4Xr6TqCDu6EadQ7QYmMfpkXETwyHWfFk\njIOH3NR1zUP+CDrqVdQqdUHIVJZKykXYdYRyibpAw/xuYhLcQg4kSwQSyET2KoSc\nWcx+kUfPAgMBAAECggEAKvhUGPsexUF7ak6DiEgVgJIFX0BFVQ2c60TRfVIRDW5e\nCHOqhzgGjPZ1iMQrmUVZgDseBFbjKDT6kvwFWgSjPwiJDKApw8k0cOTWrCtQyc4I\nSxkN0bd27zrbHZEy4NhIya2IUUgb6LVoMbejoVMXAwSvpuNKQ1i8FqHJHwKgYMPj\n393wSWgFynxDutMryMQrDhNrxSOHeso8bkPQ2hhfLyIENJquPQXY4lGyjyknYiLW\nvsjywIDJce7QsQFAR3GqJMfYohg88XK7SqPuarzcVOcwVHgMek74fMIyrppw8xhx\nnD+S6ZvADYx9nchpGBsHN2+044ENL9gU7fHOjIrCgQKBgQDhYQh/X4mVIm8CJ1KM\nwD1ZWLEJUmP7doLoU+CMehTz7NNOV5FmrJso8i6j1MG56OPuZe+V/fGiEe9tghan\nnNpYkO2hp/RV5Eg13p0mt/DVazraTbrxOyjrYi3rPxWxJ+eyAJiHN3NwqUBzp4g6\ne6MRq+g0B9aHiVKcYf9LdBBrwQKBgQDHjzcoGpKBQMeGMDvBeYgg7Wx0At7pXBOm\n+IatvkqlzKK117xSb2LDUxENUkQAbUHbJNKAtlqA1jACugVLzMIyzCVltnogvNoL\nrQtoJBW6PeUC66DZZu5iyh7P+7E5FmfH4b8SpSPmdGquQabmR6wb+UYLKgp30zKU\nE3fd8GbXjwKBgCuy57XirUd4RLPTMgNOZtbDBph7HB2urdUkJj62kQd2nMXs3qlc\nwDzhMD/dya4lRMR9iUW41jgJaDYAaioXlJJlj12vtgVNXN7tCeVu9sg6oU+gkKWj\nRdzVzXd2ZNtTlG4EBY76JmzqtC94hUZpoIWVolEsT+E5tAXUTm6v01tBAoGBAJUk\nwABE+8GF/JiZa8+JWOfjCe8aRib6HeXoUB+B3KBVdDWbaq/hd1qrtk7ScOgwv8tc\nlcaEgtdPPMqM5HBmM61rTXfbDSNygTPAvIm0jliG8aVhHPHeL8O9c5HVdfpIeH+2\ng+sXaOFPmHtrraTlZAf0IRku7mvneCGa+zbv+KyZAoGBAIPCnE/zcxKbdTPkNuCa\nVweAcvF/yb5crIYBvysH8E5bcQt0Oo0VLlW6ayyK4BDpfu5zY6nTEV4kO2g+83QU\nBCNDJGXb3J8YfNNQDprd21eUPH4WYhfHmEQE/sxYZzRXgRU2GQ1UHpcReYBc5iET\ns6PLgW+EQIdP3pzNioWPENzq\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-zylgw@qodum-9c179.iam.gserviceaccount.com",
        "client_id": "102682588734751607691",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-zylgw%40qodum-9c179.iam.gserviceaccount.com",
        "universe_domain": "googleapis.com"
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
        res.status(500).json(err);
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