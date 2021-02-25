FROM node:lts-alpine3.10

ENV CI=true

WORKDIR /app

COPY package.json .
RUN npm install --only=prod
COPY . .

CMD ["npm","start"]