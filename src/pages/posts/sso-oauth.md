---
title: 'Whats OAuth2 Anyway?'
pubDate: 2025-08-21
description: 'Example folder structure'
author: 'Krix Daniel'
image:
  url: 'https://docs.astro.build/assets/rose.webp'
  alt: 'The Astro logo on a dark background with a pink glow.'
tags: ['authenticate', 'authorization', 'oauth', 'sso']
layout: '@/layouts/MarkDownPostLayout.astro'
---
Reference document: https://www.romaglushko.com/blog/whats-aouth2/

SSO: Phương pháp xác thực (Authentication method)

OAuth: giao thức tiêu chuẩn cấp quyền ứng dụng/dịch vụ đăng nhập vào một ứng dụng/dịch vụ khác


## Background OAuth
### User Credentials Sharing
Người dùng chia sẽ thông tin đăng nhập (tên, mật khẩu) cho client

Client giữ thông tin đó là request lên Resource Server để lấy dữ liệu về cho người dùng

Nhược điểm:
- No access control: Client App có toàn quyền truy cập như người dùng, không có giới hạn, trong khi người dùng chỉ muốn lấy 1 vài thông tin cố định
- Hard to Revoke, Security risks: Một khi đã chia sẽ thông tin đăng nhập thì có thể bị cache và leak, chỉ có thay đổi mật khẩu mới tránh được điều này
- Brittle: Đổi mật khẩu thì app không chạy được nữa

Flow: 
- Người dùng cung cấp thông tin đăng nhập cho Client App
- Client App lưu lại thông tin người dùng
- Client App dùng thông tin đó request data từ Resource Server

