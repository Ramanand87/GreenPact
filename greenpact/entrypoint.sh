#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

# Wait for database
echo "Waiting for database..."
python << END
import sys
import time
import os
import django
from django.db import connections
from django.db.utils import OperationalError

# Setup django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "greenpact.settings")
django.setup()

conn = connections['default']
for i in range(30):
    try:
        conn.cursor()
        print("Database available")
        sys.exit(0)
    except OperationalError:
        print("Database unavailable, waiting 1s...")
        time.sleep(1)
sys.exit(1)
END

# Run database migrations
echo "Running migrations..."
python manage.py migrate

# Start the server
echo "Starting server..."
exec uvicorn greenpact.asgi:application --host 0.0.0.0 --port 5000 --workers 4 --log-level debug
