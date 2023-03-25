#!/bin/bash
eval $(aws ecr get-login --no-include-email --region "us-east-1")

docker build -t full-marketing-react .

docker tag full-marketing-react:latest 434704177489.dkr.ecr.us-east-1.amazonaws.com/full-marketing-react:latest

docker push 434704177489.dkr.ecr.us-east-1.amazonaws.com/full-marketing-react:latest


