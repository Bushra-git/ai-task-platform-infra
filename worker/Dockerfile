FROM python:3.11-slim

WORKDIR /app

COPY . .

RUN pip install redis pymongo python-dotenv

CMD ["python", "worker.py"]