![User Credentials Sharing](https://www.romaglushko.com/blog/whats-oauth2-anyway/plain-owner-credentials-sharing.png)
### Personal Access Token (PATs)
Người dùng tự tạo PATs (với phạm vi truy cập) và cung cấp cho Client App để request lấy dữ liệu/thực hiện tác vụ tự động

Ưu điểm:
- Có UI tạo token để gắn vào Client App
- Resource server client có thể thực hiện các task vụ tự động vì đã có sẵn thông tin người dùng

Nhược điểm:
- Phải tự tracking thời gian hết hạn để tạo PAT mới và thêm vào nhiều Client App
- Còn nếu để token không hết hạn thì khi bị leak hacker có rất nhiều thời gian để khai thác dữ liệu

Flow:
- Người dùng tạo access token trên hệ thống của Resource Server, custom phạm vi truy cập thông tin
- Người dùng cung cấp access token cho các app để request data từ Resource Server theo phạm vi quyền của token

![Personal Access Token (PATs)](https://www.romaglushko.com/blog/whats-oauth2-anyway/personal-access-token-sharing.png)
## OAuth
Được thiết kế để Client App yêu cầu quyền truy cập phạm vi của người dùng trong các ứng dụng/dịch vụ (bên thứ 3). Giải quyết việc Client App giữ thông tin đăng nhập của người dùng.

Client App sẽ nhận được ủy quyền của người dùng để truy cập 1 phần thông tin được cung cấp từ ứng dụng/dịch vụ

Ưu điểm:
- Chỉ những Client App đăng ký OAuth với bên thứ 3 thì mới có thể sử dụng
- Người dùng quyết định Client App nào sẽ được truy cập và sử dụng thông tin người dùng
- Client App có thể thực hiện các tác vụ tự động với thông tin đã được người dùng ủy quyền
- Build hệ sinh thái xung quanh bên thứ 3

Nhược điểm:
- Authorization Server và Client App production phải dùng HTTPS (local vẫn chạy bình thường), TLS-encrypted
- Authorization Server không được thiết lập CORS lên những Client App

**Roles**:
- Resource Server: Dịch vụ mà Client App muốn lấy thông tin của người dùng
- Resource Owner (người dùng): Thực thể đang nắm giữ quyền hạn cấp phép Resource Server cho Client App
- Authorization Server: Dịch vụ đảm nhận việc lấy token cho Client App và hiển thị form cho người dùng cấp quyền, trung gian giữa Resource Owner và Client App, được tin tưởng bởi Resource Server
- Client App (OAuth Application): Ứng dụng muốn truy cập dữ liệu Resource Server thay mặt cho người dùng

Flow:


![OAuth flow](https://www.romaglushko.com/blog/whats-oauth2-anyway/oauth2-roles.png)
## Client Registration (đăng ký app với OAuth2)
Sử dụng workflow OAuth2 bằng cách đăng ký với Authorization Server
Thông tin cần cung cấp:
- **Redirect URL**: Đường dẫn nhận về authorization code
- **Scopes**: danh sách những quyền hạn muốn cấp cho client app (lúc client app request lấy token có thể chọn một hoặc nhiều quyền ở đây)'
- Các thông tin khác: Tên app, icon, privacy & term.
- Homepage?: đường dẫn trang web (==không ảnh hưởng tới OAuth flow==)

=> Nhận thông tin xác thực cho Client App
- Client ID: app ID
- Client Secret: secret để xác thực với Authorizartion Server
Tác dụng:
- Xác thực với Authorization Server
- Chỉ những app đăng ký mới có thể xác thực
- + 1 lớp bảo mật flow xác thực và flow refresh token

![OAuth2 client registration](https://www.romaglushko.com/blog/whats-oauth2-anyway/gitlab-oauth-app-registration-form.png)
## OAuth2 concept
### Trust on First use (TOFU)
Authorization Server tự động ghi nhớ việc cấp phép permission cho Client App, nên có thể sẽ bỏ qua việc hỏi người dùng chấp thuận lại. Đang được dùng mặc định cho OAuth2.

=> Authorization Server cấp quyền cho Client App mà không cần hiển thị giao diện chấp thuận

=> Github và Bitbucket đang sử dụng phương thức này, còn Gitlab thì vẫn luôn hỏi lại permission

Tùy vào cách implement Authorization flow mà có thể hiển thị form xác nhận những permisison cần cấp quyền.

Resource Server sẽ validate access token bằng cách request tới Authorization Server
### Clients
Hiện có 2 dạng Client App:
- Public app: in-browser app (chạy trên trình duyệt người dùng và không có backend), desktop và mobile app
- Private app: web app có frontend và backend, backend sẽ giữ thông tin bảo mật và tương tác với Authorization Server
=> OAuth2 làm đơn giản hóa việc xác thực cho Client App thông qua Authorization và Resource Server. Giảm thao tác thực hiện cho trên Client App và tránh nguy cơ bảo mật cho máy khách
### Authorization Server (AuthZ)
Nhiệm vụ: https://www.romaglushko.com/blog/whats-aouth2/#authz-servers

Endpoint Discovery: https://www.romaglushko.com/blog/whats-aouth2/#endpoint-discovery

Security: https://www.romaglushko.com/blog/whats-aouth2/#endpoint-discovery
- Authorization Server có thể là 1 phần riêng biệt không thuộc Resource Server
- OAuth2 hỗ trợ AuthZ xác thực với nhiều Resource Server
- AuthZ server khó để implement
### Access Token
Access Token có thể được tạo ra bởi nhiều luồng xác thực với flow OAuth thông qua AuthZ:
- Authorization code
- Implicit
- Client credentials
- Resource owner credentials

![OAuth2 implement flows](https://www.romaglushko.com/blog/whats-oauth2-anyway/oauth2-access-tokens.png)
### Access token scopes
Access token được tạo ra theo request scope dựa vào danh sách scopes được đăng ký OAuth trước đó. Trường hợp không cung cấp request scope sẽ nhận full scopes đã được đăng ký.
### Token types
Phổ biến nhất: Beaver token (`Authorization: Bearer {{ACCESS_TOKEN}}`) set cho header request. Có thể encode bằng JWT nếu đăng ký thêm thông tin meta và đảm bảo TLS encryption.

Các token type khác:
- Token prefixes: thêm prefix để xác định key cần lấy
	- gho_: access token Github OAuth App
	- gha_: access token Github App
	- ghr_: refresh token
	> Giúp client app bỏ qua những token types khác, tránh random string
- Mac tokens (Message Authentication Code): không hỗ trợ SSL => bị thay thế bởi Beaver token
### Token lifetime
Reference document: https://www.romaglushko.com/blog/whats-aouth2/#token-lifetime
### Scopes
Reference document: https://www.romaglushko.com/blog/whats-aouth2/#token-lifetime
## Flow can implement with OAuth2
Phân loại theo số lượng đối tượng có trong OAuth2 flow:

- ==OAuth 2-legs==: chỉ có Client App và Authorization Server
- ==OAuth 3-legs==: bao gồm Client App, Authorization Server và Resource Owner
- OAuth 0-leg: chỉ tồn tại ở OAuth1.0a, không tồn tại trong OAuth2

Các yếu tố phân loại khác:
- Người dùng có cần giao diện để tương tác không?
- Mức độ bảo mật cho người dùng, công khai hay cần thông tin xác thực?

![Find the way to implement OAuth2](https://www.romaglushko.com/blog/whats-oauth2-anyway/oauth2-what-flow-to-choose.png)
=> Khuyến nghị:
- Authorization Code Flow
- Authorization Code Flow with PKCE
- Device Authorization Flow
- Assertion Flow
- Client Credentials
- API Key
### ⭐ Authorization Code Flow
Đối tượng: Browser, Client App (có thể là BE), Authorization, Resource Server

 Các bước trong flow:
- **The authorization request**: chuyển hướng tới Authorization Server
- **The authorization code exchange**: Chuyển code xác thực về client's callback URL

Những cách implement:
- Browser đóng vai trò là Client App giao tiếp với Authorization Server
- BE server đóng vai trò Client App giao tiếp với Authoriation Server

![Authorization Code Flow](https://www.romaglushko.com/blog/whats-oauth2-anyway/oauth2-authorization-code-flow.png)
#### Authorization Request
Đây là bước đầu tiên trong OAuth2 flow, Client App request quyền vào những scopes của Resource Owner bằng cách chuyển hướng tới Authorization Server `authorize` endpoint.

```http
HTTP/1.1 302 Found
 Location: https://auth.example.com/authorize
 ?response_type=code 
 &client_id=Iv23lilfdg920cAzhcxA 
 &redirect_uri=https://www.clientapp.com/callback?isGithub=true
 &scope=read_user%20write_repo%20read_repo
 &state=YOUR_STATE
```

```http
https://www.clientapp.com/callback?code=1234567890&state=YOUR_STATE
```

URL parameters:
- response_type: định nghĩa tên field nhận về token, thường là `code`, `token` với implicit flow
- client_id: mã id đăng ký app với OAuth2 từ trước để cung cấp cho Authorization Server
- redirect_uri: đường dẫn callback nhận authorization code, bắt buộc phải giống với đường dẫn đã đăng ký từ trước.
	> Note: có thể thêm những params custom
	> `https://www.clientapp.com/callback?isGithub=true`
- scope: danh sách quyền Client App muốn sử dụng
- state (optional): param để tránh CSRF (Cross-Site Request Forgery) attack, gửi lên server Authorization và để verify lại khi nhận token

![Grant permission in OAuth2 flow](https://www.romaglushko.com/blog/whats-oauth2-anyway/oauth2-authorization-consent-screen.png)
#### Code Exchange
Sau khi người dùng đồng ý ủy quyền cho Client App thì sẽ nhận được `token` từ Authorization Server thông qua URL callback.
```http
HTTP/1.1 302 Found
 Location: https://www.clientapp.com/callback
 ?code=1234567890
 &isGithub=true
 &state=YOUR_STATE
```
URL parameters:
- code: authorization code (code ủy quyền)
- state: verify lại với Client App để đảm bảo nhận từ đúng nguồn (tránh CSRF attack)
- isGithub?: param được custom và pass qua OAuth flow
=> Authorization code chỉ được sử dụng 1 lần đại diện cho người dùng, sau đó sẽ bị terminate nên các Client App khác sẽ không được sử dụng lại.
#### Request access token
Sử dụng authorization code để request

```http
POST /token HTTP/1.1
Host: auth.example.com
Authorization: Basic {{ base64(client_id:client_secret) }}
Accept: application/json
Content-Type: application/x-www-form-urlencoded 
grant_type=authorization_code
&code=SplxlOBeZQQYbYS6WxSbIA
&redirect_uri=https://www.clientapp.com/callback/
```
URL params:
- grant_type?: khai báo quyền muốn lấy `authorization_code`, tùy vào service mà có cần field này hay không
- redirect_uri: callback URL đã đăng ký, để hệ thống OAuth2 tránh tình trạng authorization code injection.

Response (tùy vào service mà sẽ có format khác nhau):
```json
{ 
	"token_type":"bearer", 
	"access_token": "gho_16C7e42F292c6912E7710c838347Ae178B4a",
	"scope":"read_user write_repo read_repo", 
	"expires_in": 3600, 
	"refresh_token": "ghr_16C7e42F292c6912E7710c838347Ae178"
}
```
#### Use access token to access the API
Sử dụng `token_type` và `acccess_token` đã nhận từ trước để request lấy resource

```http
GET /user HTTP/1.1
Host: https://api.github.com
Authorization: {{ token_type }} {{ access_token }}
Accept: application/json
```
#### Renew access token with refresh token
Vai trò của `refresh_token`:
- Giữ cho `access_token` có thời gian hiệu lực ngắn, tránh bị khai thác khi leaked
- Dùng để tạo `access_token` mới nhưng không cần yêu cầu lại scopes như lần request đầu tiên của Client App trong quá trình authorization. Đảm bảo user không bị khai thác quyền.

```http
POST /token HTTP/1.1
Host: auth.example.com
Authorization: Basic {{ base64(client_id:client_secret) }}
 
grant_type=refresh_token&refresh_token=ghr_16C7e42F292c6912E7710c838347Ae178
```

URL params:
- grant_type: thường là `refresh_token`
- refresh_token: token nhận từ lần authorization trước
> Note: Response tương tự với authoriaztion code.
> Đôi khi hệ thống sẽ refresh `refesh_token` trước đó vì `refresh_token` cũng có thời gian hết hạn, khi đó những `refresh_token` trước không thể sử dụng.

![OAuth2 refresh token flow](https://www.romaglushko.com/blog/whats-oauth2-anyway/oauth2-refresh-token-flow.png)
### ⭐ Authorization Code Flow with PKCE (Proof key for code exchange)


### Implicit Flow


### Client Credentials Flow


### Resource Owner Credentials Flow


### ⭐ Device Code Flow


### ⭐ Assertion Flow


## FAQ
### Gitlab Applications settings: What is Your applications & Authorized applications?
Your applications:
- Contains OAuth applications that registered
- Define: 
	- Name of app
	- Redirect URI (Callback URL where Gitlab will send OAuth response)
	- Scopes: what your app can access
Authorized applications:
- Apps that granted access to Gitlab account
- Log into CI/CD service using Gitlab will appear here, invoke anytime
### Do Homepage URL & Callback URL have the same domain?
Homepage URL: URL of the client app - ==not affect to OAuth flow==

Callback URL (Redirect URI): When Gitlab refirect after user approves/denied access

> No need to be the same domain, Gitlab only validates the callback against the whitelist
### Is OAuth need HTTPS?
In production Gitlab required HTTPS (for security)

In local development, Gitlab allow to use `http://localhost:<port>`