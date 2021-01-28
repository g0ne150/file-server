## 编辑锁实现思路

-   当进入编辑页面时，检查当前时间和 latest lock time 差是否大于 60 秒，如果大于，则未锁定，可编辑；
    -   被编辑文件的 latest lock time 设置为当前时间，同时生成一个编辑会话 token 并写入数据库；
    -   用 cookie 返回一个 60 秒过期的，上一步骤生成编辑会话 token 标识当前编辑会话；
-   如果小于 60 秒，则检查请求是否带有 token，且值与之前值一致，则锁定可编辑，否则锁定不可编辑；

## 性能优化思路

-   使用 LRU 算法为文件做缓存，如果文件更新，则清除缓存

---

# 要求和假设

为了保证代码的版本控制，在 git 仓库里开发。

## 服务端

-   虽然鼓励用 Node.js，也可以用任何有用的编程语言、框架和库。保持简单，快速完成。
-   应用不要求生产环境标准，如果合适，在 debug 模式运行也可以。
-   所有用户均匿名访问，没必要做用户认证 (_理解为不要求做用户登录_)
-   可以用任何简单的数据库来存储数据。不用考虑扩容问题。举个例子你可以用 SQLite。
-   没必要写单元测试和文档
-   在 8080 端口启动服务

最少有如下三个 HTML 页面，没必要写 CSS 样式，简单的 HTML 就可以了。

## "New" page 新增页面

-   主页
-   包含如下输入项：
    -   file name 文本输入 (假定文件名唯一)
    -   textarea，输入 file 文本
    -   "Save" 保存按钮
-   一旦表单提交，服务端需要将文本保存为文本文件 (在本地文件系统或者云存储服务)
-   文本文件保存后，数据库插入一条带唯一 ID 的数据，这个数据后面会用到 (下面 "Edit" 页面)

## "View" page 列表页

-   一个唯一的 URL 访问列表页，展示所有已经提交的文本文件
-   点击文件名下载该文件
-   每个文件条目带有一个 "Edit" 按钮

## "Edit" page

-   每个已经提交的文件对应一个此编辑页面的唯一 URL
-   包含一个 textarea 输入框，内容为之前提交的文本文件保存的内容
-   任何访问这个页面的用户，都可以动态下载文件内容到 textarea 框里 (_理解为所有用户访问都能在 textarea 里看到文件内容_)
-   一个 "Save" 按钮用来提交表单
-   一旦表单提交，服务端根据 textarea 里内容更新文本文件

## 编辑锁

-   为了防止多个用户同时编辑同一个文件造成冲突，用户编辑某文件的时候给一分钟的编辑租期，在编辑租期内，别的用户不能编辑这个文本文件。
-   当用户加载编辑页面时，关联此页面和当前编辑的文本文件 60 秒，60 秒内锁定该文件。

提交的应用要求可以跑起来 (本地开发服务或云平台都可以，如 heroku)，还有要提供一个详尽的如何跑起来的描述
