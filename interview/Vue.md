## Vue中的css深度选择器
当style标签有scoped属性时，它的css只能作用于当前组件，父组件样式将不会渗透到子组件，当你不想去掉scoped属性，又想让父组件控制子组件样式时，可以使用深度选择器
```vue
<!-- 支持scss，将废弃 -->
<style lang="scss" scoped>
::v-deep .child {}
</style>

<!-- 不支持scss，将废弃 -->
<style scoped>
>>> .child {}
</style>

<!-- 不支持scss，将废弃 -->
<style scoped>
/deep/ .child {}
</style>

<!-- 支持scss，推荐 -->
<style lang="scss" scoped>
:deep(.child) {}
</style>
```

## Vue3 setup
* 在`setup`中应避免使用`this`，因为它不会找到组件实例。`setup`的调用发生在`data` property、`computed` property和`methods`被解析之前，所以它们无法在`setup`中获取。
* 因为`setup`是围绕`beforeCreate`和`created`生命周期钩子运行的，所以不需要显示的定义它们。也就是说，在`beforeCreate`和`created`中编写的任何代码，都可以直接在`setup`函数中编写。
* `setup`选项是一个接收`props`和`context`的函数，`setup(props, context)`
  - `props`： `props`参数是响应式的，需要先声明`props`属性才能获取到
    ```js
      export default {
        props: {
          title: String
        },
        setup(props) {
          console.log(props.title)
        }
      }
    ```
    因为`props`是响应式的，不能使用ES6解构，它会消除prop的响应性。
    如需要解构`props`，可在`setup`中使用`toRef`函数来完成：
    ```js
      import { toRefs } from 'vue'
      setup(props) {
        const { title } = toRefs(props);
        console.log(title.value)
      }
    ```
    如果`title`是可选的prop，则传入的`props`中可能没有`title`。这种情况`toRefs`将不会为`title`创建一个`ref`。你需要使用`toRef`代替它:
    ```js
    import { toRef } from 'vue'
    setup(props) {
      const title = toRef(props, 'title')
      console.log(title.value)
    }
    ```
  - `context`：`context`参数是一个普通JavaScript对象（非响应式）
    在执行`setup`时，可以访问一下property：`porps`，`attrs`，`slots`，`emit`；
    不能访问一下选项：`data`，`computed`，`methods`，`refs`
* 如果`setup`返回一个对象，那么该对象的property以及传递给`setup`的`props`参数中的property都可以在模板中访问。从`setup`返回的`refs`在模板中访问时是被自动浅解包的，因此不应该在模板中使用`.value`
* `setup`还可以返回一个渲染函数，当我们想要将这个组件的方法通过模板ref暴露给父组件时，需要使用expose来解决
```js
import { h, ref } from 'vue'
export default {
  setup(props, {expose}) {
    const count = ref(0)
    const increment = () => ++count.value

    expose({
      increment
    })

    return () => h('div', count.value)
  }
}
```

## Vue3中的watch和watchEffect
* 与  watchEffect 比较，  watch 允许我们：
  - 懒执行副作用
  - 更具体的说明什么状态应该处罚侦听器重新运行
  - 访问侦听器状态变化前后的值