# Vue2

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