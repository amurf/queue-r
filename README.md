# Queue-R

## How to run

`docker-compose up`

## Basics

The app is accessed via a traefik proxy which forwards to the right service.

- http://localhost:8885 to start adding jobs
- http://localhost:8885/manage for the management UI
- http://localhost:8885/submit for job submit api
- http://localhost:8885/update for job update api
