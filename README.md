# React Notes

This is a simple note-taking app that is planned to allow each logged-in user to have a tree of notes of many possible formats, all editable from within this single-page-application. It is also the project by which I am familiarizing myself with React, Emotion.js, Jest, Typescript, Auth0, and the like. This project was initially bootstrapped using the React bootstrapper with the Typescript template. 

## Environment Variables
 - **REACT_APP_AUTH0_DOMAIN** = the Domain for the Auth0 application
 - **REACT_APP_AUTH0_CLIENT_ID** = the Client ID for the Auth0 application
 - **PORT** = the port on which express should serve the compiled, static React app
 - **DATABASE_URL_DEV** = for development, used in place of DATABASE_URL (that is set by Heroku or manually for pointing to the PostgreSQL database in production)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
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