# React Notes

This is a simple note-taking app that is planned to allow each logged-in user to have a \*tree\* of notes of \*many possible formats\*, all editable from within this single-page-application. It is also the project by which I am familiarizing myself with React, Emotion.js, Jest, Typescript, Auth0, and the like. This project was initially bootstrapped using the React bootstrapper with the Typescript template. Starred \*items\* are not yet implemented.

## Environment Variables

### Buildtime
 - **REACT_APP_AUTH0_DOMAIN** = the Domain for the Auth0 application
 - **REACT_APP_AUTH0_CLIENT_ID** = the Client ID for the Auth0 application

### Runtime
 - **PORT** = the port on which express should serve the compiled, static React app
 - **DATABASE_URL** = connection string for PostgreSQL database
   - This and other PSQL secrets can also be provided in a secret environment file
     at buildtime if you want your credentials bundled into the image.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode, unless you have NODE_ENV=production in your env.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!


## Build Instructions

1. Fill in secret files for docker compose, or set environment vars for POSTGRES_PASSWORD, etc, at server runtime:
    1. ./secrets/postgres_password

2. Build w/ docker:
    - With secrets:
        `DOCKER_BUILDKIT=1 docker build . -t react-notes-server source=./secrets/postgres_password --secret id=server_env,source=./secrets/server.env`
    - With args:
        `DOCKER_BUILDKIT=1 docker build . -t react-notes --build-arg REACT_APP_AUTH0_DOMAIN="<AUTH0_DOMAIN>" --build-arg REACT_APP_AUTH0_CLIENT_ID="<AUTH0_CLIENT_ID>"

3. Or use compose:
    a. `docker compose build --build-arg REACT_APP_AUTH0_DOMAIN="<AUTH0_DOMAIN>" --build-arg REACT_APP_AUTH0_CLIENT_ID="<AUTH0_CLIENT_ID>"`
    b. `docker compose up`