import express from 'express';
import authController from '../controllers/auth.controller.js';
import userController from '../controllers/user.controller.js';
import { validateToken } from '../middlewares/validateToken.js';
import verifyRole from '../middlewares/verifyRole.js';
import artistController from '../controllers/artist.controller.js';
import albumController from '../controllers/album.controller.js';
import trackController from '../controllers/track.controller.js';
import favoriteController from '../controllers/favorite.controller.js';
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);


router.use(validateToken);

router.get("/logout", authController.logout);

router.post("/users/add-user", verifyRole.allowAdmin, userController.addUser);
router.get("/users", verifyRole.allowAdmin, userController.getUsers);
router.delete("/users/:user_id", verifyRole.allowAdmin, userController.deleteUser);
router.put("/users/update-password", verifyRole.allowAll, userController.updateUserPassword);

router.post("/artists/add-artist", verifyRole.allowAdmin, artistController.addArtist);
router.get("/artists", verifyRole.allowAll, artistController.getArtists);
router.get("/artists/:artist_id", verifyRole.allowAll, artistController.getArtist);
router.put("/artists/:artist_id", verifyRole.allowAdminAndEditor, artistController.updateArtist);
router.delete("/artists/:artist_id", verifyRole.allowAdminAndEditor, artistController.deleteArtist);

router.post("/albums/add-album", verifyRole.allowAdmin, albumController.addAlbum);
router.get("/albums", verifyRole.allowAll, albumController.getAlbums);
router.get("/albums/:album_id", verifyRole.allowAll, albumController.getAlbum);
router.put("/albums/:album_id", verifyRole.allowAdminAndEditor, albumController.updateAlbum);
router.delete("/albums/:album_id", verifyRole.allowAdminAndEditor, albumController.deleteAlbum);

router.post("/tracks/add-track", verifyRole.allowAdmin, trackController.addTrack);
router.get("/tracks", verifyRole.allowAll, trackController.getTracks);
router.get("/tracks/:track_id", verifyRole.allowAll, trackController.getTrack);
router.put("/tracks/:track_id", verifyRole.allowAdminAndEditor, trackController.updateTrack);
router.delete("/tracks/:track_id", verifyRole.allowAdminAndEditor, trackController.deleteTrack);

router.post("/favorites/add-favorite", verifyRole.allowAll, favoriteController.addFavorite);
router.get("/favorites/:category", verifyRole.allowAll, favoriteController.getFavorites);
router.delete("/favorites/remove-favorite/:favorite_id", verifyRole.allowAdminAndEditor, favoriteController.deleteFavorite);


export default router;