# Vue 3 + TypeScript + Vite 开发模板

这个模板可以帮助你开始在 Vite 中使用 Vue 3 和 TypeScript 进行开发。 模板使用 Vue 3 的 `<script setup>` SFCs, 查看 [script setup 文档](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup)了解更多信息.

## 推荐 IDE 设置

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (禁用 Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## 在 ts 中类型支持导入对`.vue`

默认情况下，TypeScript 不能处理`.vue`导入的类型信息，所以我们用`vue-tsc`替换`tsc` CLI 来进行类型检查。 在编辑器中，我们需要[TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)来让 TypeScript 语言服务察觉到`.vue`类型。

如果你觉得独立的 TypeScript 插件不够快，Volar 还实现了一个性能更高的[Take Over Mode(接管模式)](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669)。您可以通过以下步骤启用它:

1. 禁用内置的 TypeScript 扩展
   1. 从 VSCode 的命令模式运行`Extensions: Show Built-in Extensions`
   2. 找到 `TypeScript and JavaScript Language Features`, 点击鼠标右键选择`Disable (Workspace)`
2. 通过从命令面板运行`Developer: Reload Window`来重新加载 VSCode 窗口。
