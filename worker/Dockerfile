# Start from a Node.js base image
FROM node:20-slim

WORKDIR /app

# Install Python and GCC
RUN apt-get update && apt-get install -y python3 gcc g++

COPY package*.json ./

RUN npm install typescript -g

COPY . .

RUN npm install -f


EXPOSE 8080
RUN npm run build
CMD ["npm", "run", "start"]
