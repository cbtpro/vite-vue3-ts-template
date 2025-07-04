/**
 * 重试策略类型
 */
type RetryStrategy = 'exponential' | 'fixed' | 'linear' | 'custom';

interface IResponseBody<T> {
  code: number;
  success: boolean;
  message: string;
  data: T;
}

/**
 * 请求取消配置接口
 */
interface ICancelConfig {
  /** 是否启用重复请求取消 */
  enabled?: boolean;
  /** 请求标识符生成函数 */
  keyGenerator?: (config: AxiosRequestConfig) => string;
  /** 是否在取消时显示警告 */
  showWarning?: boolean;
  /** 自定义取消消息 */
  cancelMessage?: string;
}

/**
 * 重试配置接口
 */
interface IRetryConfig {
  /** 最大重试次数 */
  maxRetries?: number;
  /** 重试延迟时间(ms) */
  retryDelay?: number;
  /** 重试延迟倍数（仅用于指数退避） */
  retryDelayMultiplier?: number;
  /** 最大重试延迟时间(ms) */
  maxRetryDelay?: number;
  /** 重试条件判断函数 */
  retryCondition?: (error: any) => boolean;
  /** 重试策略 */
  strategy?: RetryStrategy;
  /** 自定义延迟计算函数（当strategy为'custom'时使用） */
  customDelayCalculator?: (attempt: number, baseDelay: number) => number;
}

interface IMonitorConfig {
  /**
   * 是否启用监控，仅在dev环境开启
   */
  enabled: boolean;
  /** 频繁请求告警阈值(每分钟) */
  warningThreshold: number;
  /**
   * 慢请求阈值(ms)
   */
  slowRequestThreshold: number;
  /**
   * 统计窗口时间(ms)
   */
  statisticsWindow: number;
  /** 是否自动清理过期数据 */
  autoCleanup: boolean;
}

interface IRequestConfig {
  /** 重试配置 */
  retry?: RetryConfig;
  /** 是否跳过监控 */
  skipMonitor?: boolean;
  /** 是否显示加载状态 */
  showLoading?: boolean;
  /** 是否显示错误提示 */
  showError?: boolean;
  /** 自定义错误处理 */
  customErrorHandler?: (error: AxiosError) => void;
  /** 请求标识符 */
  requestId?: string;
  /** 请求优先级 */
  priority?: 'low' | 'normal' | 'high';
  /** 取消重复请求配置 */
  cancelDuplicate?: CancelConfig | boolean;
  /** 自定义请求键（用于识别重复请求） */
  requestKey?: string;
}

interface IRequestStats {
  /** 请求URL */
  url: string;
  /** 请求次数 */
  count: number;
  /** 最后请求时间 */
  lastRequestTime: number;
  /** 平均响应时间 */
  averageResponseTime: number;
  /** 总响应时间 */
  totalResponseTime: number;
  /** 成功次数 */
  successCount: number;
  /** 失败次数 */
  errorCount: number;
  /** 最快响应时间 */
  minResponseTime: number;
  /** 最慢响应时间 */
  maxResponseTime: number;
  /** 取消次数 */
  cancelCount?: number;
}

interface IMonitorStats {
  [url: string]: RequestStats;
}

/**
 * 请求拦截器配置
 */
interface RequestInterceptorConfig {
  /** 请求前处理函数 */
  onRequest?: (config: IRequestConfig) => IRequestConfig | Promise<IRequestConfig>;
  /** 请求错误处理函数 */
  onRequestError?: (error: AxiosError) => Promise<AxiosError>;
}

/**
 * 响应拦截器配置
 */
interface ResponseInterceptorConfig {
  /** 响应成功处理函数 */
  onResponse?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
  /** 响应错误处理函数 */
  onResponseError?: (error: AxiosError) => Promise<AxiosError>;
}

/**
 * HTTP客户端配置接口
 */
interface HttpClientConfig {
  /** 基础URL */
  baseURL?: string;
  /** 超时时间 */
  timeout?: number;
  /** 默认请求头 */
  headers?: Record<string, string>;
  /** 重试配置 */
  retry?: RetryConfig;
  /** 监控配置 */
  monitor?: MonitorConfig;
  /** 请求拦截器 */
  requestInterceptors?: RequestInterceptorConfig[];
  /** 响应拦截器 */
  responseInterceptors?: ResponseInterceptorConfig[];
}

/**
 * API方法类型
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

/**
 * 请求参数类型
 */
type RequestParams = Record<string, any>;

/**
 * 请求数据类型
 */
type RequestData = Record<string, any> | FormData | string | ArrayBuffer;

/**
 * API响应类型
 */
type ApiResponse<T = any> = Promise<IResponseBody<T>>;

/**
 * 错误处理函数类型
 */
type ErrorHandler = (error: AxiosError) => void | Promise<void>;

/**
 * 请求成功回调类型
 */
type SuccessCallback<T = any> = (data: T) => void;

/**
 * 请求失败回调类型
 */
type ErrorCallback = (error: AxiosError) => void;

/**
 * 请求完成回调类型
 */
type CompleteCallback = () => void;

/**
 * 请求钩子接口
 */
interface RequestHooks<T = any> {
  onSuccess?: SuccessCallback<T>;
  onError?: ErrorCallback;
  onComplete?: CompleteCallback;
}

/**
 * 缓存配置接口
 */
interface CacheConfig {
  /** 是否启用缓存 */
  enabled: boolean;
  /** 缓存时间(ms) */
  ttl: number;
  /** 缓存键生成函数 */
  keyGenerator?: (config: IRequestConfig) => string;
  /** 缓存存储类型 */
  storage: 'memory' | 'localStorage' | 'sessionStorage';
}

/**
 * 上传进度回调类型
 */
type UploadProgressCallback = (progressEvent: ProgressEvent) => void;

/**
 * 下载进度回调类型
 */
type DownloadProgressCallback = (progressEvent: ProgressEvent) => void;

/**
 * 文件上传配置接口
 */
interface UploadConfig extends IRequestConfig {
  /** 上传进度回调 */
  onUploadProgress?: UploadProgressCallback;
  /** 文件字段名 */
  fileField?: string;
  /** 额外的表单数据 */
  formData?: Record<string, any>;
}

/**
 * 文件下载配置接口
 */
interface DownloadConfig extends IRequestConfig {
  /** 下载进度回调 */
  onDownloadProgress?: DownloadProgressCallback;
  /** 文件名 */
  filename?: string;
  /** 响应类型 */
  responseType?: 'blob' | 'arraybuffer';
}
