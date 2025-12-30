FROM mcr.microsoft.com/devcontainers/typescript-node:22

ENV PNPM_HOME="/home/node/.pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# This is needed so pnpm-store volume is created with correct permissions
RUN mkdir -p /app/.pnpm-store
RUN chown -R node:node /app/.pnpm-store

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Copy GraphQL schema and codegen config for generation
COPY graphql ./graphql
COPY codegen.ts ./

# Generate GraphQL types (for development)
RUN pnpm run generate

RUN chown -R node:node /home/node/.pnpm
