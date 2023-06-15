# Chat backend

Backend chat application using websockets

###### Frontend [https://github.com/kubahrom/chat_frontend](https://github.com/kubahrom/chat_frontend)

## Stack

Node, Express, Prisma, PostgreSQL, Typescript

## Setup

First, you will have to run PostgreSQL db, either by runing locally or using docker-compose file.

Then you will need to setup the .env file. Copy the .env.example file and fill the missing variables.

```
PORT= port on which the app will be listening

FE_URL= url where frontend application is running to enable cors

DATABASE_USER= database user name
DATABASE_PASSWORD= database user password
DATABASE_NAME= database name
DATABASE_SERVER= database server (when using docker-compose use localhost:5423)
DATABASE_URL= if you are using postgreSQL you leave as it is to create connection URL

TOKEN_SECRET= secret that is used to sign JWT token
```

If you are using different DB than postgreSQL you will have to update **/prisma/schema.prisma** file, where you need to change datasource db provider to your database and make sure whole schema is still valid for the new provided DB.

To initially populate DB with tables run command bellow:

```BASH
npx prisma db push
```

To start up the project run

```BASH
npm install
```

to install all project dependencies and

```BASH
npm run dev
```

to run local server

## REST API Endpoints structure

All endpoints have to start with **/api/** like _localhost:3000/api/auth/register_

### Auth

```
POST    /auth/register   create and login new user
POST    /auth/login      login user
POST    /auth/logout     logout currently logged user
GET     /auth/me         get data about currently logged user
```

### Chatrooms

```
GET     /chatrooms/             get all chatrooms which logged user is created or is included
GET     /chatrooms/:id          get chatroom base on id
POST    /chatrooms/             create new chatroom
DELETE  /chatrooms/:id          delete chatroom base on id as an chatroom author
PUT     /chatrooms/:id          update chatroom base on id as an chatroom author
POST    /chatrooms/leave/:id    leave chatroom base on id as an chatroom participant
```

### Messages

```
GET     /messages/      get messages base on chatroom id
POST    /messages/      create new message
```

### Users

```
GET     /users/     get all registered users
```

## WebSocket API

For connection to websocket you have to be authenticated and provide chatroom id.

```
ws://{THIS_APP_RUNNING_URL}/?id={CHATROOM_ID}
```
