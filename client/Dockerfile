FROM node:22-slim

WORKDIR /app


RUN apt-get update -y && apt-get install -y openssl

COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN  npm install -f

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev:docker"]