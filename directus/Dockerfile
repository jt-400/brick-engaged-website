# Deploy Directus admin CMS for Brick Engaged
# Connects to the existing Supabase Postgres database
# https://directus.io

from: node:20-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json ./
RUN npm install directus@latest

COPY . .

EXPOSE 8055

CMD ["npx", "directus", "start"]
