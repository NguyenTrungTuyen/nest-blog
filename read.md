#Nest project
1. install: 
+ npm i -g @nestjs/cli
+ nest new project-name

2. install database mongodb:
+ npm i @nestjs/mongoose mongoose

3. CRUD generator 
+ nest g resource modules/auth --no-spec

4. .env
+ npm i --save @nestjs/config

5. validator
+ npm i --save class-validator class-transformer

6. test api ui
+ npm install --save @nestjs/swagger swagger-ui-express

7. pagination:
+ npm i api-query-params
https://www.npmjs.com/package/api-query-params

8. auth
+ npm i @nestjs/jwt
+ npm install bcrypt


https://stackoverflow.com/questions/54308318/how-to-get-the-configurations-from-within-a-module-import-in-nestjs

https://www.uuidgenerator.net/


9. passport, Guard
npm install --save @nestjs/passport passport passport-local

npm install --save-dev @types/passport-local

+ token

 npm install --save @nestjs/jwt passport-jwt

 npm install --save-dev @types/passport-jwt

 + global guard:

10. generate idcode
npm i uuid

11. mailer
npm install --save @nestjs-modules/mailer nodemailer

npm install --save handlebars

npm i --save-dev @types/nodemailer
 

 https://nest-modules.github.io/mailer/docs/mailer.html






 =================================================================================================================================================================================
 ===========================================================
 📝 Backend Task – Mini Blog API (NestJS + MongoDB)
🔰 Mục tiêu của Task
Xây dựng một ứng dụng API đơn giản mô phỏng hệ thống blog gồm người dùng, bài viết và bình luận. Task này giúp bạn thực hành kỹ năng backend với NestJS và MongoDB, đồng thời làm quen với các kỹ thuật nâng cao như populate, aggregate, middleware hooks, validation, filter, và phân trang.

🎯 Kết quả mong đợi (Learning Outcomes)
Sau khi hoàn thành, bạn sẽ thành thạo:

Thiết kế & triển khai RESTful API với NestJS + Mongoose

Tạo quan hệ giữa các collection và sử dụng populate() để truy xuất dữ liệu liên quan

Sử dụng aggregate() để thống kê, lọc, và xử lý dữ liệu nâng cao

Áp dụng middleware lifecycle hooks (pre/post) trong Mongoose

Xây dựng hệ thống phân trang và lọc dữ liệu

Xác thực dữ liệu với class-validator và schema-level validation

📌 Mô tả chức năng cần làm
Ứng dụng có 3 collection chính:

1. User
ts
Copy
Edit
{
  _id: ObjectId,
  name: string,
  email: string,
  password: string,
  createdAt: Date
}
2. Post
ts
Copy
Edit
{
  _id: ObjectId,
  author: ObjectId (ref: 'User'),
  title: string,
  content: string,
  tags: [string],
  createdAt: Date
}
3. Comment
ts
Copy
Edit
{
  _id: ObjectId,
  post: ObjectId (ref: 'Post'),
  author: ObjectId (ref: 'User'),
  content: string,
  createdAt: Date
}
🔧 Các chức năng cần triển khai
User
 API tạo user mới (POST /users)

 API lấy danh sách users (GET /users)

 Schema-level validation: email phải là duy nhất

Post
 API tạo bài viết mới (POST /posts)

pre('save'): tự động thêm createdAt

 API lấy danh sách bài viết (GET /posts)

Pagination: ?page=1&limit=10

Filter theo author hoặc tag

populate() author

 API lấy 1 bài viết chi tiết (GET /posts/:id)

populate() comment và author

Comment
 API tạo comment mới (POST /comments)

pre('save'): kiểm tra nội dung không rỗng

 API lấy danh sách comment của bài viết (GET /posts/:id/comments)

populate() author

📊 Thống kê
 API thống kê số bài viết mỗi người dùng (GET /stats/posts-per-user)

Sử dụng aggregate() với $group và $lookup

 API thống kê số comment theo từng bài viết, sắp xếp theo nhiều comment nhất (GET /stats/comments-per-post)

Sử dụng aggregate() với $group, $sort

📚 Kỹ thuật BẮT BUỘC sử dụng
Kỹ thuật	Mục đích	Tài liệu
populate()	Truy xuất dữ liệu liên kết giữa các collection (User → Post, Post → Comment)	https://mongoosejs.com/docs/populate.html
aggregate()	Thống kê số liệu (group, sort, project, lookup)	https://mongoosejs.com/docs/api/aggregate.html
Middleware Hooks	pre('save'), pre('update'), post('save') để xử lý dữ liệu trước/sau khi ghi DB	https://mongoosejs.com/docs/middleware.html
Validation	class-validator + schema-level validation	https://docs.nestjs.com/techniques/validation

📂 Gợi ý cấu trúc thư mục NestJS
pgsql
Copy
Edit
src/
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── schemas/user.schema.ts
│   └── dto/create-user.dto.ts
├── posts/
│   ├── posts.module.ts
│   ├── posts.controller.ts
│   ├── posts.service.ts
│   ├── schemas/post.schema.ts
│   └── dto/create-post.dto.ts
├── comments/
│   ├── comments.module.ts
│   ├── comments.controller.ts
│   ├── comments.service.ts
│   ├── schemas/comment.schema.ts
│   └── dto/create-comment.dto.ts
├── stats/
│   ├── stats.module.ts
│   └── stats.controller.ts
├── app.module.ts
└── main.ts
✅ Checklist khi review task
Code chất lượng
 Tách module rõ ràng cho từng domain (users/posts/comments)

 Dùng DTO với class-validator cho input

 Không có hardcode hoặc lặp code không cần thiết

Kỹ thuật yêu cầu
 Sử dụng đầy đủ populate() khi lấy bài viết và comment

 Có ít nhất 2 API dùng aggregate() đúng mục đích

 Middleware hooks được dùng đúng chỗ (pre('save'), post('save'), pre('update'))

 Có validate ở cả DTO và schema-level (ví dụ: unique email)

API thiết kế tốt
 Hỗ trợ phân trang (pagination) với ?page=&limit=

 Hỗ trợ lọc theo tag, author

 Response body rõ ràng, status code hợp lý

Khác
 Seed data mẫu để test nhanh

 README kèm theo hướng dẫn chạy và test API

📦 Bonus (Không bắt buộc nhưng được khuyến khích)
Đăng nhập đơn giản (JWT auth)

Dùng MongoDB index để tối ưu filter

Viết unit test cho service