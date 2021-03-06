dangling-images = $(shell docker images -f "dangling=true" -q) 

clear-images:
	docker rmi $(dangling-images)

exited-containers = $(shell docker ps -a -f status=exited -q)

clear-containers:
	docker rm $(exited-containers)

build:
	docker-compose up --build
