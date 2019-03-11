'use strict';

import express from 'express';
import SkherasController from '../controllers/skheras';
import Skhera from '../models/skhera';
import { authorize } from '../services/authentification/passport';

const router = express.Router();
const skheraController = new SkherasController(Skhera);

router.get('/:id', authorize(),(req, res) => skheraController.getById(req, res));
router.post('/', authorize({roles: ['customer']}),(req, res) => skheraController.create(req, res));
router.delete('/:id', authorize({roles: ['customer']}) ,(req, res) => skheraController.remove(req, res));

export default router;