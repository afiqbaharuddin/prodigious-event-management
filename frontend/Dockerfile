# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy only package.json and lock file first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose React dev server port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]