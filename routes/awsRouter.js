// Imports
import multer from 'multer';
import dotenv from 'dotenv';
import express from 'express';
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3';





// Defining router
dotenv.config();
const router = express.Router();
// Multer storage
const storage = multer.memoryStorage();
const upload = multer({ 
    storage:storage,
    limits:{fileSize:500 * 1024}
});
// AWS credentials
const s3Client = new S3Client({
    region:process.env.AWS_REGION,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY,
        secretAccessKey:process.env.AWS_PERMENANT_SECRET_ACCESS_KEY
    }
});





// Upload
router.put('/upload', upload.single('file'), async (req, res) => {
    try {

        // Request body: folder
        const {folder} = req.body;

    
        // Validations
        if (!req.file) {
            return res.status(400).send({
                status:'failure',
                message:'Please provide a file.'
            });
        };
        const validFormats = ['image/jpeg', 'image/png', 'image/jpg'];
        const mimeType = req.file.mimetype;
        if (!validFormats.includes(mimeType)) {
            return res.status(400).send({
                status:'failure',
                message:'Invalid format. Please select a JPEG or PNG image.'
            });
        };
        if(req.file.size > 500 * 1024){
            return res.status(400).send({
                status:'failure',
                message:'File too large. Please select an image smaller than 500KB.'
            });
        };


        // File name
        const fileName = `${folder}/${Date.now()}_${req.file.originalname}`;


        // Upload parameters
        const params = {
            Bucket:process.env.AWS_BUCKET_NAME,
            Key:encodeURI(fileName),
            Body:req.file.buffer,
            ContentType:mimeType
        };


        // Upload the file to S3
        await s3Client.send(new PutObjectCommand(params));


        // Response
        res.status(201).json({
            status:'success',
            message:'File uploaded successfully',
            url:`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${encodeURI(fileName)}`
        });

    }catch(err){
        console.error('Error uploading file:', err);
        res.status(500).json({
            status:'failure',
            message:'Error uploading file to S3',
            error:err.message
        });
    };
});






// Export
export default router;