import { Router } from "express";
import { isAdmin, isAuthenticated } from "./middlewares/auth.js";
import { register, login, verifyEmail } from "./controllers/authControllers.js";
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} from "./controllers/userControllers.js";
import { getPrivateHello } from "./controllers/privateController.js";
import { notFoundMiddleware } from "./middlewares/notFoundMiddleware.js";
import controllerWrapper from "./middlewares/controllerWrapper.js";
import { getProfile, updateProfile } from "./controllers/profileControllers.js";
import { authLimiter } from "./middlewares/rateLimiter.js";

export const router = Router();

// Routes d'authentification
router.post("/auth/register", authLimiter, controllerWrapper(register));
router.post("/auth/login", authLimiter, controllerWrapper(login));
router.get(
  "/auth/verify-email/:token",
  authLimiter,
  controllerWrapper(verifyEmail)
);

// Routes utilisateurs (protégées)
router.get(
  "/users",
  isAuthenticated,
  isAdmin,
  authLimiter,
  controllerWrapper(getAllUsers)
);
router.get(
  "/users/:id",
  isAuthenticated,
  isAdmin,
  authLimiter,
  controllerWrapper(getUser)
);
router.patch(
  "/users/:id",
  isAuthenticated,
  isAdmin,
  authLimiter,
  controllerWrapper(updateUser)
);
router.delete(
  "/users/:id",
  isAuthenticated,
  isAdmin,
  authLimiter,
  controllerWrapper(deleteUser)
);

// Routes de profil utilisateurs standard (protégées)
router.get(
  "/profile",
  isAuthenticated,
  authLimiter,
  controllerWrapper(getProfile)
);
router.patch(
  "/profile",
  isAuthenticated,
  authLimiter,
  controllerWrapper(updateProfile)
);

// Route privée
router.get(
  "/private",
  isAuthenticated,
  authLimiter,
  controllerWrapper(getPrivateHello)
);

// Middleware 404 - routes nons trouvées
router.use(notFoundMiddleware);
