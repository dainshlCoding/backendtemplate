#!/bin/bash

if [[ $VERCEL_GIT_COMMIT_REF == "master"  ]] ; then
  echo "This is our prod branch"
  npm run install
else
  echo "This is not our prod branch"
  npm run install --production
fi
