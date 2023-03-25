#!/usr/bin/env bash

echo "Waiting for frontend to start..."

for i in {1..10}; do
  curl -f --max-time 10 http://localhost:3030 > /dev/null 2> /dev/null;
  if [ $? = 0 ]; then
    echo "Frontend started. Let's begin!"
    break
  fi
  sleep $i
  echo "Retrying..."
done

exit 0
