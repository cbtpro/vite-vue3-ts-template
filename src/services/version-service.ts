export interface VersionInfo {
  timestamp: number;
  buildTime: string;
  version: string;
}
/**
 * 检查版本的时间间隔，单位毫秒
 */
export const CHECK_VERSION_DURATION = 10 * 60 * 1000;
class VersionService {
  private currentVersion: string | null = null;
  private checkInterval: number = 20 * 1000; // 5分钟
  private timer: number | null = null;
  private onVersionUpdate?: (newVersion: VersionInfo) => void;

  async checkVersion(): Promise<VersionInfo | null> {
    try {
      const response = await fetch('/version.json?' + Date.now(), { cache: 'no-cache' });
      if (!response.ok) {
        throw new Error('获取版本信息失败');
      }
      return await response.json();
    } catch (error) {
      console.error('检查版本时出错:', error);
      return null;
    }
  }

  async initVersionCheck(callback?: (newVersion: VersionInfo) => void) {
    this.onVersionUpdate = callback;

    // 首次检查并记录当前版本
    const initialVersion = await this.checkVersion();
    if (initialVersion) {
      this.currentVersion = initialVersion.version;
      console.log('📋 当前版本:', this.currentVersion);
    }

    // 开始定期检查
    this.startPeriodicCheck();
  }

  private startPeriodicCheck() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = window.setInterval(async () => {
      const latestVersion = await this.checkVersion();

      if (latestVersion && this.currentVersion) {
        if (latestVersion.version !== this.currentVersion) {
          console.log('🔄 检测到新版本:', latestVersion.version);
          this.onVersionUpdate?.(latestVersion);
        }
      }
    }, this.checkInterval);
  }

  stopVersionCheck() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  setCheckInterval(interval: number) {
    this.checkInterval = interval;
    if (this.timer) {
      this.startPeriodicCheck();
    }
  }
}

export const versionService = new VersionService();
