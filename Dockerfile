FROM node:14

WORKDIR /usr/src/app

ENV PORT 80
ENV HOST 0.0.0.0

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 80
CMD ["node", "index.js"]