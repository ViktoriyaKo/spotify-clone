import express from 'express';
import authController from '../controllers/authController';
import viewsController from '../controllers/viewController';

const router = express.Router();

router.get('/', viewsController.getOverview);

router.get('/home/', viewsController.getPlaylists);

router.get('/favorite/', viewsController.getFavoriteTracks);

router.get('/profile/', viewsController.getProfileMain);

router.get('/profile/account/', viewsController.changeProfile);

router.get('/profile/password/', viewsController.changeProfilePassword);

router.get('/library/playlists/', viewsController.getUserPlaylists);

router.get('/library/artists/', viewsController.getUserArtists);

router.get('/library/albums/', viewsController.getUserAlbums);

router.get('/login', viewsController.login);

router.get('/callback', viewsController.callback);

export default router;
