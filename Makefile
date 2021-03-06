dangling-images = $(shell sudo docker images -f "dangling=true" -q) 

clear-images:
	sudo docker rmi $(dangling-images)

exited-containers = $(shell sudo docker ps -a -f status=exited -q)

clear-containers:
	sudo docker rm $(exited-containers)

build:
	sudo docker-compose up --build
