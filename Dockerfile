FROM node:lts as build

WORKDIR /app

COPY ampersand-docs/package.json ampersand-docs/package-lock.json /app/

RUN npm install
RUN npx update-browserslist-db@latest

ADD https://github.com/AmpersandTarski/ampersand/archive/refs/heads/documentation.zip /tmp/Ampersand.zip
# For prototype and RAP repos we use the main branch
ADD https://github.com/AmpersandTarski/RAP/archive/refs/heads/main.zip /tmp/RAP.zip
ADD https://github.com/AmpersandTarski/prototype/archive/refs/heads/main.zip /tmp/prototype.zip

RUN mkdir -p /app/docs

# For local testing, this is the place to locally edit this dockerfile. 
# 1) Comment out the specific RUN statement(s) for the repo you want to test your local changes:
RUN unzip /tmp/Ampersand.zip 'Ampersand-documentation/docs/*' -d /tmp/ampersand/ \
    && cp -R /tmp/ampersand/Ampersand-documentation/docs/ /app/docs/ampersand
RUN unzip /tmp/prototype.zip 'prototype-main/docs/*' -d /tmp/prototype/ \
    && cp -R /tmp/prototype/prototype-main/docs/ /app/docs/prototype
RUN unzip /tmp/RAP.zip 'RAP-main/docs/*' -d /tmp/rap/ \
    && cp -R /tmp/rap/RAP-main/docs/ /app/docs/rap

# 2) Make sure you copy the entire docs directory of the specific repo to the /tmp folder here.
#    you should do that before you give the instruction `docker compose up -d --build`, in your terminal.

# The following lines will copy that stuff to the place it is required:
# 3) uncomment the required COPY statement(s) below:
# COPY ./tmp/ampersand/ /app/docs/ampersand
# COPY ./tmp/prototype/ /app/docs/prototype
# COPY ./tmp/rap/ /app/docs/rap

# Leave the statements below just as is, and you should be fine.
COPY ampersand-docs/. /app/

RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY ./nginx-conf /etc/nginx/conf.d
