// user.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Adjust the path to your main app file
const User = require('../models/User'); // Adjust the path to your User model

let token; // Variable to store the authentication token

beforeAll(async () => {
    // Connect to the test database before running tests
    await mongoose.connect(process.env.MONGO_TEST_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    // Create a user and log in to get the token
    const userData = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
    };

    await request(app).post('/api/auth/register').send(userData);
    
    const loginData = {
        email: userData.email,
        password: userData.password,
    };

    const response = await request(app).post('/api/auth/login').send(loginData);
    token = response.body.token; // Store the token for authenticated requests
});

afterAll(async () => {
    // Close the database connection after tests are finished
    await mongoose.connection.close();
});

describe('User API', () => {
    beforeEach(async () => {
        // Clean the users collection before each test
        await User.deleteMany({});
    });

    test('Register a user', async () => {
        const userData = {
            username: 'newuser',
            email: 'newuser@example.com',
            password: 'password123',
        };

        const response = await request(app).post('/api/auth/register').send(userData);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.email).toBe(userData.email);
    });

    test('Login a user', async () => {
        const userData = {
            username: 'loginuser',
            email: 'loginuser@example.com',
            password: 'password123',
        };

        await request(app).post('/api/auth/register').send(userData); // Register the user first

        const loginData = {
            email: userData.email,
            password: userData.password,
        };

        const response = await request(app).post('/api/auth/login').send(loginData);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    test('Get user profile', async () => {
        const userData = {
            username: 'profileuser',
            email: 'profileuser@example.com',
            password: 'password123',
        };

        await request(app).post('/api/auth/register').send(userData); // Register the user first

        const loginData = {
            email: userData.email,
            password: userData.password,
        };

        const loginResponse = await request(app).post('/api/auth/login').send(loginData);
        const userToken = loginResponse.body.token;

        const response = await request(app)
            .get('/api/users/me')
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.email).toBe(userData.email);
    });

    test('Update user profile', async () => {
        const userData = {
            username: 'updateuser',
            email: 'updateuser@example.com',
            password: 'password123',
        };

        await request(app).post('/api/auth/register').send(userData); // Register the user first

        const loginData = {
            email: userData.email,
            password: userData.password,
        };

        const loginResponse = await request(app).post('/api/auth/login').send(loginData);
        const userToken = loginResponse.body.token;

        const updatedUserData = {
            username: 'updateduser',
            email: 'updateduser@example.com',
        };

        const response = await request(app)
            .put('/api/users/me')
            .set('Authorization', `Bearer ${userToken}`)
            .send(updatedUserData);

        expect(response.status).toBe(200);
        expect(response.body.username).toBe(updatedUserData.username);
        expect(response.body.email).toBe(updatedUserData.email);
    });

    test('Delete user account', async () => {
        const userData = {
            username: 'deleteuser',
            email: 'deleteuser@example.com',
            password: 'password123',
        };

        await request(app).post('/api/auth/register').send(userData); // Register the user first

        const loginData = {
            email: userData.email,
            password: userData.password,
        };

        const loginResponse = await request(app).post('/api/auth/login').send(loginData);
        const userToken = loginResponse.body.token;

        const response = await request(app)
            .delete('/api/users/me')
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.msg).toBe('User deleted successfully');
    });
});
