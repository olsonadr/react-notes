# syntax=docker/dockerfile:1.0-experimental

# ARGs are used to pass in values at build time.
ARG NODE_VERSION=16
ARG NODE_ENV=production
ARG PORT=3000

# You must create a "server_env" secret pointing at the environment file for
# the following environment variables:
# - POSTGRES_USER
# - POSTGRES_PASSWORD
# - POSTGRES_SERVER
# - POSTGRES_PORT
# - POSTGRES_DB
# - DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@${POSTGRES_SERVER}:${POSTGRES_PORT}/${POSTGRES_DB}

# You must create a "postgres_password" secret pointing at a text file containing
# the password for postgres. This must correspond to the POSTGRES_PASSWORD secret.

# the following environment variables needed during the react app build:
# You must create a "react_app_env" secret pointing at the environment file for
# the following environment variables needed during the react app build:
# - REACT_APP_AUTH0_DOMAIN
# - REACT_APP_AUTH0_CLIENT_ID

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app


################################################################################
# Create a stage for installing production dependecies.
FROM base as deps
ARG NODE_ENV

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage bind mounts to package.json and package-lock.json to avoid having to copy them
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

################################################################################
# Create a stage for building the application.
FROM deps as build
ARG NODE_ENV

# # Download additional development dependencies before building, as some projects require
# # "devDependencies" to be installed to build. If you don't need this, remove this step.
# RUN --mount=type=bind,source=package.json,target=package.json \
#     --mount=type=bind,source=package-lock.json,target=package-lock.json \
#     --mount=type=cache,target=/root/.npm \
#     npm ci

# Copy the rest of the source files into the image.
COPY . .

# Get secret environment variables from docker secrets for build
RUN --mount=type=secret,id=react_app_env cp /run/secrets/react_app_env .env

# Run the build script.
RUN npm run build

# Remove tmp .env file
RUN rm .env

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base as final
ARG PORT
ARG NODE_ENV

# Get runtime env
RUN --mount=type=secret,id=server_env cp /run/secrets/server_env .env
RUN chown -R node:node .env

# Run the application as a non-root user.
USER node

# Copy package.json so that package manager commands can be used.
COPY package.json .

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/build ./build
COPY --from=build /usr/src/app/server_src ./server_src
COPY --from=build /usr/src/app/server.js ./server.js
# COPY --from=build /usr/src/app/public ./public

# Expose the port that the application listens on.
EXPOSE ${PORT}

# Set runtime environment variables
ENV PORT ${PORT}
ENV NODE_ENV ${NODE_ENV}

# Run the application.
CMD npm start
