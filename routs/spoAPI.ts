import express from 'express';
import viewController from '../controllers/viewController';
const router = express.Router();

router.delete('/deleteAlbum', viewController.delAlbum);

router.delete('/deleteTrack', viewController.deleteTrack);

// router.put('/saveTrack', viewController.saveTrack);

router.put('/saveAlbum', viewController.saveAlbum);

export default router;
