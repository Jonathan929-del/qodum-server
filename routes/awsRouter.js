// Imports
import AWS from 'aws-sdk';
import multer from 'multer';
import express from 'express';





// Defining router
const router = express.Router();
// Multer storage
const upload = multer({ storage: multer.memoryStorage() });
// AWS credentials
const s3 = new AWS.S3({
    accessKeyId:process.env.AWS_ACCESS_KEY,
    secretAccessKey:process.env.AWS_SECRET_KEY,
    region:process.env.AWS_REGION
});





// Last payment
router.post('/image', upload.single('file'), async (req, res) => {
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


        // File data
        const fileContent = req.file.buffer;
        const fileName = `${folder || 'uploads'}/${Date.now()}_${req.file.originalname}`;
        const contentType = req.file.mimetype;


        // Params
        const params = {
            Bucket:process.env.AWS_BUCKET_NAME,
            Key:fileName,
            Body:fileContent,
            ContentType:contentType
        };


        // Upload to S3
        const data = await s3.upload(params).promise();
        res.json({
            status:'success',
            message:'File uploaded successfully',
            url:data.Location
        });

    } catch (err) {
        res.status(500).json(err);
    }
});





// Export
export default router;