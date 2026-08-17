# API contract - Ứng viên tiềm năng

Contract này phục vụ màn hình `/ung-vien-tiem-nang`.

## 1. Quy ước chung

- Base URL: `/api/v1`
- Authentication: `Authorization: Bearer <access_token>`
- Content type mặc định: `application/json; charset=utf-8`
- Thời gian dùng ISO 8601 và kèm múi giờ, ví dụ `2026-08-13T09:30:00+07:00`.
- Các endpoint danh sách dùng phân trang từ `1`.
- Backend sinh `id`, `createdAt`, `updatedAt`; frontend không gửi các trường này khi tạo mới.

### Response thành công

```json
{
  "data": {},
  "meta": null
}
```

Với API danh sách, `meta` có dạng:

```json
{
  "page": 1,
  "pageSize": 20,
  "totalItems": 57,
  "totalPages": 3
}
```

### Response lỗi

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu không hợp lệ.",
    "fields": {
      "name": "Họ và tên là bắt buộc."
    }
  }
}
```

Mã HTTP sử dụng: `200`, `201`, `204`, `400`, `401`, `403`, `404`, `409`, `422`, `500`.

## 2. Data model

### PotentialCandidate

| Field | Type | Required khi tạo | Ghi chú |
|---|---|---:|---|
| `id` | string | Không | Mã ứng viên, ví dụ `UV-1001` |
| `customerId` | string \| null | Không | Mã khách hàng sau khi được liên kết/chuyển đổi |
| `name` | string | Có | Họ và tên; tối đa 150 ký tự |
| `gender` | enum | Có | `Nam`, `Nữ`, `Khác` |
| `birthYear` | integer \| null | Không | Từ `1900` đến năm hiện tại |
| `school` | string | Không | Tối đa 255 ký tự |
| `className` | string | Không | Tối đa 50 ký tự |
| `certificates` | string[] | Không | Các chứng chỉ đang có |
| `fatherName` | string | Không | Họ tên cha |
| `fatherPhone` | string | Không | Số điện thoại cha |
| `motherName` | string | Không | Họ tên mẹ |
| `motherPhone` | string | Không | Số điện thoại mẹ |
| `parentInfo` | string | Có điều kiện | Thông tin phụ huynh/người liên hệ khác |
| `parentPhone` | string | Có điều kiện | SĐT phụ huynh/người liên hệ khác |
| `address` | string | Không | Địa chỉ nhà ở |
| `learningGoals` | enum[] | Không | Mục tiêu học tập |
| `otherLearningGoal` | string | Không | Mục tiêu khác |
| `englishExperience` | enum[] | Không | Quá trình học tiếng Anh |
| `previousEnglishCenter` | string | Không | Trung tâm từng học |
| `learningStyles` | enum[] | Không | Hình thức học yêu thích |
| `registrationCourse` | string | Không | Khóa học đăng ký |
| `registrationShift` | string | Không | Ca học |
| `registrationDays` | string | Không | Ngày học |
| `registrationTuition` | string | Không | Học phí hiển thị; giữ dạng chuỗi theo UI hiện tại |
| `registrationNote` | string | Không | Ghi chú đăng ký |
| `desiredCourses` | string[] | Không | Các khóa học mong muốn |
| `freeSchedule` | string | Không | Lịch rảnh dạng mô tả |
| `callCount` | integer | Không | Số lần gọi, mặc định `0`, không âm |
| `status` | enum | Có | `Mới`, `Đang tư vấn`, `Đã hẹn test`, `Cần gọi lại` |
| `createdAt` | datetime | Không | Backend sinh |
| `updatedAt` | datetime | Không | Backend sinh |

Điều kiện thông tin liên hệ: phải có ít nhất một tên người liên hệ trong `fatherName`, `motherName`, `parentInfo` và ít nhất một số điện thoại trong `fatherPhone`, `motherPhone`, `parentPhone`.

Các enum:

- `learningGoals`: `Học giao tiếp`, `Học theo chương trình Bộ GD`, `Chuẩn bị vào lớp 6,10`, `Chuẩn bị thi chứng chỉ`, `Mất gốc`, `Muốn con tự tin hơn`.
- `englishExperience`: `Chưa từng học`, `Dưới 1 năm`, `1-3 năm`, `Trên 3 năm`.
- `learningStyles`: `Học qua trò chơi`, `Thuyết trình`, `Dự án`, `Online`, `Offline`.

### Ví dụ PotentialCandidate

```json
{
  "id": "UV-1001",
  "customerId": "KH-1024",
  "name": "Nguyễn Minh Anh",
  "gender": "Nữ",
  "birthYear": 2012,
  "school": "THPT Nguyễn Thị Minh Khai",
  "className": "10A3",
  "certificates": ["Flyers", "KET 135"],
  "fatherName": "",
  "fatherPhone": "",
  "motherName": "Trần Thu Hà",
  "motherPhone": "0901234567",
  "parentInfo": "",
  "parentPhone": "",
  "address": "24 Nguyễn Văn Trỗi, Phú Nhuận, TP.HCM",
  "learningGoals": ["Chuẩn bị thi chứng chỉ"],
  "otherLearningGoal": "",
  "englishExperience": ["1-3 năm"],
  "previousEnglishCenter": "",
  "learningStyles": ["Offline"],
  "registrationCourse": "IELTS Foundation",
  "registrationShift": "Ca tối",
  "registrationDays": "T2, T4",
  "registrationTuition": "12.800.000",
  "registrationNote": "",
  "desiredCourses": ["IELTS Foundation", "Giao tiếp thiếu niên"],
  "freeSchedule": "T2/T4 sau 18:00, CN sáng",
  "callCount": 2,
  "status": "Mới",
  "createdAt": "2026-08-13T09:30:00+07:00",
  "updatedAt": "2026-08-13T09:30:00+07:00"
}
```

## 3. APIs ứng viên

### 3.1. Lấy danh sách

`GET /potential-candidates`

Query parameters:

| Param | Type | Default | Mô tả |
|---|---|---|---|
| `q` | string | `""` | Tìm không phân biệt hoa thường trên tên, trường, lớp, phụ huynh, SĐT, địa chỉ, chứng chỉ, khóa học và lịch rảnh |
| `status` | enum | Không có | Bỏ param để lấy tất cả trạng thái |
| `page` | integer | `1` | Trang hiện tại |
| `pageSize` | integer | `20` | Số bản ghi/trang, tối đa `100` |
| `sortBy` | enum | `createdAt` | `createdAt`, `updatedAt`, `name`, `callCount`, `status` |
| `sortOrder` | enum | `desc` | `asc`, `desc` |

Response `200`:

```json
{
  "data": [
    {
      "id": "UV-1001",
      "customerId": "KH-1024",
      "name": "Nguyễn Minh Anh",
      "gender": "Nữ",
      "birthYear": 2012,
      "school": "THPT Nguyễn Thị Minh Khai",
      "className": "10A3",
      "certificates": ["Flyers", "KET 135"],
      "parentInfo": "Mẹ: Trần Thu Hà",
      "parentPhone": "0901234567",
      "address": "24 Nguyễn Văn Trỗi, Phú Nhuận, TP.HCM",
      "desiredCourses": ["IELTS Foundation"],
      "freeSchedule": "T2/T4 sau 18:00",
      "callCount": 2,
      "status": "Mới",
      "createdAt": "2026-08-13T09:30:00+07:00",
      "updatedAt": "2026-08-13T09:30:00+07:00"
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 1,
    "totalPages": 1
  }
}
```

Trong response danh sách, `parentInfo` và `parentPhone` là giá trị hiển thị do backend tổng hợp từ các trường cha/mẹ/người liên hệ khác. API chi tiết vẫn trả toàn bộ các trường gốc.

### 3.2. Lấy chi tiết

`GET /potential-candidates/{candidateId}`

Response `200`: `data` là một `PotentialCandidate` đầy đủ.

Response `404`: `POTENTIAL_CANDIDATE_NOT_FOUND`.

### 3.3. Tạo ứng viên

`POST /potential-candidates`

Permission: `student.create`.

Frontend chỉ gửi các field trong request dưới đây. Không gửi `code`, `branchId`, `status`, `enrollmentDate`, `studentId` hoặc các field CRM mở rộng vì backend bật `forbidNonWhitelisted`.

```json
{
  "name": "Nguyễn Minh Anh",
  "gender": "Nữ",
  "birthYear": 2012,
  "school": "THCS Nguyễn Du",
  "className": "7A1",
  "address": "24 Nguyễn Văn Trỗi, Phú Nhuận, TP.HCM",
  "fatherName": "Nguyễn Văn A",
  "fatherPhone": "0901234567",
  "motherName": "Trần Thị B",
  "motherPhone": "0912345678",
  "primaryGuardian": "mother",
  "note": "Ứng viên mới"
}
```

Các field được chấp nhận: `name`, `gender`, `birthDate`, `birthYear`, `phone`, `email`, `school`, `className`, `address`, `fatherName`, `fatherPhone`, `motherName`, `motherPhone`, `parentInfo`, `parentPhone`, `primaryGuardian`, `note`.

- Mỗi guardian đã nhập phải có đủ tên và SĐT; cần ít nhất một guardian hợp lệ.
- `primaryGuardian` nhận `father`, `mother`, `other` và chỉ được trỏ đến guardian hợp lệ.
- Nếu chỉ gửi `birthYear`, backend lưu `YYYY-01-01` và trả `birthDateEstimated: true`.
- Backend tự sinh mã `HVxxxxxx`, lấy chi nhánh từ tài khoản và tạo student với `status: trial` trong cùng transaction với guardians.

Response `201`: envelope `{ success, message, data }`; `data` là student vừa tạo và có mảng `guardians`.

### 3.4. Cập nhật ứng viên

`PATCH /potential-candidates/{candidateId}`

Request chỉ cần gửi các trường thay đổi. Có thể cập nhật `callCount`; giá trị phải là số nguyên không âm. Không cho phép cập nhật `id`, `customerId`, `createdAt`, `updatedAt` qua endpoint này.

```json
{
  "status": "Đang tư vấn",
  "callCount": 3,
  "freeSchedule": "T3/T5 sau 19:00"
}
```

Response `200`: `data` là ứng viên sau cập nhật.

Response `404`: `POTENTIAL_CANDIDATE_NOT_FOUND`.

### 3.5. Xóa ứng viên

`DELETE /potential-candidates/{candidateId}`

Response `204`: không có body.

Response `409` với code `POTENTIAL_CANDIDATE_IN_USE` nếu ứng viên đã phát sinh dữ liệu không thể xóa. Backend không tự động xóa lịch hẹn hoặc khách hàng liên quan.

### 3.6. Import ứng viên

`POST /potential-candidates/import`

Content type: `multipart/form-data`.

| Field | Type | Required | Ghi chú |
|---|---|---:|---|
| `file` | binary | Có | `.csv` hoặc `.json`, tối đa 5 MB |

CSV dùng UTF-8, dòng đầu là header. JSON chấp nhận một object hoặc một mảng object. Tên cột chuẩn dùng đúng tên field trong `PotentialCandidate`; server có thể hỗ trợ thêm alias tiếng Việt hiện có ở frontend như `ten`, `gioiTinh`, `namSinh`, `truong`, `lop`, `phuHuynh`, `sdtPhuHuynh`, `diaChi`, `khoaHoc`, `lichRanh`, `soLanGoi`, `trangThai`.

Response `200`:

```json
{
  "data": {
    "totalRows": 10,
    "importedRows": 8,
    "failedRows": 2,
    "errors": [
      {
        "row": 4,
        "code": "MISSING_CONTACT",
        "message": "Thiếu thông tin hoặc số điện thoại phụ huynh."
      }
    ]
  },
  "meta": null
}
```

Import theo kiểu partial success: các dòng hợp lệ được lưu, các dòng lỗi được trả về trong `errors`. Nếu file sai định dạng hoặc không đọc được, trả `422 INVALID_IMPORT_FILE` và không lưu dữ liệu.

### 3.7. Export ứng viên

`GET /potential-candidates/export`

Nhận cùng bộ lọc `q` và `status` như API danh sách.

| Param | Type | Default | Ghi chú |
|---|---|---|---|
| `format` | enum | `csv` | `csv`, `json` |

Response `200` là file download với `Content-Disposition: attachment`. File CSV dùng UTF-8 BOM để hiển thị đúng tiếng Việt trong Excel.

## 4. Tạo lịch hẹn từ ứng viên

Khi người dùng sửa ứng viên và nhập phần “Tạo lịch hẹn”, frontend cập nhật ứng viên trước, sau đó gọi API này:

`POST /potential-candidates/{candidateId}/appointments`

```json
{
  "scheduledAt": "2026-08-15T18:30:00+07:00",
  "type": "Test đầu vào",
  "room": "Online",
  "status": "Mới tạo"
}
```

Validation:

- `scheduledAt` bắt buộc.
- `type`: `Test đầu vào`, `Tư vấn`, `Đóng học phí`, `Ký hợp đồng`.
- `status`: `Mới tạo`, `Chờ xác nhận`, `Đã xác nhận`, `Đã hoàn thành`, `Đã hủy`.
- `room` mặc định là `Online`.
- Backend lấy `customer`, `phone`, `customerId`, `candidateId` từ ứng viên; frontend không cần gửi lặp lại.

Response `201`:

```json
{
  "data": {
    "id": "LH-1001",
    "candidateId": "UV-1001",
    "customerId": "KH-1024",
    "customer": "Nguyễn Minh Anh",
    "phone": "0901234567",
    "scheduledAt": "2026-08-15T18:30:00+07:00",
    "type": "Test đầu vào",
    "room": "Online",
    "status": "Mới tạo",
    "createdAt": "2026-08-13T10:00:00+07:00"
  },
  "meta": null
}
```

## 5. Mapping thao tác trên UI

| Thao tác | API |
|---|---|
| Mở màn hình, tìm kiếm, lọc trạng thái | `GET /potential-candidates` |
| Xem chi tiết | `GET /potential-candidates/{candidateId}` |
| Thêm mới | `POST /potential-candidates` |
| Chỉnh sửa | `PATCH /potential-candidates/{candidateId}` |
| Xóa | `DELETE /potential-candidates/{candidateId}` |
| Import | `POST /potential-candidates/import` |
| Export | `GET /potential-candidates/export` |
| Tạo lịch hẹn trong form chỉnh sửa | `POST /potential-candidates/{candidateId}/appointments` |
