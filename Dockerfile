# Build React Frontend
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Set up Node.js Backend
FROM node:20
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
COPY package*.json ./
RUN npm install --production

# Expose port
EXPOSE 3001

# Start server
CMD ["node", "server/index.js"]