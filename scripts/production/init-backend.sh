#!/bin/bash

PROJECT_FOLDER=${1:-survey-do}
APP_DIR=$HOME/$PROJECT_FOLDER

chown -R $USER $APP_DIR

cd "$APP_DIR/apps/backend"

echo 'Running yarn install... @backend'
yarn install;
# yarn upgrade;

echo 'Running yarn build... @backend'
yarn build;

echo 'Running migrate:latest... @backend'
yarn migrate:latest

echo 'Running pm2 restart... @backend'
pm2 delete survey-backend;
pm2 delete do-app-backend;
yarn start:pm2 -f;

cd $APP_DIR