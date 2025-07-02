<template>
  <div class="app-container">
    <div class="main-content">
      <div class="content-card">
        <div class="header">
          <h1 class="title">HTTP 请求封装测试 (Vue3)</h1>
          <p class="subtitle">测试弱网重试、频繁请求告警等功能，请打开浏览器控制台查看详细日志</p>
        </div>

        <div class="test-grid">
          <div class="test-section">
            <h2 class="section-title">功能测试</h2>

            <button
              @click="testNormalRequest"
              :disabled="loading"
              class="test-btn test-btn-success"
            >
              {{ loading ? '请求中...' : '正常请求测试' }}
            </button>

            <button @click="testRetryRequest" :disabled="loading" class="test-btn test-btn-warning">
              {{ loading ? '重试中...' : '重试机制测试' }}
            </button>

            <button
              @click="testFrequentRequests"
              :disabled="loading"
              class="test-btn test-btn-danger"
            >
              {{ loading ? '测试中...' : '频繁请求告警测试' }}
            </button>

            <button @click="testSlowRequest" :disabled="loading" class="test-btn test-btn-purple">
              {{ loading ? '测试中...' : '慢请求告警测试' }}
            </button>
          </div>

          <div class="test-section">
            <h2 class="section-title">统计管理</h2>

            <button @click="showStats" class="test-btn test-btn-primary">查看请求统计</button>

            <button @click="clearStats" class="test-btn test-btn-secondary">清空统计数据</button>
          </div>
        </div>

        <div v-if="result" class="result-card">
          <h3 class="result-title">测试结果:</h3>
          <p class="result-content">{{ result }}</p>
        </div>

        <div v-if="Object.keys(stats).length > 0" class="stats-card">
          <h3 class="stats-title">📊 请求统计信息</h3>

          <div v-if="stats.topRequests && stats.topRequests.length > 0" class="top-requests">
            <h4 class="top-requests-title">热门请求 TOP 5:</h4>
            <div class="request-list">
              <div v-for="(stat, index) in stats.topRequests" :key="stat.url" class="request-item">
                <div class="request-header">
                  <span class="request-rank">#{{ index + 1 }} {{ stat.url }}</span>
                  <span class="request-count">{{ stat.count }} 次请求</span>
                </div>
                <div class="request-time">
                  平均响应时间: {{ Math.round(stat.averageResponseTime) }}ms
                </div>
              </div>
            </div>
          </div>

          <div class="stats-tip">💡 提示: 更多详细信息请查看浏览器控制台</div>
        </div>

        <div class="help-card">
          <h3 class="help-title">🔍 如何查看功能效果</h3>
          <ul class="help-list">
            <li>• 打开浏览器开发者工具 (F12)</li>
            <li>• 切换到 Console (控制台) 标签页</li>
            <li>• 点击上方按钮测试各种功能</li>
            <li>• 观察控制台中的重试日志和告警信息</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useApi } from '@/api';

const loading = ref(false);
const result = ref('');
const stats = ref<any>({});
const api = useApi();

const testNormalRequest = async () => {
  loading.value = true;
  result.value = '';
  try {
    const users = await api.get<IMockUser[]>('/http-demo/users');
    result.value = `✅ 正常请求成功！获取到 ${users.data.length} 个用户`;
  } catch (error) {
    result.value = `❌ 请求失败: ${(error as Error).message}`;
  } finally {
    loading.value = false;
  }
};

const testRetryRequest = async () => {
  loading.value = true;
  result.value = '';
  try {
    // 请求一个不存在的端点来触发重试
    await api.get('/http-demo/nonexistent-endpoint', {
      retry: {
        maxRetries: 3,
        retryDelay: 1000,
      },
    });
  } catch (error) {
    result.value = `❌ 重试后仍然失败: ${(error as Error).message}`;
  } finally {
    loading.value = false;
  }
};

const testFrequentRequests = async () => {
  loading.value = true;
  result.value = '';

  // 快速发送多个请求来触发频繁请求告警
  const promises = [];
  for (let i = 0; i < 15; i++) {
    promises.push(api.get<IMockPost[]>('/http-demo/posts').catch(() => {}));
  }

  try {
    await Promise.all(promises);
    result.value = '✅ 频繁请求测试完成，请查看控制台告警信息';
  } catch (error) {
    result.value = `❌ 频繁请求测试失败: ${(error as Error).message}`;
  } finally {
    loading.value = false;
  }
};

