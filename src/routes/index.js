'use strict';

import express from 'express';
import usersRoute from './users';
import authentificationRoute from './authentification';


const router = express.Router();

router.use('/users', usersRoute);
router.use('/auth',authentificationRoute);


router.get('/', (req, res) => {
    res.status(200).send('Welcome to Capstone API!')
})


export default router;
