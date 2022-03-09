## Run the app
> `docker-compose up --build -d`

## NGINX
App includes an nginx configuration.

This config serves the letters app at the root (\\) level and expects the api to be running on port 5000 and serves it at \\api\\

### At the time of writing, accessing the api directly is much faster via Firefox than it is via Chrome