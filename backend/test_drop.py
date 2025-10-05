import dotenv
import os
from pymongo import MongoClient
import certifi
# 資料庫連線
dotenv.load_dotenv()
client = MongoClient(
    os.getenv("MONGO_URI"), 
    serverSelectionTimeoutMS=5000, 
    tlsCAFile=certifi.where() 
) 
db = client["emptyClassroom"]
test_collection = db["test"]

test_collection.drop()

test_collection.insert_one({
    "name": "jason",
    "age": 15
})

client.close()