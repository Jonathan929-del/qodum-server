// Imports
import multer from 'multer';
import express from 'express';
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3';





// Defining router
const router = express.Router();
// Multer storage
const storage = multer.memoryStorage();
const upload = multer({storage});
// AWS credentials
const s3Client = new S3Client({
    region:process.env.AWS_REGION,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
        // secretAccessKey:'8YEPxmp4ZndtNxbcJILpPJwAi4VXEC+UBhJIBoKD'
    } 
});





// Upload
router.put('/upload', upload.single('file'), async (req, res) => {
    try {

        // Request body
        const {folder} = req.body;

    
        // Validation
        if(!req.file){
            return res.send({
                status:'failure',
                message:'Please provide a file'
            });
        };


        const {file} = req;
        const fileName = `${folder}/${Date.now()}_${file.originalname}`;
    
    
        // Prepare S3 upload parameters
        const params = {
            Bucket:process.env.AWS_BUCKET_NAME,
            Key:encodeURI(fileName),
            Body:file.buffer,
            ContentType:file.mimetype
        };
    
    
        // Upload the file to S3
        await s3Client.send(new PutObjectCommand(params));
    

        // Respond with success
        res.status(201).json({
            status:'success',
            message:'File uploaded successfully',
            url:`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${encodeURI(fileName + Date.now())}`
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