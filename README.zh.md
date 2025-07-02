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

## 使 Codespaces 时如何提交代码

使用 Codespaces 时相当于重新创建了一个文件夹并初始化了了一个仓库，此时可以提交代码但不能推送带远端仓库。需要进行一些操作才可以进行代码合并和 push。

### 首先将修改的代码 commit

添加一个 remote，这里建议用 https 的方式，github 的 Codespaces 此时已经登陆了 github 账户，可以直接使用 https 的方式进行 push，ssh 的方式则依然还需要配置 ssh 证书。

```shell
git remote add origin https://github.com/cbtpro/vite-vue3-ts-template.git
```

如果添加错了可以使用移除命令移除后重新添加

```shell
git remote remove origin
```

### 将本地分支 main 设置到远端的 origin/main 上

```shell
git branch --set-upstream-to=origin/main main
```

### 拉取远端代码

```shell
git fetch
```

### 合并代码，解决冲突

```shell
git rebase
```

### push 代码到远端

```shell
git push
```

### 任务

- env 支持 √
- mock 支持 √
- 地图支持
- 增加 404 页面（外层和内层）
- 虚拟滚动
- 生成海报
- 二维码
- 添加@trivago/prettier-plugin-sort-imports 对引入进行排序

## 开发步骤

```
corepack enable
pnpm install
```
