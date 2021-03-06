# Webpack

## webpack与gulp的区别

* gulp是一个基于流（stream）自动化构建工具，可以配合各种插件对js、css、img的压缩合并，做到减少文件体积，加快请求速度和请求次数。它会自动执行指定的任务，就像 *流水线* ，通过不同的插件对资源进行加工。
* webpack是一个用于现代JavaScript应用程序的 *静态模块打包工具* 。当webpack处理应用程序时，它会在内部从一个或多个入口递归的构建一个 **依赖图** ，然后将你项目中所需的每一个模块组合成一个或多个bundles，他们均为静态资源，用于展示你的内容。如果说gulp是一个 *流水线* 的话，webpack就像一个 *工厂* ，它们的侧重点不一样，工厂里自然会包含 *流水线* ，gulp只是webpack功能的一部分。
  - 静态模块：静态模块指的是开发阶段，可以被webpack直接引用的资源（可以直接被获取打包进bundle.js的资源）
  - 依赖图：当webpack处理应用程序时，它会在内部构件一个依赖图，此依赖图对应映射到项目所需的每个模块（不局限js文件），并生成一个或多个bundle

* gulp实例
```js
const gulp = require('gulp');
// 获取插件
const babel = require('gulp-babel');
// 定义任务
gulp.task('babel', () => {
  return gulp.src('./src/js') // 创建一个流
    .pipe(babel({presets: ['@babel/env']})) 
    .pipe(gulp.dest('./dist/js'))  // dest写入
})

// 定义任务列表
const tasks = ['babel'];

// 使用series按顺序执行任务
gulp.task('default', gulp.series(...tasks, (done) => {
  done();
}))

```

## webpack相关概念
* entry：入口起点，用来告诉webpack用哪个文件作为构建依赖图的起点。webpack会根据entry递归的去寻找依赖，每个依赖都将被它处理，最后输出到打包成果中。
* output：output属性告诉webpack在哪里输出它所创建的bundle，以及如何命名这些文件。
* mode：4.0开始，webpack支持零配置，旨在为开发人员减少上手难度，同时加入了mode的概念，用于指定打包的目标环境，以便在打包的过程中启用webpack针对不同的环境下内置的优化。
* loader：默认情况下webpack只能处理JavaScript和JSON文件。loader让webpack能够去处理其他类型的文件，并将它们转换为有效模块，以供应用程序使用。
* plugin：loader用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。包括：打包优化，资源管理，注入环境变量。
* chunk：指代码块，一个chunk可能由多个模块组合而成，也用于代码合并与分割。
* bundle：资源经过webpack流程解析编译后最终输出的成果文件。
* module：是开发中的单个模块，在webpack的世界里，一切皆模块，一个模块对应一个文件，webpack会从配置的entry中递归开始找出所有依赖的模块，生成依赖图。

## loader和plugin的区别？
* 作用：
  - `loader`直译为“加载器”。webpack将一切文件视为模块，但是webpack原生值能解析js和json文件，如果想将其他文件也打包的话，就会用到`loader`。所以`loader`的作用是让webpack拥有了加载和解析其他文件的能力。
  - `plugin`直译为“插件”。`plugin`可以扩展webpack的功能，让webpack具有更多的灵活性。在webpack运行的生命周期中会广播出许多事件，`plugin`可以监听这些事件，在合适的时机通过webpack提供的API改变输出结果。
* 用法：
  - loader在`module.rules`中配置，也就是说他作为模块的解析规则而存在。类型为数组，每一项都是一个`Object`，里面描述了队医什么类型的文件（`test`），使用什么加载（`loader`）和使用的参数（`options`）
  - plugin在`plugins`中单独配置。类型为数组，每一项是一个`plugin`的实例，参数都通过构造函数传入。


