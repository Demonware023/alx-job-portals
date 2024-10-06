// auth.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Adjust the path to your main app file
const User = require('../models/User'); // Adjust the path to your User model
const Company = require('../models/Company'); // Adjust the path to your Company model

beforeAll(async () => {
    // Connect to the test database before running tests
    await mongoose.connect(process.env.MONGO_TEST_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    // Close the database connection after tests are finished
    await mongoose.connection.close();
});

describe('Authentication API', () => {
    beforeEach(async () => {
        // Clean the database before each test
        await User.deleteMany({});
        await Company.deleteMany({});
    });

    test('User registration', async () => {
        const userData = {
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
        };

        const response = await request(app).post('/api/auth/register').send(userData);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('token');
    });

    test('Company registration', async () => {
        const companyData = {
            companyName: 'Test Company',
            email: 'testcompany@example.com',
            password: 'password123',
        };

        const response = await request(app).post('/api/auth/company').send(companyData);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('token');
    });

    test('User login', async () => {
        // First, register the user
        const userData = {
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
        };

        await request(app).post('/api/auth/register').send(userData);

        // Now, login the user
        const loginData = {
            email: 'testuser@example.com',
            password: 'password123',
        };

        const response = await request(app).post('/api/auth/login').send(loginData);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    test('User login with invalid credentials', async () => {
        const loginData = {
            email: 'nonexistent@example.com',
            password: 'wrongpassword',
        };

        const response = await request(app).post('/api/auth/login').send(loginData);
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('Invalid credentials');
    });

    test('Password hashing on registration', async () => {
        const userData = {
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
        };

        const response = await request(app).post('/api/auth/register').send(userData);
        const user = await User.findOne({ email: userData.email });

        expect(user).toBeTruthy();
        expect(user.password).not.toBe(userData.password); // Check that the password is hashed
    });
});
