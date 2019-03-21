'use strict';

import express from 'express';
import { middleware as body } from 'bodymen'
import {getById, getByUser, getEstimatedPrice, create, remove} from '../controllers/skheras';
import { authorize } from '../services/authentification/passport';
import { CUSTOMER_ROLE} from '../models/user';
import { schema } from '../models/skhera';        

const  {description, deliver, to, from, price, schedule, items, priceitems} = schema.tree;

const router = express.Router();

router.get('/', authorize({roles: [CUSTOMER_ROLE]}), (req, res) => getByUser(req, res));
router.get('/:id', authorize(),(req, res) => getById(req, res));
router.post('/', body({description, deliver, to, from, priceitems, price, schedule, items}), authorize({roles: [CUSTOMER_ROLE]}),(req, res) => create(req, res));
router.delete('/:id', authorize({roles: [CUSTOMER_ROLE]}) ,(req, res) => remove(req, res));
router.post('/price', body({
    deliver: {
      type: String,
      required: true,
      trim: true,
      minlength: 3
    },
    distance: {
        type: String,
        required: true,
    },
    to: {
        type: Number,
        required: true
    }}), authorize({roles: [CUSTOMER_ROLE]}),(req, res) => getEstimatedPrice(req, res));


export default router;