const testSlowRequest = async () => {
  loading.value = true;
  result.value = '';
  try {
    // 设置较短的超时时间来模拟慢请求
    await api.get<IMockUser[]>('/http-demo/users', {
      timeout: 1, // 1ms超时，必然触发慢请求告警
    });
  } catch (error) {
    result.value = `❌ 慢请求测试: ${(error as Error).message}`;
  } finally {
    loading.value = false;
  }
};

const showStats = () => {
  const requestStats = api.getRequestStats();
  const topRequests = api.getTopRequests(5);
  stats.value = { requestStats, topRequests };
};

const clearStats = () => {
  api.clearStats();
  stats.value = {};
  result.value = '📊 统计数据已清空';
};
</script>

<style lang="less" scoped>
// 变量定义
@primary-color: #3b82f6;
@success-color: #10b981;
@warning-color: #f59e0b;
@danger-color: #ef4444;
@purple-color: #8b5cf6;
@secondary-color: #6b7280;

@border-radius: 12px;
@shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
@transition: all 0.3s ease;

// 混合
.button-base() {
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: @border-radius;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: @transition;
  outline: none;

  &:disabled {
    background-color: #d1d5db;
    color: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }

  &:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:not(:disabled):active {
    transform: translateY(0);
  }
}

.card-base() {
  background: white;
  border-radius: @border-radius;
  box-shadow: @shadow;
  padding: 24px;
  margin-bottom: 24px;
}

// 主要样式
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 32px 16px;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
}

.content-card {
  .card-base();
  margin-bottom: 0;
}

.header {
  text-align: center;
  margin-bottom: 48px;

  .title {
    font-size: 32px;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 12px;
  }

  .subtitle {
    font-size: 16px;
    color: #6b7280;
    line-height: 1.6;
  }
}

.test-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

.test-section {
  .section-title {
    font-size: 20px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 24px;
  }
}

.test-btn {
  .button-base();
  color: white;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }

  &.test-btn-success {
    background-color: @success-color;

    &:not(:disabled):hover {
      background-color: darken(@success-color, 10%);
    }
  }

  &.test-btn-warning {
    background-color: @warning-color;

    &:not(:disabled):hover {
      background-color: darken(@warning-color, 10%);
    }
  }

  &.test-btn-danger {
    background-color: @danger-color;

    &:not(:disabled):hover {
      background-color: darken(@danger-color, 10%);
    }
  }

  &.test-btn-purple {
    background-color: @purple-color;

    &:not(:disabled):hover {
      background-color: darken(@purple-color, 10%);
    }
  }

  &.test-btn-primary {
    background-color: @primary-color;

    &:not(:disabled):hover {
      background-color: darken(@primary-color, 10%);
    }
  }

  &.test-btn-secondary {
    background-color: @secondary-color;

    &:not(:disabled):hover {
      background-color: darken(@secondary-color, 10%);
    }
  }
}

.result-card {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: @border-radius;
  padding: 20px;
  margin-bottom: 24px;

  .result-title {
    font-weight: 600;
    color: #374151;
    margin-bottom: 12px;
  }

  .result-content {
    color: #1f2937;
    white-space: pre-wrap;
    line-height: 1.6;
  }
}

.stats-card {
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: @border-radius;
  padding: 24px;
  margin-bottom: 24px;

  .stats-title {
    font-weight: 600;
    color: #1e40af;
    margin-bottom: 20px;
  }

  .top-requests {
    margin-bottom: 16px;

    .top-requests-title {
      font-weight: 500;
      color: #1d4ed8;
      margin-bottom: 12px;
    }
  }

  .request-list {
    .request-item {
      background: white;
      padding: 16px;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      margin-bottom: 12px;

      &:last-child {
        margin-bottom: 0;
      }

      .request-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .request-rank {
          font-weight: 500;
          color: #1f2937;
        }

        .request-count {
          font-size: 14px;
          color: #6b7280;
        }
      }

      .request-time {
        font-size: 14px;
        color: #9ca3af;
      }
    }
  }

  .stats-tip {
    font-size: 14px;
    color: #2563eb;
  }
}

.help-card {
  background-color: #fffbeb;
  border: 1px solid #fed7aa;
  border-radius: @border-radius;
  padding: 24px;

  .help-title {
    font-weight: 600;
    color: #92400e;
    margin-bottom: 12px;
  }

  .help-list {
    list-style: none;

    li {
      color: #b45309;
      font-size: 14px;
      margin-bottom: 4px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
