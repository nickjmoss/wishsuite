#!/usr/bin/env bash

if docker network inspect wishsuite_default &> /dev/null ; then
	echo "wishsuite network already exists"
else
	docker network create wishsuite_default
	echo "wishsuit network created"
fi
docker-compose build
docker-compose up -d --force-recreate
docker-compose exec server yarn run db:migrate
docker-compose kill