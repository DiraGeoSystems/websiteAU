
pull:
	@echo "Pulling changes from orign"
	git pull origin

push publish:
	@echo "Publishing on GitHub Pages"
	git push origin

stage:
	@echo "Staging ./docs/ to seven.xilab.ch (GET sylphe.ch/dira/index.html)"
	rsync -av --delete --exclude ".*.swp" --exclude ".fslckout" \
		--exclude ".well-known/" \
		./docs/ seven.xilab.ch:/data/httpd/sylphe.ch/htdocs/dira/
