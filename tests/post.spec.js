const app = require('../app');
const request = require('supertest');
const connectDB = require('../utils/database');
const User = require('../src/models/UserModel');
const Post = require('../src/models/PostModel');
const { default: mongoose } = require('mongoose');
const agent = request.agent(app);

//connecting to the database
connectDB();

//creating a post
const post = {
    title: 'test post',
    body: 'this is a test post',
    description: 'this is a test post',
    tag: 'test',
}

//testing all the post routes
describe('Testing all the post routes', () => {
    let newToken;
    let newPostId;

    beforeAll(async () => {
        await User.deleteMany({});
        await Post.deleteMany({});
    });

    // afterEach(async () => {
    //     await User.deleteMany({});
    //     await Post.deleteMany({});
    // })


    beforeEach(async () => {
        const newUser = {
            first_name: 'John',
            last_name: 'Doe',
            email: 'preciousolanrewaju1998@gmail.com',
            password: '123456'
        }
        const user = await agent.post('/api/v1/users/signup').send(newUser);
        const loggedUser = await agent.post('/api/v1/users/login').send({
            email: 'preciousolanrewaju1998@gmail.com',
            password: '123456'
        });
        newToken = loggedUser.body.token;
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Post.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });



   // testing the create post route
    it('should create a new post', async () => {
        const response = await agent.post('/api/v1/posts/create').set('cookie', `jwt=${newToken}`).send(post);
        newPostId = response.body.post._id;

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('post');
    },10000);

    //testing the get all posts route
    it('should get all posts', async () => {
        const response = await agent
        .get('/api/v1/posts')
        .set('content-type', 'application/json')
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
    }, 10000);

    //testing the get a post route
    it('should get a post', async () => {
        const res = await Post.findById(newPostId);
        const postId = res._id;
        
        const response = await agent
        .get(`/api/v1/posts/${postId}`)
        
        expect(response.status).toBe(200);
        
        expect(response.body.post).toHaveProperty('title');
        expect(response.body.post).toHaveProperty('description');
        expect(response.body.post).toHaveProperty('body');
        expect(response.body.post).toHaveProperty('state');
    }, 10000);

    //testing the update post route
    it('should update a post', async () => {
        const response = await agent.put(`/api/v1/posts/edit/${newPostId}`).set('cookie', `jwt=${newToken}`).send({
            title: 'updated post',
            body: 'this is an updated post',
            description: 'this is an updated post',
            tag: 'updated',

        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('newPost');
    }, 10000);
        
   
    //testing the change state route
    it('should change the state of a post', async () => {
        const route = `/api/v1/posts/state/${newPostId}`;
        const response = await agent.put(route).set('cookie', `jwt=${newToken}`).send({
            state: 'published'
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('post');

    },10000);

     //testing the delete post route
     it('should delete a post', async () => {
        const route = `/api/v1/posts/delete/${newPostId}`;
        const response = await agent.delete(route).set('cookie', `jwt=${newToken}`);
        console.log(response.body)
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
    },10000);
});