## 自定义loader
```js
module.exports = function(source) {
  // 获取配置文件传递的参数
  // this.getOptions是5.x的方法
  // 4.x使用this.query或通过loader-utils提供方法获取
  const options = this.getOptions();
  return source;
}
```
* loader就是一个函数，声明式函数，不能用箭头函数（因为函数中的`this`作为上下文会被webpack填充，并且`loader runner`中包含一些使用的方法）
* `this.callback`，可使用`this.callback`方法来返回多个信息
```js
module.exports = function(source) {
  this.callback(null, source);
}
// this.callback函数参数
this.callback(
  err: Error | null,
  content: string | Buffer,
  sourceMap?: SourceMap,
  mata?: any
)
```
* `this.async`，如果loader中有异步操作，可使用`this.async`
```js
module.exports = function(source) {
  const callback = this.async();
  setTimeout(() => {
    // 参数与this.callback相同
    callback(null, source);
  }, 1000)
}
```
* 多个loader会按数组自后向前执行
* loader路径，自定义loader可以通过两种方式添加至rules
  - 使用path获取绝对路径添加`use: [path.resolve(__dirname, "./loaders/loader1.js")]`
  - 使用resolveLoader添加`resolveLoader: {modules: ["node_modules", "./loader"]}`

## 编写loader应遵循的准则
  * 保持 **简单**
  * 使用 **链式**传递
  * **模块化** 的输出
  * 确保 **无状态**
  * 使用 **loader utilities**
  * 记录 **loader的依赖**
  * 解析 **模块依赖关系**
  * 提取 **通用代码**
  * 避免 **绝对路径**
  * 使用 **peer dependencies**

  #### 简单（simple）
  loaders应该只做单一任务。这不仅使每个loader易维护，也可以在更多场景链式调用
  #### 链式（chaining）
  利用loader可以链式调用的优势。写五个简单的loader实现五项任务，而不是一个loader实现五项任务。功能隔离不仅使用loader更简单，可能还可以将它们用于你原先没有想到的功能。
  #### 模块化（modular）
  保证输出模块化。loader生成的模块与普通模块遵循相同的设计原则。
  #### 无状态（stateless）
  确保loader在不同模块之间转化不保存状态。每次运行都应独立与其他编译模块以及相同模块之前的编译结果。
  #### loader工具库（Loader Utilities）
  冲分利用`loader-utils`包。它提供了许多有用的工具，最常用的一种工具是获取传递给loader的选项。
  #### loader依赖（loader dependencies）
  如果以loader使用外部资源，**必须声明它**。这些信息用于使缓存loaders无效，以及在观察模式（watch mode）下重编译。下面是一个简单示例，说明如何使用`addDependency`方法实现上述声明：
  ```js
  import path from 'path';

  export default function (source) {
    var callback = this.async();
    var headerPath = path.resolve('header.js');

    this.addDependency(headerPath);

    fs.readFile(headerPath, 'utf-8', function (err, header) {
      if (err) return callback(err);
      callback(null, header + '\n' + source);
    });
  }
  ```
  #### 模块依赖（module dependencies）
  根绝模块类型，可能会有不同的模式指定依赖关系。例如在CSS中，使用`@import`和`url(...)`语句来声明依赖。这些依赖应该由模块系统解析。
  可以通过以下两种方式中的一种来实现：
    * 通过把它们转换成`require`语句
    * 使用`this.resolve`函数解析路径
  #### 通用代码（common code）
  避免在loader处理的每个模块中生成通用代码。相反，应该在loader中创建一个运行时文件，并生成`require`语句以引用该共享模块：
  src/loader-runtime.js
  ```js
  const { someOtherModule } = require('./some-other-module');

  module.exports = function runtime(params) {
    const x = params.y * 2;

    return someOtherModule(params, x);
  };
  ```
  src/loader.js
  ```js
  import runtime from './loader-runtime.js';

  export default function loader(source) {
    // 自定义的 loader 逻辑

    return `${runtime({
      source,
      y: Math.random(),
    })}`;
  }
  ```
  #### 绝对路径（absolute paths）
  不要在模块代码中插入绝对路径，因为当项目根路径变化时，文件绝对路径也会变化`loader-utils`中的`stringifyRequest`方法，可以将绝对路径转化为相对路径。
  #### 同等依赖（peer dependencies）
  如果你的loader简单包裹另外一个包，你应该把这个包作为一个`peerDependency`引入。这种方式允许应用程序开发者在必要情况下，在`package.json`中指定所需的确定版本。
  例如，sass-loader指定node-sass作为同等依赖，引用如下：
  ```js
  {
    "peerDependencies": {
      "node-sass": "^4.0.0"
    }
  }
  ```

