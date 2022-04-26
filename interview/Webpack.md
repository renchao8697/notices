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