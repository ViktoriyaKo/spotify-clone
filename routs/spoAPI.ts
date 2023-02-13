
import express from 'express';
import viewController from '../controllers/viewController';
const router = express.Router();

router.delete('/deleteAlbum', viewController.delAlbum);

router.put('/saveAlbum', viewController.saveAlbum);

router.put('/followArtist', viewController.followArtist);

router.delete('/unfollowArtist', viewController.unfollowArtist);

export default router;