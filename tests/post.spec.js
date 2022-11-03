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


    beforeAll(async () => {
        await User.deleteMany({});
        await Post.deleteMany({});
    });

    afterEach(async () => {
        await User.deleteMany({});
        await Post.deleteMany({});
    })

    afterAll(async () => {
        await User.deleteMany({});
        await Post.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

   // testing the create post route
    it('should create a new post', async () => {
        const user = new User({
            first_name: 'John',
            last_name: 'Doe',
            email: 'johndoe@gmail.com',
            password: '123456'
        });
        await user.save();
        const res = await agent.post('/api/v1/users/login').send({
            email: 'johndoe@gmail.com',
            password: '123456'
        });
        const token = res.body.token;
        const response = await agent.post('/api/v1/posts/create').set('cookie', `jwt=${token}`).send(post);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('post');
    });

    //testing the get all posts route
    it('should get all posts', async () => {
        await Post.create({
            title: 'test post',
            body: 'this is a test post',
            description: 'this is a test post',
            tag: 'test',
        });
        const response = await agent
        .get('/api/v1/posts')
        .set('content-type', 'application/json')
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
    });

    //testing the get a post route
    it('should get a post', async () => {
        await Post.create({
            title: 'test post2',
            body: 'this is a test post2',
            description: 'this is a test post2',
            tag: 'test',
        });
        const res = await Post.find({ title: 'test post2' });
        const postId = res[0]._id;
        
        const response = await agent
        .get(`/api/v1/posts/${postId}`)
        
        expect(response.status).toBe(200);
        
        expect(response.body.post).toHaveProperty('title');
        expect(response.body.post).toHaveProperty('description');
        expect(response.body.post).toHaveProperty('body');
        expect(response.body.post).toHaveProperty('tag');
        expect(response.body.post).toHaveProperty('state');
    });

    //testing the update post route
    it('should update a post', async () => {
        const user = new User({
            first_name: 'John',
            last_name: 'Doe',
            email: 'johndoe@gmail.com',
            password: '123456'
        });
        await user.save();
        const res = await agent.post('/api/v1/users/login').send({
            email: 'johndoe@gmail.com',
            password: '123456'
        });
        const token = res.body.token;
        console.log(token);
        const newPost = await Post.create(post);
        console.log(newPost);
        const route = `/api/v1/posts/edit/${newPost._id.toString()}`;
        console.log(route);
        const response = await agent.put(route).set('cookie', `jwt=${token}`).send({
            title: 'updated post',
            body: 'this is an updated post',
            description: 'this is an updated post',
            tag: 'updated',

        });
        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('newPost');
    });
        
    //testing the delete post route
    it('should delete a post', async () => {
        const user = new User({
            first_name: 'John',
            last_name: 'Doe',
            email: 'johndoe@gmail.com',
            password: '123456'
        });
        await user.save();
        const res = await agent.post('/api/v1/users/login').send({
            email: 'johndoe@mail.com',
            password: '123456'
        });
        const token = res.body.token;
        const newPost = await Post.create(post);
        const id = newPost._id.toString();
        console.log(id);
        const route = `/api/v1/posts/delete/${id}`;
        const response = await agent.delete(route).set('cookie', `jwt=${token}`);
        console.log(response.body)
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
    });

    //testing the change state route
    it('should change the state of a post', async () => {
        const user = new User({
            first_name: 'John',
            last_name: 'Doe',
            email: 'johndoe@gmail.com',
            password: '123456'
        });
        await user.save();
        const res = await agent.post('/api/v1/users/login').send({
            email: 'johndoe@gmail.com',
            password: '123456'
        });
        const token = res.body.token;
        const newPost = await Post.create(post);
        const id = newPost._id
        console.log(JSON.stringify(id));
        const route = `/api/v1/posts/state/${id}`;
        const response = await agent.put(route).set('cookie', `jwt=${token}`).send({
            state: 'published'
        });
        console.log(response.body)
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('post');

    });

});
