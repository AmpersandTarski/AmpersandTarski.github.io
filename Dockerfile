FROM node:lts as build

WORKDIR /app

COPY ampersand-docs/package.json ampersand-docs/package-lock.json /app/

RUN npm install
RUN npx update-browserslist-db@latest

ADD https://github.com/AmpersandTarski/ampersand/archive/refs/heads/documentation.zip /tmp/Ampersand.zip
ADD https://github.com/AmpersandTarski/prototype/archive/refs/heads/documentation.zip /tmp/prototype.zip
ADD https://github.com/AmpersandTarski/TheToolsWeUse/archive/refs/heads/development.zip /tmp/TheToolsWeUse.zip
ADD https://github.com/AmpersandTarski/RAP/archive/refs/heads/documentation.zip /tmp/RAP.zip

RUN mkdir -p /app/docs

# For local testing, this is the place to locally edit this dockerfile. 
# 1) Comment out the specific RUN statement(s) for the repo you want to test your local changes:
RUN unzip /tmp/Ampersand.zip 'Ampersand-documentation/docs/*' -d /tmp/ampersand/ \
    && cp -R /tmp/ampersand/Ampersand-documentation/docs/ /app/docs/ampersand
RUN unzip /tmp/prototype.zip 'prototype-documentation/docs/*' -d /tmp/prototype/ \
    && cp -R /tmp/prototype/prototype-documentation/docs/ /app/docs/prototype
RUN unzip /tmp/TheToolsWeUse.zip 'TheToolsWeUse-development/*' -d /tmp/the-tools-we-use/ \
    && cp -R /tmp/the-tools-we-use/TheToolsWeUse-development/ /app/docs/the-tools-we-use
RUN unzip /tmp/RAP.zip 'RAP-documentation/docs/*' -d /tmp/rap/ \
    && cp -R /tmp/rap/RAP-documentation/docs/ /app/docs/rap

# 2) Make sure you copy the entire docs directory of the specific repo to the /tmp folder here.
#    you should do that before you give the instruction `docker compose up -d --build`, in your terminal.

# The following lines will copy that stuff to the place it is required:
# 3) uncomment the required COPY statement(s) below:
# COPY ./tmp/ampersand/ /app/docs/ampersand
# COPY ./tmp/prototype/ /app/docs/prototype
# COPY ./tmp/the-tools-we-use/ /app/docs/the-tools-we-use
# COPY ./tmp/rap/ /app/docs/rap

# Leave the statements below just as is, and you should be fine.
COPY ampersand-docs/. /app/

RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY ./nginx-conf /etc/nginx/conf.d
