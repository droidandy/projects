#!/bin/bash
echo "Preparing deploy to: /home/ec2-user/cap-admin-dev"

cd build
tar -zcvf ../capadmin.dist.tar.gz .
cd -
echo "Bundling finished..."

echo "Uploading artifact to /home/ec2-user/capadmin-docker/tmp"
scp capadmin.dist.tar.gz ec2-user@3.89.79.145:/home/ec2-user/capadmin-docker/tmp

echo "Remove previous build && extract archive to /home/ec2-user/capadmin-docker/web"
ssh -i $1 ec2-user@3.89.79.145 "rm -rf /home/ec2-user/capadmin-docker/web/* && tar -xvzf /home/ec2-user/capadmin-docker/tmp/capadmin.dist.tar.gz -C /home/ec2-user/capadmin-docker/web && cd /home/ec2-user/capadmin-docker && docker-compose up --detach --build --force-recreate"

# node ./scripts/slack.js

echo "Deploy done!"
