<template>
  <div></div>
</template>

<script setup lang="ts">
import { h, onMounted, onUnmounted } from 'vue';
import { Button, notification } from 'ant-design-vue';
import {
  CHECK_VERSION_DURATION,
  versionService,
  type VersionInfo,
} from '@/services/version-service';
import { forceReload } from '@/utils/browser';

let notificationInstance: (() => void) | null = null;
let isMounted = true;
const notificationKey = 'version-update-notification';

const handleVersionUpdate = (newVersion: VersionInfo) => {
  notification.close(notificationKey); // 始终先关闭已有

  notification.open({
    key: notificationKey,
    message: '检测到新版本',
    description: `发现新版本 ${newVersion.version}，建议刷新页面以获得最佳体验`,
    placement: 'bottomRight',
    duration: 0,
    btn: () =>
      h('div', { style: 'display: flex; gap: 8px;' }, [
        h(
          Button,
          {
            size: 'small',
            type: 'primary',
            onClick: () => forceReload(),
          },
          { default: () => '立即刷新' },
        ),
        h(
          Button,
          {
            size: 'small',
            onClick: () => {
              notification.close(notificationKey);
              if (isMounted) {
                setTimeout(() => {
                  handleVersionUpdate(newVersion);
                }, CHECK_VERSION_DURATION);
              }
            },
          },
          { default: () => '稍后提醒' },
        ),
      ]),
    onClose: () => {
      notificationInstance = null;
    },
  });

  notificationInstance = () => notification.close(notificationKey);
};

onMounted(() => {
  isMounted = true;
  versionService.initVersionCheck(handleVersionUpdate);
});

onUnmounted(() => {
  isMounted = false;
  versionService.stopVersionCheck();
  if (notificationInstance) {
    notificationInstance();
    notificationInstance = null;
  }
});
</script>
