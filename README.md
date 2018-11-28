## Setup Instructions

* Create a postgresql instance on [elephant sql](elephantsql.com)

* Rename env-sample to .env and replace DATABASE_URL to your database url from elephant sql

```example of database url:

url:postgres://username:password@tantor.db.elephantsql.com:5432/username 

postgres://tiosohs:9PUMsM-Co1N_JRBKKFKNCDJwWHetgl@tantor.db.elephantsql.com:5432/tiosohs

```
Install dependencies:

```sh
$ npm install
```

Startup the Server:

```sh
$ npm start
```

Run Migrations:

```sh
$ npm run migrate
```

## RESTful URLs

| Method | Endpoint | Description
| --- | --- | -- |
| GET | /api/v1/posts | List all posts |
| GET | /api/v1/posts/:id | Query one post |
| POST | /api/v1/posts | Create a new post |
| PUT | /api/v1/posts/:id | Update a post |
| GET | /api/v1/user | View user information |
| POST | /api/v1/users/register | Register a new user |
| POST | /api/v1/users/login | Login a user |
| GET | /api/v1/users/:id/posts | Query user's posts |
