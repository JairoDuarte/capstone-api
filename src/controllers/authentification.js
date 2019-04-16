'use strict'

import sign from '../services/authentification/jwt';
import User from '../models/user';
import {notFound, success} from '../services/response';

const login = async ({ user, body }, response) => {
    try {
        user.role = body.role;
        user = await User.createFromService(user);
        notFound(response, user);
        const token = await sign({id: user.id, email: user.email});
        success(response, {user: user.view(user.role), token: token});

    } catch (error) {
        return response.status(400).send(error.message);
    }
}
export default login;