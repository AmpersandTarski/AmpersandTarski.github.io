FROM node:lts as build

WORKDIR /app

COPY ampersand-docs/package.json ampersand-docs/package-lock.json /app/

RUN npm install

ADD https://github.com/AmpersandTarski/Ampersand/archive/refs/heads/development.zip /tmp/Ampersand.zip
ADD https://github.com/AmpersandTarski/prototype/archive/refs/heads/development.zip /tmp/prototype.zip
ADD https://github.com/AmpersandTarski/TheToolsWeUse/archive/refs/heads/development.zip /tmp/TheToolsWeUse.zip

RUN unzip /tmp/Ampersand.zip 'Ampersand-development/docs/*' -d /tmp/Ampersand/ \
 && unzip /tmp/prototype.zip 'prototype-development/docs/*' -d /tmp/prototype/ \
 && unzip /tmp/TheToolsWeUse.zip 'TheToolsWeUse-development/*' -d /tmp/TheToolsWeUse/

RUN mkdir -p /app/docs \
 && cp -R /tmp/Ampersand/Ampersand-development/docs/ /app/docs/Ampersand \
 && cp -R /tmp/prototype/prototype-development/docs/ /app/docs/Prototype \
 && cp -R /tmp/TheToolsWeUse/TheToolsWeUse-development/ /app/docs/TheToolsWeUse

COPY ampersand-docs/ /app/

RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY ./nginx-conf /etc/nginx/conf.d
