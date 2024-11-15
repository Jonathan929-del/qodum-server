// Imports
import dotenv from 'dotenv';
import express from 'express';
import {Buffer} from 'buffer';
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3';





// Defining router
dotenv.config();
express.json({limit:'10mb'});
express.urlencoded({limit:'10mb', extended:true});
const router = express.Router();
// AWS credentials
const s3Client = new S3Client({
    region:process.env.AWS_REGION,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY,
        secretAccessKey:process.env.AWS_PERMENANT_SECRET_ACCESS_KEY
    }
});





// Upload image
router.post('/upload/image', async (req, res) => {
    try {

        // Body
        const {folder, file} = req.body;
        console.log(file);
        console.log('Content-Length:', req.headers['content-length']);


        // Validations
        if(!file){
            return res.status(400).send({
                status:'failure',
                message:'Please provide a file.',
            });
        };
        if(!folder){
            return res.status(400).send({
                status:'failure',
                message:'Please specify a folder.',
            });
        };
        const match = file.match(/^data:(image\/\w+);base64,/);
        if (!match) {
            return res.status(400).send({
                status:'failure',
                message:'Invalid file format. Expected Base64 encoded image.',
            });
        };
        const mimeType = match[1];
        const validFormats = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validFormats.includes(mimeType)) {
            return res.status(400).send({
                status: 'failure',
                message: 'Invalid format. Please select a JPEG or PNG image.',
            });
        };


        // Convert the Base64 string to a buffer
        const base64Data = file.replace(/^data:image\/\w+;base64,/, '');
        const fileBuffer = Buffer.from(base64Data, 'base64');


        // Check file size
        if (fileBuffer.length > 100 * 1024) {
            return res.status(400).send({
                status:'failure',
                message:'File too large. Please select an image smaller than 100KB.',
            });
        };


        // Generate unique file name
        const fileName = `${folder}/${Date.now()}_image.${mimeType.split('/')[1]}`;


        // Upload parameters
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName.replace(/\s+/g, ''),
            Body: fileBuffer,
            ContentType: mimeType,
        };


        // Upload the file to S3
        await s3Client.send(new PutObjectCommand(params));


        // Response
        res.status(201).json({
            status:'success',
            message:'File uploaded successfully',
            url:`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName.replace(/\s+/g, '')}`
        });

    }catch(err){
        res.status(500).json({
            status:'failure',
            message:'Error uploading file to S3',
            error:err.message
        });
    };
});





// Upload PDF file
router.post('/upload/pdf', async (req, res) => {
    try {

        // Body
        const {folder, file} = req.body;


        // Validations
        if (!file) {
            return res.status(400).send({
                status:'failure',
                message:'Please provide a file.',
            });
        };
        if(!folder){
            return res.status(400).send({
                status:'failure',
                message:'Please specify a folder.',
            });
        };
        // Ensure the file is a valid PDF
        const match = file.match(/^data:application\/pdf;base64,/);
        if(!match){
            return res.status(400).send({
                status: 'failure',
                message: 'Invalid file format. Expected Base64 encoded PDF.',
            });
        };
        const base64Data = file.replace(/^data:application\/pdf;base64,/, '');
        const fileBuffer = Buffer.from(base64Data, 'base64');
        if(fileBuffer.length > 5 * 1024 * 1024){
            return res.status(400).send({
                status:'failure',
                message:'File too large. Please select a PDF smaller than 5MB.',
            });
        };


        // File name
        const fileName = `${folder}/${Date.now()}_document.pdf`;


        // Upload parameters
        const params = {
            Bucket:process.env.AWS_BUCKET_NAME,
            Key:fileName.replace(/\s+/g, ''),
            Body:fileBuffer,
            ContentType:'application/pdf'
        };


        // Upload the file to S3
        await s3Client.send(new PutObjectCommand(params));


        // Response
        res.status(201).json({
            status:'success',
            message:'PDF uploaded successfully',
            url:`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName.replace(/\s+/g, '')}`
        });

    } catch (err) {
        res.status(500).json({
            status:'failure',
            message:'Error uploading PDF to S3',
            error:err.message
        });
    }
});





// Export
export default router;