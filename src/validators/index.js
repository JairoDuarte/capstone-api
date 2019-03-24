import { middleware as body } from 'bodymen';
import { STATUS_ACTIF, STATUS_INACTIF } from '../models/user';

export  const updateValidator = () => body(
    { email: {type: String, match: /^\S+@\S+\.\S+$/, required: true},
    fullname: {type: String, required: true},
    image: {type: String, required: true}, 
    phone: {type: String, required: true}})

export const statusValidator = () => body({ 
    status: {type: String, enum: [STATUS_ACTIF, STATUS_INACTIF], required: true}})
