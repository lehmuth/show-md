FROM node:10

# Create application directory
WORKDIR /usr/src/show-md

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 80

CMD [ "node", "show-md.js" ]
