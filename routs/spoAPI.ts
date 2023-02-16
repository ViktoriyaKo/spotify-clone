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

router.delete('/deletePlaylist', viewController.deletePlaylist);

router.put('/changePlaylist', viewController.changePlaylistDetail);

router.put('/addTrackToPlaylist', viewController.addTracksToPlaylist);

router.delete(
  '/deleteTrackFromPlaylist',
  viewController.deleteTracksFromPlaylist
);

router.patch('/startSearch', viewController.searchRequest);

router.patch('/startPlayer', viewController.getCurrentTrack);

export default router;
