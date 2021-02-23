FROM node:15.9.0-alpine as build

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY ./frontend/package.json ./
COPY ./frontend/yarn.lock ./
RUN yarn upgrade
RUN yarn 
# COPY ./frontend/src/ ./src/
# COPY ./frontend/public/ ./public/
COPY ./frontend/ ./
RUN yarn build

FROM nginx:1.19.6-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/default.conf