## webpack的构建流程
webpack的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：
1. 初始化参数：从配置文件和Shell语句中读取与合并参数，得出最终参数；
2. 开始编译：用上一步得到的参数初始化`Compiler`对象，加载所有配置的插件，执行对象的`run`方法开始执行编译；
3. 确定入口：根据配置中的entry找出所有的入口文件；
4. 编译模块：从入口文件出发，低啊用所有配置的loader对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入库依赖的文件都经过了本步骤；
5. 完成模块编译：在经过第4步使用loader翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系；
6. 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的Chunk转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会；
7. 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。
在以上过程中，webpack会在特定的时间点广播特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用webpack提供的API改变webpack的运行结果。

## webpack4与5的区别
* 引入图片、字体图标、音视频
  - 4.x需要`url-loader`和`file-loader`
  - 5.x可以使用内置的`Asset Modules`
* 清理`/dist`文件夹
  - 4.x使用`clean-webpack-plugin`插件
  - 5.x可在`output`中添加`clean: true`属性

## 预获取（prefetch）、预加载（preload）
* prefetch（预获取）：将来某些导航下可能需要的资源
  - `import(/* webpackPrefetch: true */ './xxx/xxx.js')`
  - 上面代码会生成`<link rel="prefetch" href="xxx.js">`并追加到页面头部
  - prefetch chunk会在父chunk加载结束后开始加载
  - prefetch chunk在浏览器闲置时下载
  - prefetch chunk会用于未来的某个时刻
* preload（预加载）：当前导航下可能需要资源
  - `import(/* webpackPreload: true */ 'Libary')`
  - `<link rel="preload">`
  - preload chunk会在父chunk加载时，以并行方式开始加载
  - preload chunk具有中等优先级，并立即下载
  - preload chunk会在父chunk中立即请求，用于当下时刻

## 常见的loader
### file-loader
file-loader：把文件输出到一个文件夹中，在代码中通过相对URL去引用输出的文件
```js
  {
    test: /\.(png|jpg|gif)$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          outputPath: 'font', // 文件输出路径，默认，undefined
          publicPath: 'font', // 文件引用路径，默认，__webpack_public_path__
          name: '[name].[ext]'
        }
      }
    ]
  }
```
### url-loader
url-loader：和file-loader类似，但是能在文件很小的情况下以base64的方式吧文件内容注入到代码中
```js
  {
    test: /\.(png|jpg|gif)$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          fallback: 'file-loader', // 超过限制大小使用的loader，默认，file-loader
          fallback: {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[hash:8].[ext]'
            }
          },
          limit: 8192
        }
      }
    ]
  }
```
### vue-loader、vue-template-compiler
  - 使用vue-loader除了使用loader之外，还要引入`VueLoaderPlugin`插件，它的作用是将你定义过的其它规则复制并应用到`.vue`文件里相应语言的部分。
  - 当vue-loader编译组件中的template时，如遇到url，它会将该url转换为webpack模块请求，如：
  ```html
    <img src="../image.png">
  ```
  将会编译为：
  ```js
  createElement('img', {
    attrs: {
      src: require('../image.png')
    }
  })
  ```
  - 转换规则：
    1. 如遇绝对路径，原样保留
    2. 如`.`开头，按本地文件目录解析
    3. 如`～`开头，将会被看作模块依赖（可引用node依赖中的资源）
    4. 如`@`开头，也会被看作模块依赖，如使用`vue-cli`，默认配置了`alias`，可直接指向`/src`
  - sass-loader可以使用additionalData选项，可在所有被处理的文件中共享变量，而不需要显式的导入
  ```js
  {
    loader: 'sass-loader',
    options: {
      additionalData: `$color: red;`
      additionalData: '@import \'@/scss/variables.scss\';\n@import \'~vuetify/src/styles/styles.sass\';'
      sassOptions: {
        // sass-loader默认不处理.sass的缩进语法，需要添加indentedSyntax选项
        indentedSyntax: true
      }
    }
  }
  ```

```js
const VueLoaderPlugin = require('vue-loader/lib/plugin')
module.export = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /./vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /./css$/,
        use: ['vue-style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}
```

