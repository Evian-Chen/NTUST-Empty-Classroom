from pymongo import MongoClient
import certifi # 匯入 certifi

# 請替換成您的連線字串
MONGO_URI = "mongodb+srv://EvianChen:921208kk@toastmastersapp.cxdjq5u.mongodb.net/"

try:
    print("嘗試連線...")
    
    # 傳入 tlsCAFile 參數，明確告訴 PyMongo 去哪裡找信任的憑證
    client = MongoClient(
        MONGO_URI, 
        serverSelectionTimeoutMS=5000, 
        tlsCAFile=certifi.where() 
    ) 
    
    # 嘗試獲取伺服器資訊，這會強制連線
    client.admin.command('ismaster') 
    
    print("\n✅ 連線成功！問題已解決。")
    client.close()

except Exception as e:
    print("\n❌ 連線失敗。錯誤訊息如下:")
    print(e)