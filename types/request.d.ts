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

interface IMonitorStats {
  [url: string]: RequestStats;
}
