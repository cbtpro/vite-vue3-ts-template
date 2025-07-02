<template>
  <div></div>
</template>

<script setup lang="ts">
import { computed, h, onMounted, onUnmounted, toRefs } from 'vue';
import { Button, notification } from 'ant-design-vue';
import useVersionService, { CHECK_VERSION_DURATION } from './services/version-service';
import type { VersionInfo } from './services/version-service';
import { forceReload } from '@/utils/browser';

interface IVersionNotificationProps {
  checkVersionDuration: number;
}
const props = withDefaults(defineProps<IVersionNotificationProps>(), {
  checkVersionDuration: 10,
});
let notificationInstance: (() => void) | null = null;
const notificationKey = 'version-update-notification';

const { checkVersionDuration } = toRefs(props);
const duration = computed(() => {
  if (checkVersionDuration.value > 0) {
    return checkVersionDuration.value * 60 * 1000;
  }
  return CHECK_VERSION_DURATION;
});
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
              // if (isMounted) {
              //   setTimeout(() => {
              //     handleVersionUpdate(newVersion);
              //   }, duration.value);
              // }
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

const { initVersionCheck, stopVersionCheck } = useVersionService(duration.value);
onMounted(() => {
  initVersionCheck(handleVersionUpdate);
});

onUnmounted(() => {
  stopVersionCheck();
  if (notificationInstance) {
    notificationInstance();
    notificationInstance = null;
  }
});
</script>
