// job.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Adjust the path to your main app file
const Job = require('../models/Job'); // Adjust the path to your Job model
const User = require('../models/User'); // Adjust the path to your User model
const Company = require('../models/Company'); // Adjust the path to your Company model

let token; // Variable to store the authentication token

beforeAll(async () => {
    // Connect to the test database before running tests
    await mongoose.connect(process.env.MONGO_TEST_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    // Create a company and log in to get the token
    const companyData = {
        companyName: 'Test Company',
        email: 'testcompany@example.com',
        password: 'password123',
    };
    
    await request(app).post('/api/auth/company').send(companyData);
    
    const loginData = {
        email: companyData.email,
        password: companyData.password,
    };

    const response = await request(app).post('/api/auth/login').send(loginData);
    token = response.body.token; // Store the token for authenticated requests
});

afterAll(async () => {
    // Close the database connection after tests are finished
    await mongoose.connection.close();
});

describe('Job API', () => {
    beforeEach(async () => {
        // Clean the jobs collection before each test
        await Job.deleteMany({});
    });

    test('Create a job', async () => {
        const jobData = {
            title: 'Software Engineer',
            description: 'Responsible for developing applications.',
            company: 'Test Company',
            location: 'Remote',
            salary: '70000',
            type: 'full-time',
        };

        const response = await request(app)
            .post('/api/jobs')
            .set('Authorization', `Bearer ${token}`)
            .send(jobData);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('job');
        expect(response.body.job.title).toBe(jobData.title);
    });

    test('Get all jobs', async () => {
        // Create a job first
        const jobData = {
            title: 'Software Engineer',
            description: 'Responsible for developing applications.',
            company: 'Test Company',
            location: 'Remote',
            salary: '70000',
            type: 'full-time',
        };

        await request(app)
            .post('/api/jobs')
            .set('Authorization', `Bearer ${token}`)
            .send(jobData);

        const response = await request(app).get('/api/jobs');

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].title).toBe(jobData.title);
    });

    test('Get a job by ID', async () => {
        const jobData = {
            title: 'Software Engineer',
            description: 'Responsible for developing applications.',
            company: 'Test Company',
            location: 'Remote',
            salary: '70000',
            type: 'full-time',
        };

        const jobResponse = await request(app)
            .post('/api/jobs')
            .set('Authorization', `Bearer ${token}`)
            .send(jobData);

        const jobId = jobResponse.body.job._id; // Get the ID of the created job

        const response = await request(app).get(`/api/jobs/${jobId}`);
        expect(response.status).toBe(200);
        expect(response.body.title).toBe(jobData.title);
    });

    test('Update a job', async () => {
        const jobData = {
            title: 'Software Engineer',
            description: 'Responsible for developing applications.',
            company: 'Test Company',
            location: 'Remote',
            salary: '70000',
            type: 'full-time',
        };

        const jobResponse = await request(app)
            .post('/api/jobs')
            .set('Authorization', `Bearer ${token}`)
            .send(jobData);

        const jobId = jobResponse.body.job._id; // Get the ID of the created job

        const updatedJobData = {
            title: 'Senior Software Engineer',
            description: 'Responsible for developing applications and mentoring.',
            company: 'Test Company',
            location: 'Remote',
            salary: '90000',
            type: 'full-time',
        };

        const response = await request(app)
            .put(`/api/jobs/${jobId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedJobData);

        expect(response.status).toBe(200);
        expect(response.body.job.title).toBe(updatedJobData.title);
    });

    test('Delete a job', async () => {
        const jobData = {
            title: 'Software Engineer',
            description: 'Responsible for developing applications.',
            company: 'Test Company',
            location: 'Remote',
            salary: '70000',
            type: 'full-time',
        };

        const jobResponse = await request(app)
            .post('/api/jobs')
            .set('Authorization', `Bearer ${token}`)
            .send(jobData);

        const jobId = jobResponse.body.job._id; // Get the ID of the created job

        const response = await request(app).delete(`/api/jobs/${jobId}`).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.msg).toBe('Job deleted successfully');
    });
});
