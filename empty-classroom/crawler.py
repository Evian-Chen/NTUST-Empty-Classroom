from selenium import webdriver 
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import time, datetime

url = "https://dss18.ntust.edu.tw/classroom_user/qry_classroom.htm"
driver = webdriver.Chrome()  
driver.get(url)
wait = WebDriverWait(driver, 20)

# 先等主頁載入完成
wait.until(lambda d: d.execute_script("return document.readyState") == "complete")

# 便利所有(巢狀)frame/iframe，切到有元素的那一層
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
def collect_courses(tag):
    pass

locator = (By.XPATH, '//select[@name="classlist_ddl"]')
ok = switch_to_frame_with(locator)
if not ok:
    raise RuntimeError("找不到含有 classlist_ddl 的 frame/iframe")

# 到這裡就已在正確的 frame 了
ddl = Select(wait.until(EC.element_to_be_clickable(locator)))
ddl.select_by_index(1) 

# 下一個最近的週一
day = 7 - datetime.datetime.today().weekday()  
date = datetime.datetime.today()+datetime.timedelta(days=day)

for i in range(5):
    tag = f"{date.month}月{date.day+i}日"  # ex: 9月15日
    print(f"Collecting {tag} ...")
    collect_courses(tag)


# 搜尋第二個 building

ddl = Select(wait.until(EC.element_to_be_clickable(locator)))
ddl.select_by_index(2)
time.sleep(5)          
# 注意：此 select 的 onchange 有 __doPostBack，會觸發重新載入
# → 重新尋找元素（且可能需要再次切換 frame）
switch_to_frame_with(locator)
ddl = Select(wait.until(EC.element_to_be_clickable(locator)))

# 接著選樓層/時段等…(同理每次 postback 後都重找一次)

driver.close()