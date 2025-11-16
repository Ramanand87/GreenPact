FROM python:3.11
ENV PYTHONUNBUFFERED=1
WORKDIR /app

RUN pip install --upgrade pip --default-timeout=1500
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txtCOPY ./entrypoint.sh /usr/src/app/entrypoint.sh
COPY . /app/
RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]
