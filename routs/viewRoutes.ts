import express from 'express';
import authController from '../controllers/authController';
import viewsController from '../controllers/viewController';

const router = express.Router();

router.get('/', viewsController.getOverview);

router.get('/home/', viewsController.getPlaylists);

router.get('/favorite/', viewsController.getFavoriteTracks);

export default router;
