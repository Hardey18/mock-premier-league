# Use the official Node.js image
FROM node:22

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./
COPY bin ./

# Install dependencies
RUN npm install

# Install TypeScript globally
RUN npm install -g typescript ts-node

# Copy the rest of your application code
COPY . .

# Compile TypeScript code
RUN tsc

# Expose the port your app runs on
EXPOSE 4000

# Command to run your app
CMD ["node", "./bin/www"]
