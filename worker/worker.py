import redis
import json
import time
import os

from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

# Redis connection
redis_client = redis.Redis(
    host="localhost",
    port=6379,
    decode_responses=True
)

# MongoDB connection
mongo_client = MongoClient(os.getenv("MONGO_URI"))

db = mongo_client["test"]

tasks_collection = db["tasks"]

print("Worker Started...")

while True:

    try:

        # Get latest pending task
        task = tasks_collection.find_one({
            "status": "pending"
        })

        if task:

            task_id = str(task["_id"])

            print(f"Processing Task: {task_id}")

            # Update running status
            tasks_collection.update_one(
                {"_id": ObjectId(task_id)},
                {
                    "$set": {
                        "status": "running",
                        "logs": "Task processing started"
                    }
                }
            )

            input_text = task["inputText"]
            operation = task["operation"]

            result = ""

            # OPERATIONS

            if operation == "uppercase":
                result = input_text.upper()

            elif operation == "lowercase":
                result = input_text.lower()

            elif operation == "reverse":
                result = input_text[::-1]

            elif operation == "wordcount":
                result = str(len(input_text.split()))

            else:
                raise Exception("Invalid operation")

            time.sleep(2)

            # Update success
            tasks_collection.update_one(
                {"_id": ObjectId(task_id)},
                {
                    "$set": {
                        "status": "success",
                        "result": result,
                        "logs": "Task completed successfully"
                    }
                }
            )

            print("Task Completed")

        time.sleep(3)

    except Exception as e:

        print("Worker Error:", e)