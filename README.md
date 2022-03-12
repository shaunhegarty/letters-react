## Run the app
> `docker-compose up --build -d`

## NGINX
App includes an nginx configuration.

This config serves the letters app at the root (\\) level and expects the api to be running on port 5000 and serves it at \\api\\

### At the time of writing, accessing the api directly is much faster via Firefox than it is via Chrome

# Dev Configuration
Launch dev container in vs code and then run 
> `yarn install`

> `yarn start`

### WSL Dev Container Notes
While inside the container, to commit to github (via ssh) you need to have your ssh keys accessible from inside the dev container. 

VS Code docs say it will forward your ssh-agent to the container, but what's not clear here is that they mean your WINDOWS ssh-agent, not the one running inside your WSL box. 

I tried the linux + WSL part of [these instructions on sharing Git +SSH credentials with your container](https://code.visualstudio.com/docs/remote/containers#_sharing-git-credentials-with-your-container)
to no avail. 

Nothing worked until following the windows instructions, so it's unclear if the linux+WSL steps were necessary.

* [More detailed instructions on re-enabling the ssh agent](https://github.com/microsoft/vscode-remote-release/issues/3597#issuecomment-684942821)
