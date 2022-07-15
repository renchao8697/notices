# CSS

## background-image

当background-image路径存在空格，背景图无法展示

解决方法：
```js
url.replace(/\s/g, encodeURIComponent(' '))
```