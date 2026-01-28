FROM node:22-slim

WORKDIR /app

RUN apt-get update && apt-get install -y python3 gcc g++ openjdk-17-jdk
RUN apt-get update -y && apt-get install -y openssl

COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN  npm install -f

# Generate Prisma Client with correct binary targets for Linux container
RUN npx prisma generate

COPY . .
#new
# Build the Next.js app
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev:docker"]
