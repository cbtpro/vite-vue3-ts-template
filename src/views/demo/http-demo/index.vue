<template>
  <div class="app-container">
    <div class="main-content">
      <div class="content-card">
        <div class="header">
          <h1 class="title">HTTP 请求封装测试 (Vue3 + MSW)</h1>
          <p class="subtitle">使用MSW.js提供Mock数据，测试弱网重试、频繁请求告警等功能</p>
          <div class="mock-status">
            <span class="mock-indicator">🎭</span>
            <span class="mock-text">Mock服务已启用</span>
          </div>
        </div>

        <div class="test-grid">
          <div class="test-section">
            <h2 class="section-title">基础功能测试</h2>

            <button
              @click="testNormalRequest"
              :disabled="loading"
              class="test-btn test-btn-success"
            >
              {{ loading ? '请求中...' : '正常请求测试' }}
            </button>

            <button @click="testCreatePost" :disabled="loading" class="test-btn test-btn-primary">
              {{ loading ? '创建中...' : '创建文章测试' }}
            </button>

            <button @click="testUpdatePost" :disabled="loading" class="test-btn test-btn-info">
              {{ loading ? '更新中...' : '更新文章测试' }}
            </button>

            <button @click="testDeletePost" :disabled="loading" class="test-btn test-btn-warning">
              {{ loading ? '删除中...' : '删除文章测试' }}
            </button>
          </div>

          <div class="test-section">
            <h2 class="section-title">错误处理测试</h2>

            <button @click="testRetryRequest" :disabled="loading" class="test-btn test-btn-danger">
              {{ loading ? '重试中...' : '重试机制测试' }}
            </button>

            <button @click="testSometimesFail" :disabled="loading" class="test-btn test-btn-orange">
              {{ loading ? '测试中...' : '间歇性失败测试' }}
            </button>

            <button
              @click="testTimeoutRequest"
              :disabled="loading"
              class="test-btn test-btn-purple"
            >
              {{ loading ? '测试中...' : '超时请求测试' }}
            </button>

            <button @click="test404Request" :disabled="loading" class="test-btn test-btn-gray">
              {{ loading ? '测试中...' : '404错误测试' }}
            </button>
          </div>

          <div class="test-section">
            <h2 class="section-title">性能监控测试</h2>

            <button @click="testFrequentRequests" :disabled="loading" class="test-btn test-btn-red">
              {{ loading ? '测试中...' : '频繁请求告警测试' }}
            </button>

            <button @click="testSlowRequest" :disabled="loading" class="test-btn test-btn-yellow">
              {{ loading ? '测试中...' : '慢请求告警测试' }}
            </button>
          </div>

          <div class="test-section">
            <h2 class="section-title">统计管理</h2>

            <button @click="showStats" class="test-btn test-btn-blue">查看请求统计</button>

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
            <li>• 在Network标签页可以看到MSW拦截的请求</li>
          </ul>
        </div>

        <div class="mock-info-card">
          <h3 class="mock-info-title">🎭 MSW Mock端点说明</h3>
          <div class="endpoint-grid">
            <div class="endpoint-item">
              <span class="method get">GET</span>
              <span class="path">/users</span>
              <span class="desc">获取用户列表（10%概率返回500错误）</span>
            </div>
            <div class="endpoint-item">
              <span class="method post">POST</span>
              <span class="path">/posts</span>
              <span class="desc">创建新文章</span>
            </div>
            <div class="endpoint-item">
              <span class="method put">PUT</span>
              <span class="path">/posts/:id</span>
              <span class="desc">更新文章</span>
            </div>
            <div class="endpoint-item">
              <span class="method delete">DELETE</span>
              <span class="path">/posts/:id</span>
              <span class="desc">删除文章</span>
            </div>
            <div class="endpoint-item">
              <span class="method get">GET</span>
              <span class="path">/slow-endpoint</span>
              <span class="desc">慢请求（5秒延迟）</span>
            </div>
            <div class="endpoint-item">
              <span class="method get">GET</span>
              <span class="path">/always-fail</span>
              <span class="desc">总是返回500错误</span>
            </div>
            <div class="endpoint-item">
              <span class="method get">GET</span>
              <span class="path">/sometimes-fail</span>
              <span class="desc">50%概率失败</span>
            </div>
            <div class="endpoint-item">
              <span class="method get">GET</span>
              <span class="path">/timeout</span>
              <span class="desc">超时请求（10秒延迟）</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useApi } from '@/api';

