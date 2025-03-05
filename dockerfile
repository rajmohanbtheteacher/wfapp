# Use Node.js base image
FROM node:16-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Expose port and run the weather forcast app
EXPOSE 3000
CMD ["node", "index.js"]
