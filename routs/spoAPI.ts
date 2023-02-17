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

router.patch('/startSearch', viewController.searchRequest);

router.patch('/startPlayer', viewController.getCurrentTrack);

router.put('/startPlayback', viewController.startPlayback);

router.put('/startPlaylistPlayback', viewController.startPlaylistPlayback);

router.put('/pausePlayback', viewController.pausePlayback);

router.put('/skipToNextTrack', viewController.skipToNextTrack);

router.put('/skipToPreviousTrack', viewController.skipToPreviousTrack);

router.put('/getToken', viewController.getToken);

router.patch('/setDeviceId', viewController.setDeviceId);

router.put('/changeDevice', viewController.changeDevice);

router.get('/getCurrentlyTrack', viewController.getCurrentlyTrack);

export default router;
