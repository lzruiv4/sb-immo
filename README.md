# sb-immo

<p align="center">
  <a ><img src="sb-immo-frontend/public/logo.png" width="200" alt="sb logo" /></a>
</p>

### Setup

The backend is based on PostgreSQL with NestJS. Please set up the database first, preferably using Docker.

😉 You can quickly deploy and start the project using the code below, please make sure you have Docker.

```bash
docker run -d \
--name dev-postgres-immo \
-e POSTGRES_USER=sa \
-e POSTGRES_PASSWORD=123 \
-e POSTGRES_DB=sb-immo \
-p 3031:5432 \
postgres:latest
```

# sb-immo-frontend

To start the backend, run:

```bash
cd sb-immo-backend && npm run start:dev
```

To start the frontend UI, please open new terminal under root and run:

```bash
cd sb-immo-frontend && ng serve
```

### UI

##### Relevant contacts

<img src="markdown-image/relevant-contacts.png" width="100%" height="auto"/>

##### Property

<img src="markdown-image/property.png" width="100%" height="auto"/>

##### Property record

<img src="markdown-image/property-record.png" width="100%" height="auto"/>

##### Create property record

<img src="markdown-image/create-property-record.png" width="100%" height="auto"/>

# sb-immo-backend with NestJs

##### Swagger API

👉👉 [OPEN SWAGGER API](http://localhost:3000/api)

<img src="markdown-image/api-1.png" width="100%" height="auto"/>

<img src="markdown-image/api-2.png" width="100%" height="auto"/>
