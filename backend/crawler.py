from selenium import webdriver 
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import time
from datetime import datetime, timedelta
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
building_collection = db["building"]
course_collection = db["course"]

url = "https://dss18.ntust.edu.tw/classroom_user/qry_classroom.htm"
driver = webdriver.Chrome()  
driver.get(url)
wait = WebDriverWait(driver, 20)

# 先等主頁載入完成
wait.until(lambda d: d.execute_script("return document.readyState") == "complete")

time_table = {
    "1": "8:10-9:00",
    "2": "9:10-10:00",
    "3": "10:20-11:10",
    "4": "11:20-12:10",
    "5": "12:20-13:10",
    "6": "13:20-14:10",
    "7": "14:20-15:10",
    "8": "15:30-16:20",
    "9": "16:30-17:20",
    "10": "17:30-18:20",
    "11": "18:25-19:15",
    "12": "19:20-20:10",
    "13": "20:15-21:05",
    "14": "21:10-22:00"
}

weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"]

buildings = [
    ("第四教學大樓", "T4"),
    ("第三教學大樓", "T3"),
    ("工程一館", "E1"),
    ("工程二館", "E2"),
    ("電資樓", "EE"),
    ("管理大樓", "MA"),
    ("研揚大樓", "TR"),
    ("國際大樓", "IB"),
]

# 所有(巢狀)frame/iframe，切到有元素的那一層
def switch_to_frame_with(locator):
    driver.switch_to.default_content()
    frames = driver.find_elements(By.CSS_SELECTOR, "frame, iframe")
    # 先嘗試本層
    try:
        wait.until(EC.presence_of_element_located(locator))
        return True
    except TimeoutException:
        pass
    # 一層層找
    for i in range(len(frames)):
        driver.switch_to.default_content()
        frames = driver.find_elements(By.CSS_SELECTOR, "frame, iframe")  # 重新取，避免 stale
        driver.switch_to.frame(frames[i])
        try:
            wait.until(EC.presence_of_element_located(locator))
            return True
        except TimeoutException:
            # 嘗試巢狀子 frame
            inner = driver.find_elements(By.CSS_SELECTOR, "frame, iframe")
            for j in range(len(inner)):
                driver.switch_to.default_content()
                frames = driver.find_elements(By.CSS_SELECTOR, "frame, iframe")
                driver.switch_to.frame(frames[i])
                inner = driver.find_elements(By.CSS_SELECTOR, "frame, iframe")
                driver.switch_to.frame(inner[j])
                try:
                    wait.until(EC.presence_of_element_located(locator))
                    return True
                except TimeoutException:
                    continue
    driver.switch_to.default_content()
    return False

# 取得該日的整天課表，並儲存起來
def collect_courses(date, weekday):
    course_data_to_insert = []
    table = driver.find_elements(By.XPATH, '//table[@id="showinfo_grd"]/tbody/tr')
    for row in table[1:-1]:
        blocks = row.find_elements(By.XPATH, './td')
        for i in range(0, 15):  # 0->教室, 1->第一節, ..., 14->第十四節
            if i == 0: 
                classroom = blocks[i].text.strip()
                if classroom == "1": break
            else:
                start_time = time_table[str(i)].split("-")[0]
                end_time = time_table[str(i)].split("-")[1]
                course_starttime = datetime.strptime(f"{datetime.now().year}{date}{start_time}", "%Y%m月%d日%H:%M")
                course_endtime = datetime.strptime(f"{datetime.now().year}{date}{end_time}", "%Y%m月%d日%H:%M")
                dateTime = datetime.strptime(f"{datetime.now().year}{date}", "%Y%m月%d日")
                if not blocks[i].text:
                    course_data_to_insert.append({
                        "professor": "",
                        "courseName": "",
                        "startTime": course_starttime,
                        "endTime": course_endtime,
                        "buildingCode": classroom.split("-")[0],  # ex: TR
                        "roomNumber": classroom.split("-")[1],
                        "weekday": weekdays[weekday],
                        "timeSlotNo": i,
                        "dateTime": dateTime
                    })
                    continue
                courseName = blocks[i].text.split()[0]
                professor = blocks[i].text.split()[-1] if courseName else ""
                course_data_to_insert.append({
                    "professor": professor,
                    "courseName": courseName,
                    "startTime": course_starttime,
                    "endTime": course_endtime,
                    "buildingCode": classroom.split("-")[0],  # ex: TR
                    "roomNumber": classroom.split("-")[1],
                    "weekday": weekdays[weekday],
                    "timeSlotNo": i,
                    "dateTime": dateTime
                })
                print(f"{weekdays[weekday]} {classroom} {courseName} {professor} {course_starttime}~{course_endtime} {dateTime}")
    return course_data_to_insert

def add_course_to_mongo(course_data):
    for item in course_data:
        try:
            course_collection.update_one(
                {"startTime": item["startTime"], "buildingCode": item["buildingCode"], "roomNumber": item["roomNumber"]},
                {"$set": item},
                upsert=True
            )
        except Exception as e:
            print(f"Error updating course in MongoDB: {e}")

# main
locator = (By.XPATH, '//select[@name="classlist_ddl"]')
ok = switch_to_frame_with(locator)
if not ok:
    raise RuntimeError("找不到含有 classlist_ddl 的 frame/iframe")

# empty the database for the previous week
building_collection.drop()
course_collection.drop()

# TODO:
# 1. 應該把本日以後的

for i in range(len(buildings)):
    # 到這裡就已在正確的 frame 了
    ddl = Select(wait.until(EC.element_to_be_clickable(locator)))
    ddl.select_by_index(i+1) 

    # 下一個最近的週一
    day = 7 - datetime.today().weekday()
    date = datetime.today()+timedelta(days=day)

    for i in range(5):
        tag = f"{date.month}月{date.day+i}日"  # ex: 9月15日
        print(f"Collecting {tag} ...")
        driver.find_element(By.XPATH, f"//a[@title='{tag}']").click()
        time.sleep(3)  # 等待課表載入
        course = collect_courses(tag, i)
        add_course_to_mongo(course)
        time.sleep(2)
        
    building_collection.update_one(
        {"buildingCode": buildings[i][1]},
        {"$set": {"name": buildings[i][0], "buildingCode": buildings[i][1], "campus": "Main"}},
        upsert=True
    )
    
client.close()
driver.close()

