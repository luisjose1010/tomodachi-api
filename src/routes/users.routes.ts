import express from 'express';
import { getUsers } from "../controllers/users.controller";

const router = express.Router();

router.get('/', getUsers);

export const usersRouter = router;
