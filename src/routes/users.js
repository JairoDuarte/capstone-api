'use strict';

import express from 'express';
import UsersController from '../controllers/users';
import User from '../models/user';
import { authorize } from '../services/authentification/passport';

const router = express.Router();
const usersController = new UsersController(User);


router.get('/', (req, res) => usersController.get(req, res));
router.get('/me', authorize(),(req, res) => usersController.showMe(req, res));
router.get('/status', authorize({roles: ['coursier']}),(req, res) => usersController.updateStatus(req, res));
router.get('/:id', (req, res) => usersController.getById(req, res));
router.post('/', (req, res) => usersController.create(req, res));
router.put('/:id', (req, res) => usersController.update(req, res));
router.delete('/:id', (req, res) => usersController.remove(req, res));

export default router;
