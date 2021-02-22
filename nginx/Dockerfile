FROM node:15.9.0-alpine as build

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY ./frontend/package.json ./
# COPY ./frontend/package-lock.json ./
RUN npm install
COPY ./frontend/src/ ./src/
COPY ./frontend/public/ ./public/
RUN npm run build


FROM nginx:1.19.6-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/default.conf
