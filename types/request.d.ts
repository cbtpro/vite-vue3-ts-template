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

interface IResponseBody<T> {
  success: boolean;
  message: string;
  data: T;
}

interface IRetryConfig {
  maxRetries?: number;
  retryDelay?: number;
  retryDelayMultiplier?: number;
  maxRetryDelay?: number;
  retryCondition?: (error: any) => boolean;
}

interface IMonitorConfig {
  /**
   * 仅在dev环境开启
   */
  enabled: boolean;
  /**
   * 每分钟请求次数告警阈值
   */
  warningThreshold: number;
  /**
   * 慢请求阈值(ms)
   */
  slowRequestThreshold: number;
  /**
   * 统计窗口时间(ms)
   */
  statisticsWindow: number;
}

interface IRequestConfig {
  retry?: RetryConfig;
  skipMonitor?: boolean;
  [key: string]: any;
}

interface IRequestStats {
  url: string;
  count: number;
  lastRequestTime: number;
  averageResponseTime: number;
  totalResponseTime: number;
}

export interface IMonitorStats {
  [url: string]: RequestStats;
}
