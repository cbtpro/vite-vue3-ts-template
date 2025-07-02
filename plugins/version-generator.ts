import { writeFileSync } from 'fs';
import { resolve } from 'path';

// 版本生成插件
export default function generateVersionPlugin() {
  return {
    name: 'generate-version',
    generateBundle() {
      const version = {
        timestamp: Date.now(),
        buildTime: new Date().toISOString(),
        version: `v${Date.now()}`,
      };

      // 生成 version.json 到 public 目录
      const versionPath = resolve(__dirname, '../dist/version.json');
      writeFileSync(versionPath, JSON.stringify(version, null, 2));

      console.log('🔖 版本文件已生成:', version);
    },
  };
}
