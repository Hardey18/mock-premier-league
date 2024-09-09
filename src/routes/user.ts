import { Router } from 'express';

import { auth } from '../middleware/authMiddleware';
import { createUser, getUserProfile, loginUser } from '../controllers/user';

const router = Router();

/* GET user routes. */
router.route('/profile').get(auth, getUserProfile)

/* POST user routes. */
router.post('/', createUser);
router.post('/login', loginUser);

export default router;
