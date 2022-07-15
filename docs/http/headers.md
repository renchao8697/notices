# HTTP Headers

**HTTP消息头**允许客户端和服务端通过request和response传递附加信息。一个请求头由名称（不区分大小写）后跟一个冒号（`:`），冒号后跟具体的值（不带换行符）组成。该值前面的引导空白会被忽略。

根据不同上下文，可将消息头分为：
- [General headers](#general-headers)：同时使用与请求和响应消息，但与最终消息主体中传输的数据无关的消息头。
- [Request headers](#request-headers)：包含更多有关要获取的资源或客户端本身信息的消息头。
- [Response headers](#response-headers)：包含有关响应的补充信息，如其位置或服务器本身（名称和版本）的消息头。
- [Entiry headers](#entiry-headers)：包含有关实体的更多信息，比如主体长度（Content-Length）或其MIME类型。

## General Headers

**通用头**指的是可以应用于请求和响应中，但是不能应用于消息内容自身的HTTP Headers。取决于应用的上下文环境通用头部可以是[响应头](#response-headers)或者[请求头](#general-headers)，但是不可以是[实体头](#entiry-headers)。

常见的有：`Date`、[Cache-Control](#cache-control)和`Connection`。

## Request Headers

**请求头**可在HTTP请求中使用，并且和请求主体无关。某些请求头如`Accept`、`Accept-*`、`If-*`允许执行条件请求。某些请求头如：`Cookie`、`User-Agent`和`Referer`描述了请求本身以确保服务端返回正确的响应。

并非所有出现在请求中的HTTP头都属于请求头，例如在POST请求中经常出现的`Content-Length`实际上是一个代表请求主体大小的[entity header](#entiry-headers)，虽然你也可以把它叫做请求头。

此外，`CORS`定义了一个叫做`simple headers`的集合，它是请求头集合的一个子集。如果某次请求是只包含`simple header`的话，则被认为是简单请求不会触发请求预检（`prefight`）。

### Cache-Control

Cache-Controlt通用头字段，通过指定指令来实现缓存机制。缓存指令是单向的，这意味着在请求中设置的指令，不一定被包含在响应中。

#### 缓存请求指令

客户端可以在HTTP请求中使用的标准Cache-Control指令。
```
Cache-Control: max-age=<seconds>
Cache-Control: max-stale[=<seconds>]
Cache-Control: min-fresh=<seconds>
Cache-Control: no-cache
Cache-Control: no-store
Cache-Control: no-transform
Cache-Control: only-if-cached
```

#### 缓存响应指令

服务器可以在响应中使用的标准Cache-Control指令。
```
Cache-control: must-revalidate
Cache-control: no-cache
Cache-control: no-store
Cache-control: no-transform
Cache-control: public
Cache-control: private
Cache-control: proxy-revalidate
Cache-Control: max-age=<seconds>
Cache-control: s-maxage=<seconds>
```

#### 扩展`Cache-Control`指令

扩展缓存指令不是核心HTTP缓存标准文档的一部分，兼容性不好
```
Cache-control: immutable
Cache-control: stale-while-revalidate=<seconds>
Cache-control: stale-if-error=<seconds>
```

#### 可缓存性

##### public

表明响应可以被任何对象（包括：发送请求的客户端，代理服务器等等）缓存，即使是通常不可缓存的内容。（例如：1. 该响应没有max-age指令或Expires消息头；2. 该响应对应的请求方法是POST。）

##### private

表明响应只能被单个用户缓存，不能作为共享缓存（即代理服务器不能缓存它）。私有缓存可以缓存响应内容，比如：对应用户的本地浏览器。

##### no-cache

在发布缓存副本之前，强制要求缓存吧请求提交给原始服务器进行验证（协商缓存验证）。

##### no-store

缓存不应存储有关客户端请求或服务器响应的任何内容，即不使用任何缓存。

#### 到期

##### max-age=\<seconds\>

设置缓存存储的最大周期，超过这个时间缓存被认为过期（单位秒）。与`Expires`相反，时间是相对于请求的时间。

##### s-maxage=\<seconds\>

覆盖`max-age`或者`Exprires`头，但是仅适用于共享缓存（比如各个代理），以后缓存会忽略它。

##### max-stale\[=\<seconds\>\]

表明客户端愿意接收一个已经过期的资源。可以设置一个可选的秒数，表示在给定的时间内，可以继续使用过期资源。

##### min-fresh=\<seconds\>

表示客户端希望获取一个能在指定的秒数内保持其最新状态的响应。

##### stale-while-revalidate=\<seconds\><Badge type="warning" text="实验" />

表明客户端愿意接收陈旧的响应，同时在后台异步检查新的响应。秒值指示客户愿意接受陈旧响应的时间长度

##### stale-if-error=\<seconds\><Badge type="warning" text="实验" />

表示如果新的检查失败，则客户愿意接受陈旧的响应。秒数值表示客户在初始到期后愿意接受陈旧响应的时间

#### 重新验证和重新加载

##### must-revalidate

一旦资源过期（比如已经超过`max-age`），在成功向原始服务器验证之前，缓存不能用该资源响应后续请求。

##### proxy-revalidate

与`must-revalidate`作用相同，但它仅适用于共享缓存（例如代理），并被私有缓存忽略。

##### immutable<Badge type="warning" text="实验" />

表示响应正文不会随时间而改变。资源（如果未过期）在服务器上不发生改变，因此客户端不应发送重新验证请求头（例如If-None-Match或If-Modified-Since）来检查更新，即使用户显示地刷新页面。

#### 其他

##### no-transform

不得对资源进行转换或转变。`Content-Encoding`、`Content-Range`、`Content-Type`等HTTP头不能由代理修改。

##### only-if-cached

表明客户端只接受已缓存的响应，并且不要想原始服务器检查是否有更新的拷贝。



## Response Headers

**响应头**可以定义为：被用于HTTP响应中并且和响应消息主体无关的一类HTTP Header。想`Age`，`Location`和`Server`都属于响应头，他们被用于描述响应。

并非所有出现在响应中的HTTP Header都属于响应头，例如`Content-Length`就是一个代表响应体消息大小的[entity header](#entiry-headers)，虽然你也可以把它叫做响应头。

## Entiry Headers

**实体报头**是描述了一个HTTP消息有效载荷（即关于消息主体的元数据）的HTTP报头。包括Content-Length、Content-Language、Content-Encoding、Content-Type和Expires等。实体报头可能同时存在于HTTP请求和响应信息中。

















## 待添加内容
 - [ ] simple headers
 - [ ] CORS
 - [ ] preflight
