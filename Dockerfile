FROM node:20

WORKDIR /usr/app
COPY . .
RUN npm i --quiet
RUN npm run build

#RUN npm install pm2 -g

#CMD ["pm2-runtime", "js/server/prompt_server.js"]
CMD ["npm", "start"]