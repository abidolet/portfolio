all:
	npm install
	$(MAKE) build

build:
	npm run build

dev:
	npm run dev

clean:
	rm -rf build

fclean: clean
	rm -f package-lock.json
	rm -rf node_modules