## 常见的plugin
### html-webpack-plugin
HtmlWebpackPlugin简化HTML文件的创建，以便为你的webpack包提供服务。
| Name   | Type     | Default     | Description     |
| :--:   | :--:     |  :--:       | :---------      |
| `title`  | `{String}` | `Webpack App` | 生成`HTML`的`title` |
| `filename` | `{String|Function}` | 'index.html' | 输出的`HTML`文件名 |
| `tempalte` | `{String}` |   | 模板，默认将使用`src/index.ejs` |
| `tempalteContent` | `{String|Function|false}` | `false` | 代替`template`的内联模板 |
| `tempalteParameters` | `{Boolean|Object|Function}` | `false` | `template`中使用的变量 |
| `inject` | `{Boolean|String}` | `true` | `true||'head'||'body'||false` 资源注入到`tempalte`中的位置，`true`将根据脚本加载选项添加到`body/header`中，`false`将禁止自动注入 |
| `publicPath` | `{String|'auto'}` | `auto` | script和link公共路径 |
| `scriptLoading` | `{'blocking'|'defer'|'module'}` | `defer` | script引入的形式 |
| `favicon` | `{String|}` |  | favicon的路径 |
| `meta` | `{Object}` | `{}` | meta标签 |
| `base` | `{Object|String|false}` | `false` | 注入一个base标签 |
| `minify` | `{Boolean|Object}` | `true`如果mode为production为false | html压缩 |
| `hash` | `{Boolean}` | `false` | script和css是否添加hash |
| `cache` | `{Boolean}` | `true` | 开启后文件未修改时使用缓存 |
| `showErrors` | `{Boolean}` | `true` | 将错误信息写入到HTML |
| `chunks` | `{?}` | `?` | 可以添加一些chunks |
| `chunksSortMode` | `{String|Function}` | `auto` | 在写入HTML之前对chunks分类`none|'auto'|'manual'|{Funcction}` |
| `excludeChunks` | `{Array.<string>}` |  | 排除的chunks |
| `xhtml` | `{Boolean}` | false | link标签自关闭 |



