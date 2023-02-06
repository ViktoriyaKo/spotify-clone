import express from 'express';
import authController from '../controllers/authController';
import viewsController from '../controllers/viewController';

const router = express.Router();

router.get(
  '/',
  viewsController.getOverview,
);

router.get('/playlists/', authController.protect, viewsController.getPlaylists);

export default router;
