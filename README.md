# Decap Demo (Next.js + Decap CMS + Cloudflare Pages)

Site tĩnh tối giản để thử Decap CMS. Khách vào `/admin`, đăng nhập GitHub, sửa chữ, thêm project, upload ảnh. Mỗi lần Save là một commit vào repo, Cloudflare tự build lại.

## Cấu trúc

```
content/site.json          Nội dung trang chủ (sửa được, không thêm được)
content/projects/*.json    Mỗi project một file (thêm/xóa được)
public/admin/config.yml    Cấu hình Decap: field nào được sửa
public/uploads/            Ảnh khách upload
functions/api/auth.js      Đăng nhập GitHub, bước 1
functions/api/callback.js  Đăng nhập GitHub, bước 2 (trả token cho Decap)
```

## A. Chạy thử trên máy (không cần GitHub)

```
npm install
npm run cms      # terminal 1: chạy decap-server, cho Decap ghi thẳng vào file trên máy
npm run dev      # terminal 2
```

Mở http://localhost:3000/admin/index.html, sửa gì đó, Save, rồi xem file trong `content/` thay đổi.

## B. Deploy lên Cloudflare Pages

1. **Đẩy code lên GitHub** (repo private hay public đều được).
2. **Sửa `public/admin/config.yml`**: dòng `repo` và `base_url` (xem bước 4 để biết domain). Commit và push.
3. **Tạo project trên Cloudflare**: Workers & Pages > Create > Pages > Connect to Git > chọn repo.
   - Framework preset: None
   - Build command: `npm run build`
   - Build output directory: `out`
   Bấm Deploy.
4. Ghi lại domain, ví dụ `https://decap-demo.pages.dev`.
5. **Tạo GitHub OAuth App**: GitHub > Settings > Developer settings > OAuth Apps > New OAuth App.
   - Homepage URL: `https://decap-demo.pages.dev`
   - Authorization callback URL: `https://decap-demo.pages.dev/api/callback`
   Tạo xong, copy **Client ID** và bấm **Generate a new client secret**.
6. **Thêm biến môi trường trên Cloudflare**: project > Settings > Variables and Secrets (Production):
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET` (chọn loại Secret)
7. **Deploy lại** (Deployments > Retry deployment) để biến môi trường có hiệu lực.
8. Mở `https://decap-demo.pages.dev/admin/`, bấm **Login with GitHub**.

## Cho khách dùng

Mời tài khoản GitHub của khách vào repo (Settings > Collaborators, quyền Write). Khách đăng nhập `/admin/` bằng tài khoản đó.

## Lỗi hay gặp

| Triệu chứng | Nguyên nhân thường gặp |
| --- | --- |
| Popup đăng nhập báo 404 | Thư mục `functions/` không nằm ở gốc repo, hoặc chưa deploy lại |
| GitHub báo "redirect_uri mismatch" | Callback URL trong OAuth App khác domain thật |
| Popup báo "State không hợp lệ" | Mở popup quá 10 phút, hoặc trình duyệt chặn cookie; thử lại |
| Đăng nhập được nhưng báo không tìm thấy repo | Sai `repo` trong config.yml, hoặc tài khoản chưa có quyền Write |
| Save xong nhưng site chưa đổi | Chờ Cloudflare build xong (1 đến 2 phút), xem tab Deployments |