## DevServer
```js
module.exports = {
  // ...
  devServer: {
    // 'auto' | 'all'  [string]： auto时允许localhost、host和client.webSocketURL.hostname
    // 允许访问的服务器白名单
    allowedHosts: [ '.host.com', 'host2.com' ],  // “.”子域通配符
    // boolean = false  object
    // 用于在启动时通过ZeroConf网络广播你的开发服务器
    bonjour: {
      type: 'http',
      protocol: 'udp'
    },
    client: {
      // 'log' | 'info' | 'warn' | 'error' | 'none' | 'verbose'
      // 允许在浏览器中设置日志级别
      logging: 'info',
      // boolean = true  object: { errors boolean = true, warnings boolean = true }
      // 当出现编译错误或警告时，在浏览器中显示全屏覆盖
      overlay: true,
      // boolean 浏览器中以百分比显示编译进度
      progress: true,
      // boolean = true  number
      // 告诉dev-server它应该尝试重新连接客户端的次数。true为无限次
      reconnect: true,
      // 'ws' | 'sockjs'  string
      // 该配置项允许我们为客户端单独选择当前的devServer传输模式，或者提供自定义的客户端实现
      webSocketTransport: 'ws',
      webSocketTransport: require.resolve('./CustomClient'),
      // string  object
      // 选项允许指定URL到web socket服务器
      // webSocketURL: 'ws://0.0.0.0:8080/ws',
      webSocketURL: {
        hostname: '0.0.0.0',
        pathname: '/ws',
        password: 'dev-server',
        port: 8080,
        protocol: 'ws',
        username: 'webpack'
      }
    },
    // boolean = true
    // 启用gzip compression
    compress: true,
    // object
    // 为webpack-dev-middleware提供处理webpack资源的配置项
    devMiddleware: {
      index: true,
      mimeTypes: { phtml: 'text/html' },
      publicPath: '/publicPathForDevServe',
      serverSideRender: true,
      writeToDisk: true,
    },
    // boolean
    // 使用spdy提供HTTP/2服务。对于node15.0.0及更高版本，此选项将被忽略，以为spdy在这些版本中已被破坏。
    // 一旦Express支持，开发服务器将迁移到node内置的HTTP/2。（测试5.x可以，https）
    http2: true,
    // boolean object
    // 使用https
    https: {
      ca: './path/to/server.pem',
      pfx: './path/to/server.pfx',
      key: './path/to/server.key',
      cert: './path/to/server.crt',
      passphrase: 'webpack-dev-server',
      requestCert: true,
    },
    // 为所有响应添加headers
    headers: { 'X-Custom-Foo': 'bar' }
    headers: [
      {
        key: 'X-Custom',
        value: 'foo'
      },
      {
        key: 'Y-Custom',
        value: 'bar'
      }
    ],
    // boolean = false  object
    // 在使用history时，将index.html代替404响应
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/views/landing.html' },
        { from: /^\/subpage/, to: '/views/subpage.html' },
        { from: /./, to: '/views/404.html' },
      ],
      disabledDotRule: true,
    },
    // 'local-ip' | 'local-ipv4' | 'local-ipv6'  string
    // 指定要使用的host
    host: '0.0.0.0'， // 这样可以让服务器被外部访问
    // 'only'  boolean = true
    // 启用热模块替换
    hot: 'only',  // 在构建失败时不刷新页面作为回退
    // true  string
    // The Unix socket to listen to (instead of a host).
    ipc: true,  // 监听、you-os-temp-dir/webpack-dev-server.sock
    ipc: path.join(__dirname, 'my-socket.sock'),
    // boolean = true
    // 默认情况下，当监听到文件变化时dev-server将会重新加载或刷新页面
    // 为了liveReload能够生效，devServer.hot配置项必须禁用或者devServer.watchFiles配置项必须启用。
    liveReload: false,  // 禁用liveReload
    // boolean
    // 告诉dev-server是否使用magic HTML routes（webpack输出的路由，例如/main for main.js）
    magicHtml: true,
    // function (devServer)
    // 提供服务器内部所在其他中间件之后执行自定义中间件的能力
    // 该配置项已启用，以支持devServer.setupMiddlewares
    onAfterSetupMiddleware: function(devServer) {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      devServer.app.get('/some/path', function (req, res) {
        res.json({ custom: 'response' })
      })
    },
    // function (devServer)
    // 提供服务器内部所在其他中间件之前执行自定义中间件的能力
    // 该配置项已启用，以支持devServer.setupMiddlewares
    onBeforeSetupMiddleware: function(devServer) {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      devServer.app.get('/some/path', function (req, res) {
        res.json({ custom: 'response' })
      })
    },
    // function (devServer)
    // 提供在webpack-dev-server开始监听端口连接时执行自定义函数的能力
    onListening: function (devServer) {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      const port = devServer.server.address().port;
      console.log('Listening on port: ', port);
    },
    // boolean  string  object  [string, object]
    // 告诉dev-server在服务器已经启动后打开浏览器
    open: [ '/my-page', '/another-page' ],
    open: {
      app: {
        name: 'google-chrome',  // 不同平台名称不同
      }
    },
    // 'auto'  string  number
    // 监听的请求端口号
    port: 'auto', // 配置项不能设置未null或''，如果自动使用一个可用端口要使用'auto'
    // object  [object, function]
    // 代理，使用http-proxy-middleware
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: { '^/api': '' },
        secure: false,  // 默认不接受HTTPS上运行证书无效的服务器，需设置该项为false
        changeOrigin: true,  // 默认情况下，代理时会保留主机头的来源，可以设置该项以覆盖此行为
      }
    },
    // 默认情况proxy不会代理对root的请求。要启用根代理，应将devMiddleware.index设置为false
    devMiddleware: {
      index: false
    }
    // 配置多个代理
    proxy: [
      {
        context: ['/auth', '/api'],
        target: 'http://localhost:3000'
      }
    ],
    // 'http' | 'https' | 'spdy'  string object
    // 设置服务器和配置项，默认http
    server: {
      type: 'https',
      options: {
        minVersion: 'TLSv1.1',
        key: fs.readFileSync(path.join(__dirname, './server.key')),
        pfx: fs.readFileSync(path.join(__dirname, './server.pfx')),
        cert: fs.readFileSync(path.join(__dirname, './server.crt')),
        ca: fs.readFileSync(path.join(__dirname, './ca.pem')),
        passphrase: 'webpack-dev-server',
        requestCert: true,
      },
    },
    // boolean = true
    // 允许在SIGINT和SIGTERM信号时关闭开发服务器和退出进程
    setupExitSignals: true,
    // function (middlewares, devServer)
    // 提供执行自定义函数和应用自定义中间件的能力
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      devServer.app.get('/setup-middleware/some/path', (_, response) => {
        response.send('setup-middlewares option GET');
      })
      // 在其他中间件之前运行一个中间件（代替onBeforeSetupMiddleware）
      middlewares.unshift({
        name: 'first-in-array',
        path: '/foo/path',  // 可选
        middleware: (req, res) => {
          res.send('Foo!');
        }
      })
      // 在其他中间件之后运行一个中间件（代替onAfterSetupMiddleware）
      middlewares.push({
        name: 'hello-world-test-one',
        path: '/foo/bar',  // 可选
        middleware: (req, res) => {
          res.send('Foo Bar!');
        }
      })

      middlewares.push((req, res) => {
        res.send('Hello World!');
      })

      return middleWares;
    }
    // boolean  string  object  [string, object]
    // 该配置项允许配置从目录提供静态文件的选项（默认public， false禁用）
    static: ['assets', 'css'],
    static: {
      // string = path.join(process.cwd(), 'public')
      // 告诉服务器从哪里提供内容
      directory: path.join(__dirname, 'public'),
      // object
      // 可配置从static.directory提供静态文件的高级选项
      staticOptions: {
        redirect: true
      },
      // string = '/'  [string]
      // 告诉服务器在哪个URL上提供static.directory的内容
      publicPath: '/serve-public-path-url',
      // boolean object = { icons: true }
      // 告诉开发服务器启用后使用serverIndex中间件
      serveIndex: true,
      // boolean  object
      // 通过static.directory配置告诉dev-server监听文件（默认启用）
      watch: {
        ignored: '*.txt',
        usePolling: false,
      }
    },
    // string  object  [string, object] 
    // 该配置项允许你配置globs/directories/files来监听文件变化
    watchFiles: ['src/**/*.php', 'public/**/**'],
    watchFiles: {
      paths: ['src/**/*.php', 'public/**/*'],
      options: {
        usePolling: false,
      }
    }
    // false | 'sockjs' | 'ws'  string  function  object
    // 该项允许我们选择当前的web-socket服务器或者提供自定义的web-socket服务器实现
    webSocketServer: 'ws'
    webSocketServer: require.resolve('./CustomServer'),
  }
}
```


