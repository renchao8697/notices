## background-image中路径存在空格，无法展示
```js
url.replace(/\s/g, encodeURIComponent(' '))
```