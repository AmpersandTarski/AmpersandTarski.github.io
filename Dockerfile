FROM node:lts as build

WORKDIR /app

COPY ampersand-docs/package.json ampersand-docs/package-lock.json /app/

RUN npm install

ADD https://github.com/AmpersandTarski/Ampersand/archive/refs/heads/development.zip /tmp/Ampersand.zip
ADD https://github.com/AmpersandTarski/prototype/archive/refs/heads/main.zip /tmp/prototype.zip
ADD https://github.com/AmpersandTarski/TheToolsWeUse/archive/refs/heads/development.zip /tmp/TheToolsWeUse.zip

RUN mkdir -p /app/docs

# For local testing, this is the place to locally edit this dockerfile. 
# 1) Comment out the specific RUN statement(s) for the repo you want to test your local changes:
RUN unzip /tmp/Ampersand.zip 'Ampersand-development/docs/*' -d /tmp/Ampersand/ \
    && cp -R /tmp/Ampersand/Ampersand-development/docs/ /app/docs/Ampersand
RUN unzip /tmp/prototype.zip 'prototype-main/docs/*' -d /tmp/prototype/ \
    && cp -R /tmp/prototype/prototype-main/docs/ /app/docs/Prototype
RUN unzip /tmp/TheToolsWeUse.zip 'TheToolsWeUse-development/*' -d /tmp/TheToolsWeUse/ \
    && cp -R /tmp/TheToolsWeUse/TheToolsWeUse-development/ /app/docs/TheToolsWeUse

# 2) Make sure you copy the entire docs directory of the specific repo to the /tmp folder here.
#    you should do that before you give the instruction `docker compose up -d --build`, in your terminal.

# The following lines will copy that stuff to the place it is required:
# 3) uncomment the required COPY statement(s) below:
# COPY ./tmp/Ampersand/ /app/docs/Ampersand
# COPY ./tmp/prototype/ /app/docs/Prototype
# COPY ./tmp/TheToolsWeUse/ /app/docs/TheToolsWeUse

# Leave the statements below just as is, and you should be fine.
COPY ampersand-docs/ /app/

RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY ./nginx-conf /etc/nginx/conf.d