## asset module资源模块
asset module资源模块，在webpack5之前，通常使用：
  * raw-loader 将文件导入为字符串
  * url-loader 将文件作为data URI内联到bundle中
  * file-loader 将问价发送到输出目录
  
资源模块通过4中新的模块类型，来替换之前都loader：
  * asset/resource 发送一个单独的文件并导出URL（之前使用file-loader）
  * asset/inline 导出一个资源的data URI（之前使用url-loader）
  * asset/source 导出资源的源代码（之前使用raw-loader）
  * asset 在导出一个data URI和发送一个单独的文件之间自动选择（之前使用url-loader，并配置资源体积限制）

```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    // 配置asset文件路径及名称，优先级低于generator.filename
    assetModuleFilename: 'asset/[hash][ext][query]'
  },
  module: {
    rules: [
      {
        test: /\.jpg/,
        type: 'asset/resource',
        generator: {
          // 配置文件路径及名称，优先级高于output.assetModuleFilename
          filename: 'images/[hash][ext][query]'
        }
      },
      {
        test: /\.svg$/,
        type: 'asset/inline'
        // 可通过generator.dataUrl自定义编码算法
        generator: {
          dataUrl: content => {
            content = content.toString();
            return svgToMiniDataURI(content);
          }
        }
      },
      {
        test: /\.txt$/,
        type: 'asset/source'
      },
      {
        test: /\.png$/,
        type: 'asset',
        parer: {
          dataUrlCondition: {
            maxSize: 4 * 1024
          }
        }
      }
    ]
  },
};
```

变更内联loader的语法
在asset模块和webpack5之前，可以使用内联语法与上述loader结合使用。
现在建议取点所有的内联loader的语法，使用资源查询条件来模仿内联语法的功能。
```js
- import myModule from 'raw-loader!my-module';
+ import myModule from 'my-module?raw';
```
webpack相关配置：
```js
module: {
  rules: [
    {
      resourceQuery: /raw/,
      type: 'asset/source'
    }
  ]
}
```
如果你想把原始资源排除在其他loader的处理范围以外，请使用取反的原则：
```js
rules: [
  {
    test: /\.m?js$/,
    resourceQuery: { not: [/raw/] },
    use: [ ... ]
  },
  {
    resourecQuery: /raw/,
    type: 'asset/source',
  }
]
```
或者使用oneOf的规则列表。此处只应用第一个匹配规则：
```js
module: {
  rules: [
    {
      oneOf: [
        {
          resoureceQuery: /raw/,
          type: 'asset/sourec',
        },
        {
          test: /\.m?js$/,
          use: [ ... ]
        }
      ]
    }
  ]
}
```