// 现在可以直接使用全局类型，无需import！
const loading = ref(false);
const result = ref('');
const stats = ref<any>({});
const api = useApi();

// 基础功能测试
const testNormalRequest = async () => {
  loading.value = true;
  result.value = '';
  try {
    const { data } = await api.get<IMockUser[]>('/http-demo/users');
    result.value = `✅ 正常请求成功！获取到 ${data.length} 个用户\n第一个用户: ${data[0]?.name}`;
  } catch (error) {
    result.value = `❌ 请求失败: ${(error as Error).message}`;
  } finally {
    loading.value = false;
  }
};

const testCreatePost = async () => {
  loading.value = true;
  result.value = '';
  try {
    const { data } = await api.post<IMockPost>('/posts', {
      title: '测试文章标题',
      body: '这是一篇测试文章的内容',
      userId: 1,
    });
    result.value = `✅ 创建文章成功！\n文章ID: ${data.id}\n标题: ${data.title}`;
  } catch (error) {
    result.value = `❌ 创建失败: ${(error as Error).message}`;
  } finally {
    loading.value = false;
  }
};

const testUpdatePost = async () => {
  loading.value = true;
  result.value = '';
  try {
    const { data } = await api.put<IMockPost>('/posts/1', {
      title: '更新后的文章标题',
      body: '这是更新后的文章内容',
    });
    result.value = `✅ 更新文章成功！\n文章ID: ${data.id}\n新标题: ${data.title}`;
  } catch (error) {
    result.value = `❌ 更新失败: ${(error as Error).message}`;
  } finally {
    loading.value = false;
  }
};

const testDeletePost = async () => {
  loading.value = true;
  result.value = '';
  try {
    await api.delete('/posts/1');
    result.value = `✅ 删除文章成功！文章ID: 1 已被删除`;
  } catch (error) {
    result.value = `❌ 删除失败: ${(error as Error).message}`;
  } finally {
    loading.value = false;
  }
};

// 错误处理测试
const testRetryRequest = async () => {
  loading.value = true;
  result.value = '';
  try {
    await api.get('/http-demo/always-fail', {
      retry: {
        maxRetries: 3,
        retryDelay: 1000,
      },
    });
  } catch (error) {
    result.value = `❌ 重试后仍然失败: ${(error as Error).message}\n请查看控制台的重试日志`;
  } finally {
    loading.value = false;
  }
};

const testSometimesFail = async () => {
  loading.value = true;
  result.value = '';
  try {
    const response = await api.get('/http-demo/sometimes-fail', {
      retry: {
        maxRetries: 2,
        retryDelay: 500,
      },
    });
    result.value = `✅ 间歇性失败测试成功！\n响应: ${JSON.stringify(response)}`;
  } catch (error) {
    result.value = `❌ 间歇性失败测试失败: ${(error as Error).message}`;
  } finally {
    loading.value = false;
  }
};

const testTimeoutRequest = async () => {
  loading.value = true;
  result.value = '';
  try {
    await api.get('/http-demo/timeout', {
      timeout: 2000, // 2秒超时
    });
  } catch (error) {
    result.value = `❌ 超时测试: ${(error as Error).message}\n请求在2秒后超时`;
  } finally {
    loading.value = false;
  }
};

const test404Request = async () => {
  loading.value = true;
  result.value = '';
  try {
    await api.get('/http-demo/nonexistent-endpoint');
  } catch (error) {
    result.value = `❌ 404错误测试: ${(error as Error).message}`;
  } finally {
    loading.value = false;
  }
};

