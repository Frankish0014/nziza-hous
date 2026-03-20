import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { validate } from '../middleware/validationMiddleware.js';
import { loginSchema, registerSchema } from '../validations/authValidation.js';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

export default router;

