'use strict';

import express from 'express';
import usersRoute from './users';
import authentificationRoute from './authentification';
import SkheraRoute from './skheras';

const router = express.Router();

router.use('/users', usersRoute);
router.use('/auth',authentificationRoute);
router.use('/skhera', SkheraRoute);


export default router;
