pip freeze > requirements.txt
venv/Scripts/activate 
docker-compose up -d --build
docker-compose down
docker exec -it django /bin/sh
uvicorn greenpact.asgi:application --port 5000 --workers 4 --log-level debug --reload

for lucky rand
virtualenv venv
venv/Scripts/activate 
pip install -r requirements.txt
python manage.py runserver


python manage.py makemigrations
python manage.py migrate


//

venv/Scripts/activate 
python manage.py runserver
