

# 空教室查詢 API 規格

**Base URL**：`/api`
**認證**：無（公開查詢）
**格式**：`Content-Type: application/json; charset=utf-8`
**時間/日期**：`YYYY-MM-DD`（ISO 8601，例：`2025-10-06`）
**節次 slot**：以整數表示第 N 節（1 起算）。`slotFrom ≤ slotTo`。

## 共用資料型別

### RoomAvailability（列表用）

```json
{
  "buildingCode": "TR",
  "roomNo": "617",
  "floor": 6,
  "capacity": 50,
  "tags": {
    "projector": true,
    "whiteboard": true,
    "sockets": 20,
    "pc": false
  },
  "freeSlotRanges": [[1, 2], [7, 9]]
}
```

* `freeSlotRanges`：該日「空檔區間」的陣列。每個區間為 `[startSlot, endSlot]`（含端點）。
* 若使用者在查詢參數帶入 `slotFrom/slotTo`，伺服器可選擇僅回傳「符合該區間全空」的教室。

### RoomDailyDetail（單間詳情）

```json
{
  "roomKey": "TR-312",
  "date": "2025-10-06",
  "freeSlotRanges": [[3, 5], [8, 9]],
  "capacity": 60,
  "floor": 3,
  "tags": {
    "projector": true,
    "whiteboard": false,
    "sockets": 12,
    "pc": false
  }
}
```

---

## 1) 依日期/館別查空教室

### `GET /api/availability`

**描述**：查詢指定日期，搭配可選的建築物與節次範圍，回傳可用教室清單。

**Query 參數**

* `date` *(必填)*：`YYYY-MM-DD`
* `building` *(選填)*：館別代碼（例：`TR`）。不給則為全校。
* `slotFrom` *(選填)*：整數，起始節次（≥1）
* `slotTo` *(選填)*：整數，結束節次（≥slotFrom）

**200 回應**

```json
{
  "date": "2025-10-06",
  "building": "TR",
  "filters": { "slotFrom": 3, "slotTo": 5 },
  "items": [
    {
      "buildingCode": "TR",
      "roomNo": "617",
      "floor": 6,
      "capacity": 50,
      "tags": { "projector": true, "whiteboard": true, "sockets": 20, "pc": false },
      "freeSlotRanges": [[1, 2], [6, 12]]
    }
  ],
  "total": 1
}
```

**可能錯誤**

* `400`：缺少 `date`、參數型別或範圍錯誤（如 `slotFrom > slotTo`）。
* `500`：伺服器錯誤。

> **備註（假日）**：若為放假日，建議仍回 `200`，`items: []`。前端可另呼叫 `/api/calendar/:date` 顯示提示。

---

## 2) 星期查詢（當週）

### `GET /api/availability/week`

**描述**：輸入星期幾，系統換算為「本週最近的該星期日期」，回傳該日的可用教室清單，並附上實際日期。

**Query 參數**

* `weekday` *(必填)*：`1..7`（1=Mon … 7=Sun）
* `slotFrom` *(選填)*
* `slotTo` *(選填)*

**200 回應**

```json
{
  "weekday": 2,
  "date": "2025-10-07",
  "filters": { "slotFrom": 3, "slotTo": 5 },
  "items": [ /* RoomAvailability[] */ ],
  "total": 42
}
```

**可能錯誤**

* `400`：`weekday` 不在 1..7、或 `slotFrom/slotTo` 非法。
* `500`：伺服器錯誤。

---

## 3) 教室單日詳情

### `GET /api/room/:roomKey`

**描述**：查詢某教室在指定日期（或預設今天）的空檔時段。

**Path 參數**

* `roomKey` *(必填)*：教室代碼（例：`TR-312`）

**Query 參數**

* `date` *(選填)*：`YYYY-MM-DD`（省略則預設今天）

**200 回應**

```json
{
  "roomKey": "TR-312",
  "date": "2025-10-06",
  "freeSlotRanges": [[1, 2], [4, 7]],
  "capacity": 60,
  "floor": 3,
  "tags": { "projector": true, "whiteboard": false, "sockets": 12, "pc": false }
}
```

**可能錯誤**

* `404`：找不到該教室。
* `400`：`date` 格式錯誤。
* `500`：伺服器錯誤。

---

## 4) 假日查詢

### `GET /api/calendar/:date`

**描述**：判斷指定日期是否為假日。

**Path 參數**

* `date` *(必填)*：`YYYY-MM-DD`

**200 回應**

```json
{
  "date": "2025-10-10",
  "isHoliday": true,
  "note": "國定假日"
}
```

**可能錯誤**

* `400`：日期格式錯誤。
* `404`：該日期不在行事曆資料範圍（可自行定義是否回 404 或回 `isHoliday:false`）。
* `500`：伺服器錯誤。

---

## 5) 建築物 / 樓層清單

### `GET /api/buildings`

**描述**：取得所有館別清單。

**200 回應**

```json
{
  "items": [
    { "code": "TR", "name": "研揚大樓", "campus": "Main" },
    { "code": "B", "name": "教學大樓", "campus": "Main" }
  ],
  "total": 2
}
```

### `GET /api/buildings/:code/floors`

**描述**：取得指定館別的樓層清單（如需）。

**Path 參數**

* `code` *(必填)*：館別代碼（例：`TR`）

**200 回應**

```json
{ "building": "TR", "floors": [1,2,3,4,5,6,7,8,9] }
```

**可能錯誤**

* `404`：找不到該館別。
* `500`：伺服器錯誤。

---

## 6) 全站按讚（浮動 ❤️）

### `GET /api/site/likes`

**描述**：取得目前網站總讚數。

**200 回應**

```json
{ "likesTotal": 128 }
```

### `POST /api/site/like`

**描述**：對整個網站按讚一次。伺服器端應做去重（建議以瀏覽器指紋/每日一次等策略），並回傳最新總讚數。

**200 回應**

```json
{ "likesTotal": 129, "accepted": true }
```

**可能錯誤**

* `429`：按讚頻率過高 / 當日已按過。
* `500`：伺服器錯誤。

---

## 錯誤回應格式（建議統一）

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "date is required",
    "details": { "field": "date" }
  }
}
```

**常見錯誤碼**

* `BAD_REQUEST`（400）：參數缺漏或格式錯誤
* `NOT_FOUND`（404）：資源不存在
* `TOO_MANY_REQUESTS`（429）：按讚或查詢頻率過高（若實作）
* `INTERNAL_ERROR`（500）：未預期錯誤

---

## 使用建議（與前端行為一致）

* **分享連結**：前端會把 `date/building/slotFrom/slotTo/weekday/roomKey` 等參數同步到網址列，直接貼上即可還原同一查詢。
* **假日顯示**：日期查詢前可先打 `/api/calendar/:date`，若 `isHoliday: true` 則顯示提示並不發出 `/api/availability`（或接受 `items: []`）。
* **節次篩選**：未傳 `slotFrom/slotTo` 時，`/api/availability` 建議回傳「全日空檔區間」（`freeSlotRanges`），前端將以條狀圖顯示。


### 新增訪客紀錄

**POST** `/api/visit`

* 無 body，伺服器自動從 request header 抓資訊。

**200 回應**

```json
{ "ok": true }
```

---

### 取得訪客統計

**GET** `/api/visits/stats`

* 可加 query，例如 `?range=today`

**200 回應**

```json
{
  "total": 5321,
  "today": 42,
  "uniqueIPs": 35
}
```