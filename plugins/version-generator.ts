import type { Plugin } from 'vite';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

function generateVersionFile(targetPath: string) {
  const version = {
    timestamp: Date.now(),
    buildTime: new Date().toISOString(),
    version: `v${Date.now()}`,
  };
  writeFileSync(targetPath, JSON.stringify(version, null, 2));
  console.log(`🔖 版本文件已生成: ${targetPath}`);
}

export default function generateVersionPlugin(): Plugin[] {
  return [
    {
      name: 'generate-version-dev',
      apply: 'serve',
      // 使用 buildStart 替代 configureServer，保证dev server 启动之前 写入 version.json
      buildStart() {
        const path = resolve(__dirname, '../public/version.json');
        generateVersionFile(path);
      },
    },
    {
      name: 'generate-version-build',
      apply: 'build',
      generateBundle() {
        const path = resolve(__dirname, '../dist/version.json');
        generateVersionFile(path);
      },
    },
  ];
}
