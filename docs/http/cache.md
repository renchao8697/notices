---
tags: [Expires, Cache-Control, Pragma, ETag, If-None-Match ,Last-Modified, If-Modified-Since]
---

# HTTP 缓存
网页中的资源都需要从服务器下载，如果资源较大或者路程较远，那下载过程会比较耗时，网页会长时间处于loading状态。所以，HTTP设计了缓存功能，把已下载的资源保存到本地，如再次打开该网页，会直接读取缓存，减少等待时间，提升用户体验，并可以减轻服务器压力。

## 强缓存和协商缓存
HTTP缓存分为两种，`强缓存`和`协商缓存`。浏览器发出请求时，会先验证`强缓存`是否命中，如果命中就直接使用缓存资源，不需要把请求发送到服务器；如果未命中，会发送请求到服务器，服务器会通过请求头字段验证资源是否有效，如果有效，`协商缓存`命中，服务器返回304，浏览器使用缓存资源，如果资源无效，则会返回服务器的资源。

### 强缓存
在Chrome中，强缓存又分为`Disk Cache`（存放在磁盘中）和`Memory Cache`（存放在内存中），存放位置是由浏览器控制的（网上说`Memory Cache`页面关闭后缓存会消失，但测试发现不会消失，关闭浏览器后依然存在）。
强缓存由Header中的三个属性共同控制：`Expires`、[Cache-Control](./headers.md#cache-control)和`Pragma`。

- **Expires**

  `Expires`**HTTP/1.0**定义,表示资源的过期时间，它指定了一个时间，在这个时间之前，HTTP缓存被认为是有效的。如同时设置了[Cache-Control](./headers.md#cache-control)响应头字段的`max-age`，`Expires`会被忽略。`Expires`有一个弊端，它是客户端时间与响应头字段的时间做比较的，如果客户端和服务器的时间不同，会导致缓存命中存在误差。

- **Cache-Control**
  
  [Cache-Control](./headers.md#cache-control)**HTTP/1.1**定义，值较多，并可以设置多个。下面列举一些常用的：
    - `max-age`：单位为s，设置缓存有效的时间，相对于发送请求的时间，超过设置的秒数，缓存失效
    - `no-cache`：不使用强缓存，强制服务器验证
    - `no-store`：禁止使用缓存，每次都向服务器请求资源
    - `public`：响应可以被中间代理、CDN等缓存
    - `private`：专用于个人的缓存，中间代理、CDN等不能缓存响应

- **Pragma**

  `Pragma`是**HTTP/1.0**标准中定义的通用头字段，请求中包含`Pragma`的效果跟在头信息中定义`Cache-Control:no-cache`相同，但是HTTP的响应头没有明确定义这个属性，所以它不能完全代替HTTP/1.1中定义的Cache-Control头，通常定义Pragma以向后兼容基于HTTP/1.0的客户端。

三者的优先级为 `Pragma` -> [Cache-Control](./headers.md#cache-control) -> `Expires`

### 协商缓存
当浏览器的强缓存失效或设置不走强缓存时，会由服务器来验证，是否使用缓存，这就是协商缓存。协商缓存与两对字段有关，分别为Etag/If-None-Match和Last-Modified/If-Modified-Since。

- **ETag/If-None-Match**
  
  `ETag/If-None-Match`**HTTP/1.1**定义，它们的值是一串hash码，代表的是一个资源的标识符，第一次请求时，服务器将值放入`ETag`响应头中，第二次请求时会将`ETag`的值赋到请求头中`If-None-Match`上，当服务器的文件变化的时候，它的hash码会随之改变，通过请求头中的`If-None-Match`和当前文件的hash值进行比较，如果相等则命中协商缓存。

  `ETag`又有强弱校验之分，如果hash码是以“W/”开头的一串字符串，说明此时协商缓存的校验是弱校验，只有服务器上的文件差异（根据`ETag`计算方式来决定）达到能够触发hash值后缀变化的时候，才会真正的请求资源，否则返回304使用缓存。

- **Last-Modified/If-Modified-Since**
  
  `Last-Modified/If-Modified-Since`**HTTP/1.0**定义，它们的值代表着文件的最后修改时间，第一次请求服务器会把资源最后的修改时间放到`Last-Modified`响应头中，第二次发起请求的时候，请求头会带上上一次响应头中的`Last-Modified`的时间，并放到`If-Modified-Since`请求头属性中，服务器根据文件最后修改时间和`If-Modified-Since`的值比较，如果相等，返回304使用缓存。

`ETag/If-None-Match`的出现主要解决了`Last-Modified/If-Modified-Since`中的两个问题：
1.  如果文件的修改频率在秒级以下，`Last-Modified/If-Modified-Since`会错误的返回304
2.  如果文件被修改了，但是内容没有任何变化的时候，`Last-Modified/If-Modified-Since`会认为缓存失效


## HTTP缓存的流程图
![HTTP Cache](/images/http/http-cache.svg)