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
- **Request access token**: request lấy access_token với code và client_secret

Những cách implement:
- Browser đóng vai trò là Client App giao tiếp với Authorization Server (bị leak client_secret)
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
- client_id: mã id đăng ký app với OAuth2 từ trước để cung cấp cho Authorization Server
- client_secret: secret được generate ra khi đăng ký app
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

#### Revoke access token


### ⭐ Authorization Code Flow with PKCE "pixy" (Proof key for code exchange)
Lý do ra đời:
- Các client apps muốn sử dụng protocol OAuth nhưng không có BE
- Authorization code có thời gian valid từ 30-60 giây, có thể config lên tới 10 phút (ref: [doc](https://www.oauth.com/oauth2-servers/authorization/the-authorization-response/)).
- client_secret giống nhau và phải lưu trực tiếp lên apps/devices => không bảo mật
- Kẻ tấn công có thể đứng ở giữa để inject mã độc vào callback URL để nhận được Authorization code, và với client_secret bị leak trước đó có thể tạo request lấy access_token bất cứ lúc nào.

Vai trò PKCE:
- Giúp client apps không cần sử dụng client_secret
- Ngăn chặn việc tấn công vector trong Authorization code flow

=> PKCE kế thừa lại Authorization Code Flow nhưng không làm ảnh tới flow chính (authorization & token request)

Đối tượng: Browser/Native App/Public app (vai trò Client App), Authorization, Resource Server

 Các bước trong flow:
- **Generate code_verifier**: tạo chìa khóa và ổ khóa (code_challenge) và lưu trong memory
- **The authorization request**: chuyển hướng tới Authorization Server, đính kèm code_challenge
- **The authorization code exchange**: Chuyển code xác thực về client's callback URL
- **Request access token**: đính kèm code_verifier với request lấy access_token

Những cách implement:
- Public app đóng vai trò là Client App giao tiếp với Authorization Serverpl

![Authorization Code Flow With PKCE (Proof key of key exchange)](https://www.romaglushko.com/blog/whats-oauth2-anyway/oauth2-authorization-code-pkce-flow.png)
#### Implement PKCE
**code_verifier**: chìa khóa
**code_challenge**: ổ khóa
**code_challenge_method**: kiểu ổ khóa

Trước flow authorization code
- Client App tạo mới 1 chuỗi ngẫu nhiên (chìa khóa), sau đó hash mã hóa (SHA256) để tạo ra ổ khóa
- Client App giữ lại chìa khóa
Request authorization thì gửi kèm ổ khóa và kiểu ổ khóa đính vào query param
Lúc này Authorization Server sẽ giữ lại ổ khóa và trả về Authorization Code
Khi Client App request access_token thì bắt buộc phải gửi chìa khóa đi kèm

=> Ngăn chặn việc kẻ tấn công có Authorization code nhưng không có chìa khóa để request access_token, vì hiện tại chìa khóa đang được giữ ở memory của app (không có quyền truy cập)

PKCE hiện đang hỗ trợ 2 kiểu hash:
- S256: thuật toán SHA256 (khuyến nghị)
	- Ex: `code_challenge = base64(SHA256(ASCII(code_verifier)))`
- plain: text cơ bản, tương đương với việc chìa khóa = ổ khóa
### Implicit Flow
Đối tượng: Browser/Mobile App/Public app (vai trò Client App), Authorization, Resource Server

Chỉ cần client ID và redirect URL

Implicit flow được thiết kế để hỗ trợ public clients (SPAs, native app) chạy trên nền tảng web browser

access_token sẽ được trả về client thông qua browser URL (redirect_uri)
> Tuy nhiên cách này đi kèm với việc bảo mật kém => Hiện tại OAuth2.0 không hỗ trợ implement theo hướng này nữa => Thay vào đó là sử dụng Authorization code flow + PKCE

**Tại sao trước đó Implicit flow lại được sử dụng?**
Trước khi tồn tại server-side proxies hoặc PKCE extension, SPAs đối mặt với một vài thử thách:
- Không thể lưu client_secret trên SPAs app vì dễ bị leak
- Không thể gọi request trực tiếp server-to-server tới token endpoint
=> Implicit flow hỗ trợ những app nền tảng là browser có thể lấy access_token một cách trực tiếp

**Lỗ hổng bảo mật nghiêm trọng Implicit flow?**
- Access_token bị leak ở phía Browser history/log vì được truyền thông qua URL, đang được lưu vào:
	- Browser history
	- Web server logs
	- Proxy server logs
	- Referrer header (khi chuyển trang)
- Lack of sender constraint (Confused deputy): không có cách nào chứng app nhận token là app tạo request lấy access_token. Kẻ tấn công có thể intercept vào flow authorizing của người dùng và lấy token có thể bằng cách tấn công XSS (thêm script vào Callback URL)
- Không có refresh_token: không hỗ trợ refresh_token, vì thế access_token có thể có session quá dài hoặc quá ngắn (1-2 tiếng)
- Độ dài URL bị giới hạn, với những token quá dài thì vượt quá giới hạn URL ~2000 characters
 Các bước trong flow:
-  **The authorization request**: chuyển hướng tới Authorization Server với `response_type` là `token` => Authorization Server trả về token ở `redirect_uri`
- **The authorization code**: Chuyển token xác thực về client's callback URL
=> Không còn lại lựa chọn phù hợp cho những app hiện nay

Cách implement với Js application:
- Redirect full-page tới Authorization Server
- Mở 1 popup window và redirect tới Authorization Server, tắt khi nhận redirect_uri được gọi.

![Implicit Flow](https://www.romaglushko.com/blog/whats-oauth2-anyway/oauth2-implicit-flow.png)

```http
HTTP/1.1 302 Found
Location: https://auth.example.com/authorize
	?response_type=token 
	&client_id=Iv23lilfdg920cAzhcxA 
	&redirect_uri=https://www.clientapp.com/callback/ 
	&scope=read_user%20write_repo%20read_repo 
	&state=wSDOBWf0PAC9C7AENIRoCfHnDDSbr
```
URL params:
- response_type: `token`, thông báo tới Authoriaztion Server là nhận token thay vì là code
Lúc này thay vì trả code cho redirect_uri thì Authorization Server sẽ trả về access_token
```http
HTTP/1.1 302 Found
Location: https://www.clientapp.com/callback/
 #access_token=gho_16C7e42F292c6912E7710c838347Ae178B4a
 &state=wSDOBWf0PAC9C7AENIRoCfHnDDSbr
```
URL params:
- access_token: token của người dùng để request lấy data từ Resource Server
- state: nhận lại để validate attack CSRF
### Client Credentials Flow
refer document: https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html#client-authentication
Server tới server
Đối tượng: Backend (vai trò Client App), Authorization, Resource Server

Sử dụng: client_id, client_secret

Flow này không tồn tại Resource Owner và Frontend app, điều duy nhất cần làm là khiến Authorization Server tin tưởng Client app (ở đây là BE), để lấy access_token, không có refresh_token
Flow này không thể tương tác vì được thực hiện ở BE server, nên chỉ cần request lấy token trực tiếp chứ không đi qua các bước lấy code như những flow trước đó.

![Client Credentials flow](https://www.romaglushko.com/blog/whats-oauth2-anyway/oauth2-client-credentials-flow.png)

```http
POST /token HTTP/1.1
Host: auth.example.com
Authorization: Basic {{ base64(client_id:client_secret) }}
Accept: application/json
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&scope=read_user%20write_repo%20read_repo
```
URL params:
- grant_type: `client_credentials` tương đương với việc request theo flow client credential để lấy access_token
- scope?: phạm vi quyền client app cần
Lưu ý: flow này không tồn tại Resource Owner nên Client App thản nhiên không bị giới hạn quyền với resource. Cho nên để hạn chế việc Client App có full quyền thì:
- Tạo phạm vi riêng dành cho flow thay vì full quyền truy cập, để Resource Server có thể phân biệt được user hay app đang sử dụng token.
- ? Tạo JWT access token và account trong quá trình validate access token
### Resource Owner Credentials (ROC) Flow
Đối tượng: Resource Owner, Backend/FrontEnd (vai trò Client App), Authorization, Resource Server

Sử dụng: client_id, client_secret, user credentials

Trái ngược với flow Oauth2 thông thường thì ROC flow vẫn được cho là 1 tiêu chuẩn của Oauth nhưng không được sử dụng rộng rãi và không tốt cho bảo mật. So với User Credentials Sharing thì ROC flow sẽ an toàn hơn với việc giới hạn quyền hạn và hạn chế lộ thông tin đăng nhập của người dùng.

**Tại sao vẫn tồn tại flow này?**
- Có những trường hợp bắt buộc phải sử dụng user credential (username và password)
- Dù rủi ro cao nhưng không có ROC flow thì hệ thống còn kém an toàn hơn => hạn chế lộ user credential qua mạng => chỉ sử dụng user credential 1 lần để lấy token, sau đó là sử dụng token để lấy data
- Có giới hạn scope thay vì cấp toàn bộ quyền khi sử dụng User Credentials Sharing
**Khi nào thì nên sử dụng ROC flow?**
- Client App do user sở hữu (first-party app)
- Client App có quyền hạn cao để thực hiện các tác vụ automate thay mặt user
	- Ex: Microsoft Entra chỉ cho phép sử dụng ROC với tài khoản tổ chức, không cho phép với tài khoản cá nhân (vì có thêm lớp bảo mật khác như MFA - Multi-Factor Authentication)
**#Lưu ý**
- ROC flow đã bị loại bỏ khỏi OAuth2.1 vì bảo mật kém, tương tự với Implicit flow
- Nên thay thế bằng Authorization Code Flow với PKCE để bảo mật tốt hơn
**Các bước trong flow:**
- User cung cấp credentials cho Client App (không được phép lưu lại thông tin này)
- Client App request token lên Authorization Server và nhận về access token và refresh token
- Client App dùng token request lên Resource Server để lấy data

![OAuth2 Resource Owner Credentials Flow](https://www.romaglushko.com/blog/whats-oauth2-anyway/oauth2-resource-owner-credentials-flow.png)

```http
POST {tenant}/oauth2/v2.0/token 
Host: login.microsoftonline.com 
Content-Type: application/x-www-form-urlencoded 
client_id=00001111-aaaa-2222-bbbb-3333cccc4444 &scope=user.read%20openid%20profile%20offline_access &username=MyUsername@myTenant.com 
&password=SuperS3cret 
&grant_type=password
```

URL params:
- grant_type: password, ROC flow yêu cầu người dùng cung cấp username và password
- username, password: credentials của người dùng gửi kèm theo request
### ⭐ Device Code Flow
Phù hợp với Device hoặc Native app không hỗ trợ bật trình duyệt để xác thực => Nhờ 1 browser phía bên ngoài device để thực hiện công việc xác thực
Đối tượng: Resource Owner, Device Client (vai trò Client App), Browser, Authorization, Resource Server

Sử dụng: client_id, client_secret, user credentials

Ban đầu OAuth2 flow chỉ nhắm tới việc phục vụ cho những trường hợp sử dụng browser app. Nhưng khi lớn mạnh thì có những thiết bị cũng muốn sử dụng OAuth mà lại không có sẵn browser để thực hiện xác thực. Đó là lý do ra đời Device Code Flow để hỗ trợ việc xác thực cho device/native app thông qua một browser "mượn" thay mặt device xác thực.

**Các bước trong flow:**
- Device Client request authorization lên Authorization Server và nhận về user_code, device_code và verification_uri
- Device Client hiển thị user_code và verification_uri (URL, QR code hoặc bật provider app)
- Device Client request token poll (interval) với device_code lên Authorization Server để chờ nhận token
- User thực hiện truy cập đường dẫn xác thực trên browser và nhập user_code, sau đó tiến hành đăng nhập vào tài khoản
- Authorization Server nhận thông tin đăng nhập và tạo token cho Device Client
- Device Client nhận được token và request lên Resource Server để lấy data
**#Lưu ý**
- Vòng đời mỗi Authorization thường kéo dài 15 phút
- Nên request token poll mỗi 5 giây để tránh Ddos lên Authorization Server

![OAuth2 Device Code Flow](https://www.romaglushko.com/blog/whats-oauth2-anyway/oauth2-device-code-flow.png)
**Device Authorization Request**
```http
POST /device_authorization HTTP/1.1
Host: auth.example.com
Accept: application/json
Content-Type: application/x-www-form-urlencoded
 
client_id=Iv23lilfdg920cAzhcxA&scope=read_user%20write_repo%20read_repo
```
URL params:
- client_id: mã định danh client app đã đăng ký với Authorization Server
Response
```json
{
  "device_code": "GmRhmhcxhwAzkoEqiMEgDnyEysNkuNhszIySk9eS",
  "user_code": "WDJB-MJHT",
  "verification_uri": "https://auth.example.com/login/device",
  "expires_in": 1800,
  "interval": 5
}
```
Response meaning:
- verification_uri: URL để đăng nhập
- device_code: mã random secret cho device muốn request xác thực, dùng để lấy request token poll
- user_code: mã random user nhập vào verification_uri (ý nghĩa user_code: [doc](https://www.romaglushko.com/blog/whats-aouth2/#device-code))

![OAuth2 Device Verification Screen](https://www.romaglushko.com/blog/whats-oauth2-anyway/oauth2-device-authorization-screen.png)

#### Access Token Polling
Request chờ lấy token từ Device client
Hiện tại không có cách để Authorization Server thông báo cho Device client về việc xác thực đã hoàn thành => Device client phải request polling để hỏi Authorization đã có token chưa

```http
POST /token HTTP/1.1
Host: auth.example.com
Accept: application/json
Content-Type: application/x-www-form-urlencoded
 
grant_type=urn:ietf:params:oauth:grant-type:device_code&device_code=device_code&client_id=client_id
```
URL params:
- grant_type: liên quan tới device_code
- device_code: xác thực device nào đang chờ token
1 vài response có thể nhận:
```json
// pending
{
  "error": "authorization_pending",
  "error_description": "The authorization request is still pending as the end user hasn't yet authorized the device."
}
```

```json
// request to fast
{
  "error": "slow_down",
  "error_description": "The client should wait before polling the token endpoint again."
}
```
### ⭐ Assertion Flow

## Choose the suitable flow

![The way to choose the right flow](https://www.romaglushko.com/blog/whats-oauth2-anyway/oauth2-what-flow-to-choose.png)

Dựa trên những flow chính được đề cập trong OAuth2, hãy ưu tiên chọn theo thứ tự sau:
- Authorization code flow với PKCE, không quan trọng là public hay private (confidential) app
- Trường hợp không hỗ trợ PKCE thì Authorization code flow phù hợp với private client app
- Nếu sử dụng implicit flow cho public client app có áp dụng những kỹ thuật bảo mật
- Cho tác vụ automate thì dùng Client credentials flow
- Với client app không bật được browser thì dùng Device code flow
- Còn lại là Resource owner credentials flow (có lưu ý)
**#Lưu ý**
- Trước khi sử dụng Resource owner credentials flow thì nên kiểm tra coi có thể sử dụng API key để thay thế hay không, cùng đạt được mục đích nhưng tránh việc rò rĩ user credentials
## References document
- [RFC-6749] The OAuth 2.0 Authorization Framework
- [RFC-6750] The OAuth 2.0 Authorization Framework: Bearer Token Usage
- [RFC-7523] JSON Web Token (JWT) Profile for OAuth 2.0 Client Authentication and Authorization Grants
- [RFC-7662] OAuth 2.0 Token Introspection
- [RFC-7663] Proof Key for Code Exchange by OAuth Public Clients
- [RFC-8252] OAuth 2.0 for Native Apps
- [RFC-8628] OAuth 2.0 Device Authorization Grant
- [GitHub] OAuth Authorization
- [GitLab] OAuth 2.0 identity provider API
- [Bitbucket] OAuth 2.0 Enterprise Provider API
- [OAuth.net] OAuth 2.1 Draft
- [Manning] OAuth 2.0 in Action
- [Microsoft] Identity platform and OAuth 2.0 implicit grant flow
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
