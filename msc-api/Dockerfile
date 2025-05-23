FROM node:24
RUN mkdir /app
WORKDIR /app
RUN npm install -g gulp
COPY dist .
ENTRYPOINT ["node", "src"]
