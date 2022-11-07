## Blogging Api

# Table OF content

- Description
- Instruction
- Requirement
- Poject tree

# Description

Blogging Api is an open source backend api in which the general idea here is that the api has a general endpoint that shows a list of articles that have been created by different people, and anybody that calls this endpoint, should be able to read a blog created by them or other users

# Instruction

Before you start make sure you have installed:

NodeJS that includes npm

### `Download the project to Your Pc`

having the project in ur local environment

```

git clone <Repository Url>

# or

git pull  <Repository Url>


```

### `Installing npm package`

installing all the requires npm packages

```

npm install

# or

yarn install

```

### `Environment variable`

```

check the sample.env to get the list of the variable in  .env file
requires for this server to run successfully

```

### `Start the Server`

Runninh the server on your local environment

```
npm run start

# or

yarn run start

```

# Base Url
https://mybloggingapi.herokuapp.com/

## Requirements
1. User should be able to register 
2. User should be able to login using JWT
3. Both logged in user and logged in user should be able to view the list of blogs.
4. Both logged in user and logged in user should be able to view each blogs
5. Users should be able to create blogs
6. Users should be able to update and delete blogs
7. Test application


## Models
---

### User
| field  |  data_type | constraints  |
|---|---|---|
|  id |  string |  required |
|  first_name | string  |  required|
|  last_name  |  string |  required  |
|  email     | string  |  required |
|  password |   string |  required  |


### Order
| field  |  data_type | constraints  |
|---|---|---|
|  id |  string |  required |
|  created_at |  date |  required |
|  state | string  |  required, default:draft|
|  tag  |  string |  required  |
|  time_count     | number  |  optional |
| body| string | optional |
|  description | string | required |
|  title | string | required |

## APIs
---

### Signup User

- Route: /api/v1/users/signup
- Method: POST
- Body: 
```
{
  "email": "doe@example.com",
  "password": "Password1",
  "first_name":"jon",
  "last_name":"doe",
}
```

- Responses

Success
```
{
    message: 'Signup successful',
    user: {
        "email": "doe@example.com",
        "password": "Password1",
        "first_name":"jon",
        "last_name":"doe",
    }
}
```
---
### Login User

- Route: /api/v1/users/login
- Method: POST
- Body: 
```
{
  "password": "Password1",
  "email" : "doe@example.com"
}
```

- Responses

Success
```
{
    message: 'Login successful',
    token: 'sjlkafjkldsfjsd'
}
```

---
### logout user

- Route: /api/v1/users/logout
- Method: GET

- Responses

Success
```
{
    message: 'Logout successfully"
}
```


---
### delete Users

- Route: /api/v1/users/delete
- Method: DELETE

- Responses

Success
```
{
    message: 'deleted successfullyy'
}
```

---
### Create blogs

- Route: /api/v1/posts/create
- Method: POST
- Token will be passed as cookies
- Body: 
```
{
    "title": "organic chemistry",
    "description" : "organic chemistry in secondary schools",
    "body" : "anything organic chemistry",
    "tag": "chemistry"
}
```

- Responses

Success
```
{
    "title": "organic chemistry",
    "description" : "organic chemistry in secondary schools",
    "body" : "anything organic chemistry",
    "tag": "chemistry"
}
```
---
### Get a Blog

- Route: /api/v1/posts/:id
- Method: GET

- Responses

Success
```
{
    state: draft,
    total_price: 900,
    created_at: Mon Oct 31 2022 08:35:00 GMT+0100,
     "title": "organic chemistry",
    "description" : "organic chemistry in secondary schools",
    "body" : "anything organic chemistry",
    "tag": "chemistry"
}
```
---

### Get Blogs

- Route: /api/v1/posts
- Method: GET
- Query params: 
    - page (default: 1)
    - per_page (default: 20)
    - time_count
    - reading_time
    - state
    - created_at
- Responses

Success
```
{
    state: draft,
    total_price: 900,
    created_at: Mon Oct 31 2022 08:35:00 GMT+0100,
     "title": "organic chemistry",
    "description" : "organic chemistry in secondary schools",
    "body" : "anything organic chemistry",
    "tag": "chemistry"
}
```
---

---
### Update a blog

- Route: /api/v1/posts/edit/:id
- Method: PUT

- Responses

Success
```
{
    state: draft,
    total_price: 900,
    created_at: Mon Oct 31 2022 08:35:00 GMT+0100,
     "title": "organic chemistry",
    "description" : "organic chemistry in secondary schools",
    "body" : "anything organic chemistry",
    "tag": "updated title"
}
```

### Update the state of a blog

- Route: /api/v1/posts/state/:id
- Method: PUT

- Responses

Success
```
{
    state: published,
    total_price: 900,
    created_at: Mon Oct 31 2022 08:35:00 GMT+0100,
     "title": "organic chemistry",
    "description" : "organic chemistry in secondary schools",
    "body" : "anything organic chemistry",
    "tag": "updated title"
}
```
---
### Delete a blog

- Route: /api/v1/posts/delete/:id
- Method: DELETE

- Responses

Success
```
{
   "message" : "deleted successfully"
}
```

# Project tree

```

├── app.js
├── server.js
├── middlewares
│   ├── auth.js
|   ├── error.js
│   └── wrapAsync.js
├── src
│   ├── controllers
│   |   ├──userController.js
|   |   └── postController.js
│   ├── Models
|   |   ├──UserModel.js
|   |   └── PostModel.js
│   └── routes
|       ├──UserRoutes.js
|       └── postRoutes.js
├── package-lock.json
├── package.json
├── sample.env
├── utils
│   ├── database.js
│   └── errorResponse.js
└── tests
    ├── home.spec.js
    ├── user.spec.js
    └── post.spec.js



```
...

## Contributor
- Abegunde Olanrewaju
