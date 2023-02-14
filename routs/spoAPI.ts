import express from 'express';
import viewController from '../controllers/viewController';
const router = express.Router();

router.delete('/deleteAlbum', viewController.delAlbum);

router.delete('/deleteTrack', viewController.deleteTrack);

router.put('/saveTrack', viewController.saveTrack);

router.put('/saveAlbum', viewController.saveAlbum);

router.put('/followArtist', viewController.followArtist);

router.delete('/unfollowArtist', viewController.unfollowArtist);

router.put('/createPlaylist', viewController.createPlaylist);

export default router;
