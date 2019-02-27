'use strict'

import User from '../../../src/models/user';

describe('Routes: Users', () => {
    const defaultId = '56cb91bdc3464f14678934ca';
    const defaultCustumer = {
        name: 'Jhon Doe',
        email: 'jhon@mail.com',
        password: '123password',
        role: 'custumer'
    };
    const expectedCustumer = {
        id: defaultId,
        name: 'Jhon Doe',
        email: 'jhon@mail.com',
        role: 'custumer'
    };

    beforeEach(() => {
        const user = new User(defaultCustumer);
        user._id = defaultId;
        return User.deleteOne({})
            .then(() => user.save());
    });

    afterEach(() => User.deleteMany({}));

    describe('GET /users', () => {
        test('should return a list of users', async () => {
            
            const response = await request.get('/api/users');
            expect(response.body[0].email).toBe(expectedCustumer.email);

        });
    });

    describe('GET /users/:id when an id is specified', () => {
        test('should return 200 with one user', async () => {

            const response = await request.get(`/api/users/${defaultId}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expectedCustumer);
        });
    });

    describe('POST /users', () => {
        test('should return a new user with status code 201', async () => {
            await User.deleteMany({});
            const customId = '56cb91bdc3464f14678934ba';
            const newUser = Object.assign({}, { _id: customId }, defaultCustumer);
            const expectedSaveCustumer = Object.assign({}, expectedCustumer, {id: customId});

            const response = await request.post('/api/users').send(newUser);
            expect(response.statusCode).toBe(201);
            expect(response.body).toEqual(expectedSaveCustumer);
        });
    });

    describe('PUT /users/:id', () => {
        test('should update the user and return 200 as status code', async () => {
            const customUser = { name: 'Din Doe'};
            const updatedUser = Object.assign({}, defaultCustumer, customUser);

            const response = await request.put(`/api/users/${defaultId}`).send(updatedUser);
            expect(response.status).toBe(200);
                   
        });
    });

    describe('DELETE /users/:id', () => {
        test('should delete an user and return 200 as status code', async () => {

            const response = await request.delete(`/api/users/${defaultId}`);
            expect(response.status).toBe(200);
                   
        });
    });
})