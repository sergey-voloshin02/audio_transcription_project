FROM node:14
WORKDIR /usr/src
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
