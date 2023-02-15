
import express from 'express';
import reviewController from '../controllers/reviewController';
import authController from '../controllers/authController';
const router = express.Router();


//@ts-ignore
router.put('/addReview',authController.protect, reviewController.setTourUserIds, reviewController.addReview);

export default router;