# HTML

## base标签

`<base>`标签为文档根URL元素，用来指定一个文档中包含的所有相对URL的根URL，一个文档中只能有一个base元素，如果有多个，只会使用第一个。
一个文档中的基本URL，可以通过使用`document.baseURI`来查询。如果文档中不包含`<base>`元素，baseURI默认为`document.location.href`

#### 属性：

* `href`：用于文档中的相对URL地址的基础URL。允许对象和相对URL
* `target`
  - `_self`: 载入结果到唐倩浏览上下文中。（默认值）。
  - `_blank`: 载入结果到一个新的未命名的浏览上下文。
  - `_parent`: 载入结果到父级浏览上下文（如果当前页是内联框）。如果没有父级结果，该选项的行为和`_self`一样。
  - `_top`: 载入结果到顶级浏览上下文（该浏览上下文是当前上下文的最顶级上下文）。如果没有父级，该选项的行为和`_self`一样。

#### 页内锚

指向文档中某个片段的链接，例如`<a href="#some-id">`用`<base>`解析，触发对滴啊有附加片段的基本URL的HTTP请求。
例如：
```html
<base href="https://example.com">
<a href="#anchor">Anker</a>
<!-- a标签链接指向https://example.com/#anchor -->
```

#### Open Graph

Open Graph标签不接受`<base>`，并且应该始终具有完整的绝对URL。例如：
```html
<meta property="og:image" content="https://example.com/thumbnail.jpg" >
```