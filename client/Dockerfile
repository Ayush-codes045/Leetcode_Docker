# 1. Base image
FROM node:22-slim

# 2. Working directory
WORKDIR /app

# 3. System dependencies
RUN apt-get update && \
    apt-get install -y python3 gcc g++ openjdk-17-jdk openssl && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# 4. Copy package files
COPY package.json package-lock.json ./

# 5. Install ALL dependencies (including devDependencies)
ENV NODE_ENV=development
RUN npm install --force

# 6. Copy Prisma schema & generate client
COPY prisma ./prisma
#RUN npx prisma generate

# 7. Copy app source
COPY . .

# 8. Build Tailwind CSS first
RUN npm run build:tailwind

# 9. Build Next.js production
RUN npm run build

# 10. Expose port
EXPOSE 3000

# 11. Production server
ENV NODE_ENV=production
CMD ["npm", "run", "start"]
