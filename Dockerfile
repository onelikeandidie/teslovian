FROM node:10.5.0

# Set the port of the gitlab hook
# ENV PORT=GITLAB_PORT_HERE

# Open the port
# EXPOSE GITLAB_PORT_HERE

# Define the bot token from discord
# ENV BOT_TOKEN=INSERT_TOKEN_HERE

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD . /app

# Install npm packages from package.json
RUN npm install

# Start teslovian
CMD [ "npm", "start" ]