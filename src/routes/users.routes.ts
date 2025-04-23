import express from 'express';
import { getUser, getUsers } from "../controllers/users.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

router.get('/', authenticate({ permission: 'admin' }), getUsers);
router.get('/:id', authenticate({ permission: 'admin', allowOwner: true  }), getUser);

export const usersRouter = router;
