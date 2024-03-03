# easy-volunteer

## Description

This repository is split to two sub directories.

* Backend - The backend folder consists of a [NestJS](https://nestjs.com/) application which is a NodeJS framework used for building backend services.

* Frontend - The frontend folder consits of a [VueJS](https://vuejs.org/) application which is a frontend framework used for building a frontend single page application 


## How to start?


### Dependencies
In order to start the application, please first install the following dependencies:

* [Docker](https://docs.docker.com/engine/install/) used to get a mysql service up and running easily
* [Docker-compose](https://docs.docker.com/compose/install/) used to control docker easily
* [NodeJS](https://nodejs.org/en) used to setup the Frontend and Backend.

## Starting it up

Please run the following commands each in seperate terminal.
---
To setup the mysql server run in a 
```bash
docker-compose up -d
```
---
To start the backend, please run:
```bash
cd ./backend
npm install
npm run migrate:init_migrate 
npm run start:dev
```

This will install the npm modules, run the initial migration to populate with data, and start running the server.

---

To start the frontend, please run and open the link which the terminal wrote that the service is running on.
```bash
cd ./frontend
npm install
npm run dev
```

---

After all three steps have succeeded, you can go ahead and use the link you opened in the frontend to register, login, and start using the application.