// 性能监控测试
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
    const response = await api.get('/http-demo/slow-endpoint');
    result.value = `✅ 慢请求测试完成: ${JSON.stringify(response)}\n请查看控制台的慢请求告警`;
  } catch (error) {
    result.value = `❌ 慢请求测试失败: ${(error as Error).message}`;
  } finally {
    loading.value = false;
  }
};

// 统计管理
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
@info-color: #06b6d4;
@orange-color: #f97316;
@red-color: #dc2626;
@yellow-color: #eab308;
@blue-color: #2563eb;
@gray-color: #9ca3af;

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
  max-width: 1400px;
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
    margin-bottom: 16px;
  }

  .mock-status {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #f0f9ff;
    border: 1px solid #0ea5e9;
    border-radius: 20px;
    padding: 8px 16px;

    .mock-indicator {
      font-size: 16px;
    }

    .mock-text {
      font-size: 14px;
      color: #0369a1;
      font-weight: 500;
    }
  }
}

.test-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  margin-bottom: 32px;
}

.test-section {
  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 20px;
    padding-bottom: 8px;
    border-bottom: 2px solid #e5e7eb;
  }
}

.test-btn {
  .button-base();
  color: white;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }

  &.test-btn-success {
    background-color: @success-color;

    &:not(:disabled):hover {
      background-color: darken(@success-color, 10%);
    }
  }

  &.test-btn-primary {
    background-color: @primary-color;

    &:not(:disabled):hover {
      background-color: darken(@primary-color, 10%);
    }
  }

  &.test-btn-info {
    background-color: @info-color;

    &:not(:disabled):hover {
      background-color: darken(@info-color, 10%);
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

  &.test-btn-orange {
    background-color: @orange-color;

    &:not(:disabled):hover {
      background-color: darken(@orange-color, 10%);
    }
  }

  &.test-btn-purple {
    background-color: @purple-color;

    &:not(:disabled):hover {
      background-color: darken(@purple-color, 10%);
    }
  }

  &.test-btn-gray {
    background-color: @gray-color;

    &:not(:disabled):hover {
      background-color: darken(@gray-color, 10%);
    }
  }

  &.test-btn-red {
    background-color: @red-color;

    &:not(:disabled):hover {
      background-color: darken(@red-color, 10%);
    }
  }

  &.test-btn-yellow {
    background-color: @yellow-color;

    &:not(:disabled):hover {
      background-color: darken(@yellow-color, 10%);
    }
  }

  &.test-btn-blue {
    background-color: @blue-color;

    &:not(:disabled):hover {
      background-color: darken(@blue-color, 10%);
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
  margin-bottom: 24px;

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

.mock-info-card {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: @border-radius;
  padding: 24px;

  .mock-info-title {
    font-weight: 600;
    color: #334155;
    margin-bottom: 20px;
  }

  .endpoint-grid {
    display: grid;
    gap: 12px;

    .endpoint-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: white;
      border-radius: 8px;
      border: 1px solid #e2e8f0;

      .method {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        min-width: 60px;
        text-align: center;

        &.get {
          background-color: #dcfce7;
          color: #166534;
        }

        &.post {
          background-color: #dbeafe;
          color: #1e40af;
        }

        &.put {
          background-color: #fef3c7;
          color: #92400e;
        }

        &.delete {
          background-color: #fee2e2;
          color: #991b1b;
        }
      }

      .path {
        font-family: 'Courier New', monospace;
        font-weight: 500;
        color: #374151;
        min-width: 150px;
      }

      .desc {
        font-size: 14px;
        color: #6b7280;
        flex: 1;
      }
    }
  }
}

@media (max-width: 768px) {
  .test-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .endpoint-item {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 8px !important;

    .method {
      align-self: flex-start;
    }

    .path {
      min-width: auto !important;
    }
  }
}
</style>
