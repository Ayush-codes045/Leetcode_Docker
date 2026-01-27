# -----------------------------
# 1. Base image
# -----------------------------
FROM node:22-slim

# -----------------------------
# 2. Set working directory
# -----------------------------
WORKDIR /app

# -----------------------------
# 3. Install system dependencies
# -----------------------------
RUN apt-get update && \
    apt-get install -y python3 gcc g++ openjdk-17-jdk openssl && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# -----------------------------
# 4. Copy package files & install dependencies
# -----------------------------
COPY package.json package-lock.json ./
RUN npm install --force

# -----------------------------
# 5. Copy Prisma schema & generate client
# -----------------------------
COPY prisma ./prisma
RUN npx prisma generate

# -----------------------------
# 6. Copy the rest of the app
# -----------------------------
COPY . .

# # -----------------------------
# # 7. Build frontend & Tailwind CSS
# # -----------------------------
# RUN npm run build
# -----------------------------
# 8. Expose port
# -----------------------------
EXPOSE 3000

# -----------------------------
# 9. Start server with optional migrations
# -----------------------------
# If you want to apply Prisma migrations automatically on start, use the commented CMD
# CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]

# For standard production without auto-migrations:
CMD ["npm", "run", "start"]
