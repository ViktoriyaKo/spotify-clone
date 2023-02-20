import express from 'express';
import authController from '../controllers/authController';
import userController from '../controllers/userController';

const router = express.Router();
router.post('/signup', authController.signup);
router.post('/login', authController.login);
//@ts-ignore
router.get('/logout', authController.logout);
router.use(authController.protect);
router.patch('/updateMyPassword', authController.updatePassword);

router.patch(
  '/updateMe',
  userController.uploadPhoto,
  userController.resizePhoto,
  userController.update,
);

export default router;
