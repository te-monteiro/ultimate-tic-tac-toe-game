# Dockerfile
# docker build -t your-image-name .
# docker run -p 3000:3000 your-image-name


FROM node:14

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . /app

EXPOSE 3000

CMD ["node", "server.js"]
