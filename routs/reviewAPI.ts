import express from 'express';
import authController from '../controllers/authController';
import userController from '../controllers/userController';
import reviewsController from '../controllers/reviewsController';

const router = express.Router();
router.post(
  '/addReview',
  authController.protect,
  reviewsController.setUser,
  reviewsController.addReview
);

export default router;
