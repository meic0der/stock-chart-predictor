run:
	. .venv/bin/activate && \
	export FLASK_APP=app.py && \
	export FLASK_ENV=development && \
	flask run --host=0.0.0.0

freeze:
	. .venv/bin/activate && pip freeze > requirements.txt

install:
	pip install -r requirements.txt

test:
	. .venv/bin/activate && python -m unittest discover tests
