import express from 'express';
import viewController from '../controllers/viewController';
import authController from '../controllers/authController';

const router = express.Router();

router.put('/getToken', viewController.getToken);

router.use(authController.protect);

router.delete('/deleteAlbum', viewController.delAlbum);

router.delete('/deleteTrack', viewController.deleteTrack);

router.put('/saveTrack', viewController.saveTrack);

router.put('/saveAlbum', viewController.saveAlbum);

router.put('/followArtist', viewController.followArtist);

router.delete('/unfollowArtist', viewController.unfollowArtist);

router.put('/createPlaylist', viewController.createPlaylist);

router.delete('/deletePlaylist', viewController.deletePlaylist);

router.put('/changePlaylist', viewController.changePlaylistDetail);

router.put('/addTrackToPlaylist', viewController.addTracksToPlaylist);

router.delete(
  '/deleteTrackFromPlaylist',
  viewController.deleteTracksFromPlaylist
);

router.patch('/startSearch', viewController.searchRequest);

router.patch('/startPlayer', viewController.getCurrentTrack);

router.put('/startPlayback', viewController.startPlayback);

router.put('/startPlaylistPlayback', viewController.startPlaylistPlayback);

router.put('/pausePlayback', viewController.pausePlayback);

router.put('/skipToNextTrack', viewController.skipToNextTrack);

router.put('/skipToPreviousTrack', viewController.skipToPreviousTrack);

router.patch('/setDeviceId', viewController.setDeviceId);

router.put('/changeDevice', viewController.changeDevice);

router.get('/getCurrentlyTrack', viewController.getCurrentlyTrack);
router.put('/changeVolume', viewController.changeVolume);

export default router;
