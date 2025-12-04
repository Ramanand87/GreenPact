# For Running Backend Server
virtualenv venv :- to install virtual environment(one time only)
venv/Scripts/activate :- to activate virtual env
pip install -r requirements.txt :- to install dependencies(if new dependency added)
pip freeze > requirements.txt:- to add new dependency to requirements.txt file(if new dependency installed)
python manage.py runserver:- to runserver

# for runnning websocket server
uvicorn greenpact.asgi:application --port 5000 --workers 4 --log-level debug --reload

# for docker containers and image
docker-compose up -d --build
docker-compose down
docker build -t docker_username/greenpact:latest
docker push docker_username/greenpact:latest

# To make database migrations
python manage.py makemigrations
python manage.py migrate

# frontend server
npm i
npm run dev


