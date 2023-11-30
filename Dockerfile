# syntax=docker/dockerfile:1.0-experimental

# ARGs are used to pass in values at build time.
ARG NODE_VERSION=16
ARG NODE_ENV=production
ARG PORT=3000

# You must create a "server_env" secret pointing at the environment file for
# the following environment variables (or define them in the runtime env):
# - POSTGRES_USER
# - POSTGRES_PASSWORD
# - POSTGRES_SERVER
# - POSTGRES_PORT
# - POSTGRES_DB

# You must create a "postgres_password" secret pointing at a text file containing
# the password for postgres. This must correspond to the POSTGRES_PASSWORD secret.

# Overwrite these with your Auth0 domain and client ID to enable authentication.
ARG REACT_APP_AUTH0_DOMAIN=CHANGE_ME
ARG REACT_APP_AUTH0_CLIENT_ID=CHANGE_ME

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
FROM deps as build_app
ARG NODE_ENV
ARG REACT_APP_AUTH0_DOMAIN
ARG REACT_APP_AUTH0_CLIENT_ID

# Copy package.json so that package manager commands can be used.
COPY package.json .

# Copy necessary source files into the image.
COPY src ./src
COPY public ./public
COPY tsconfig.json .

# Use the production environment variables for the build
ENV REACT_APP_AUTH0_DOMAIN=${REACT_APP_AUTH0_DOMAIN}
ENV REACT_APP_AUTH0_CLIENT_ID=${REACT_APP_AUTH0_CLIENT_ID}

# Run the build script.
RUN npm run build-app

# Remove tmp .env file
RUN rm -f .env

################################################################################
# Create a stage for building the server.
FROM deps as build_server
ARG NODE_ENV

# Copy package.json so that package manager commands can be used.
COPY package.json .

# Copy necessary source files into the image.
COPY src/interfaces.tsx ./src/interfaces.tsx
COPY server_src/ ./server_src/
COPY server.ts .

# Run the build script.
RUN npm run build-server

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base as final
ARG PORT
ARG NODE_ENV

# Get runtime server env if given at build
RUN --mount=type=secret,id=server_env \
    if [[ -f "/run/secrets/server_env" ]; then \
        cp /run/secrets/server_env .env; \
    fi

# Run the application as a non-root user.
USER node

# Copy package.json so that package manager commands can be used.
COPY package.json .

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build_app /usr/src/app/build ./build
COPY --from=build_server /usr/src/app/server_src ./server_src
COPY --from=build_server /usr/src/app/server.js ./server.js
COPY dev-entrypoint.sh ./dev-entrypoint.sh

# Expose the port that the application listens on.
EXPOSE ${PORT}

# Set runtime environment variables
ENV PORT ${PORT}
ENV NODE_ENV ${NODE_ENV}

# Run the application.
CMD npm start
