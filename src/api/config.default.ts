// Copyright 2023 Peter Chen
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { type CreateAxiosDefaults } from 'axios';
import { BASE_URL } from '@/config';

const config: CreateAxiosDefaults = {
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'X-TOKEN': '',
  },
  responseType: 'json',
};
export default config;

// 重试配置
export const RETRY_CONFIG: IRetryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  retryDelayMultiplier: 2,
  maxRetryDelay: 10000,
};

// 监控配置
export const MONITOR_CONFIG: IMonitorConfig = {
  /**
   * 仅在dev环境开启
   */
  enabled: process.env.NODE_ENV === 'development',
  /**
   * 每分钟请求次数告警阈值
   */
  warningThreshold: 10,
  /**
   * 慢请求阈值(ms)
   */
  slowRequestThreshold: 3000,
  /**
   * 统计窗口时间(ms)
   */
  statisticsWindow: 60000,
  /** 是否自动清理过期数据 */
  autoCleanup: false,
};
