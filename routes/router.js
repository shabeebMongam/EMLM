import express from 'express';
import authController from '../controllers/auth.controller.js';
import userController from '../controllers/user.controller.js';
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.post("/users/add-user", userController.addUser);
router.get("/users", userController.getUsers);
router.delete("/users/:id", userController.deleteUser);
router.put("/users/update-password", userController.editUserPassword);



export default router;