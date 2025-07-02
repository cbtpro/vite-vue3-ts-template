import { ref, onUnmounted } from 'vue';

export interface VersionInfo {
  timestamp: number;
  buildTime: string;
  version: string;
}

/**
 * 检查版本的时间间隔，单位毫秒
 */
export const CHECK_VERSION_DURATION = 10 * 60 * 1000;

export default function useVersionService(checkInterval = 20 * 1000) {
  const currentVersion = ref<string | null>(null);
  const timer = ref<number | null>(null);

  /**
   * 版本更新时的回调
   */
  let onVersionUpdate: ((newVersion: VersionInfo) => void) | undefined;

  const checkVersion = async (): Promise<VersionInfo | null> => {
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
  };

  const initVersionCheck = async (callback?: (newVersion: VersionInfo) => void) => {
    onVersionUpdate = callback;

    const initialVersion = await checkVersion();
    if (initialVersion) {
      currentVersion.value = initialVersion.version;
      console.log('📋 当前版本:', currentVersion.value);
    }

    startPeriodicCheck();
  };

  const startPeriodicCheck = () => {
    if (timer.value) {
      clearInterval(timer.value);
    }

    timer.value = window.setInterval(async () => {
      const latestVersion = await checkVersion();
      if (latestVersion && currentVersion.value) {
        if (latestVersion.version !== currentVersion.value) {
          console.log('🔄 检测到新版本:', latestVersion.version);
          onVersionUpdate?.(latestVersion);
        }
      }
    }, checkInterval);
  };

  const stopVersionCheck = () => {
    if (timer.value) {
      clearInterval(timer.value);
      timer.value = null;
    }
  };

  const setCheckInterval = (interval: number) => {
    checkInterval = interval;
    if (timer.value) {
      startPeriodicCheck();
    }
  };

  onUnmounted(() => {
    stopVersionCheck();
  });

  return {
    currentVersion,
    checkVersion,
    initVersionCheck,
    stopVersionCheck,
    setCheckInterval,
  };
}
