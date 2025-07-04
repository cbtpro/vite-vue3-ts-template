// 请求取消工具
import axios from 'axios';
import type { AxiosRequestConfig, CancelTokenSource } from 'axios';

// 现在可以直接使用全局类型，无需import！
export class RequestCancelManager {
  private pendingRequests: Map<string, CancelTokenSource> = new Map();
  private defaultConfig: Required<ICancelConfig>;

  constructor(config?: ICancelConfig) {
    this.defaultConfig = {
      enabled: config?.enabled ?? true,
      keyGenerator: config?.keyGenerator ?? this.defaultKeyGenerator,
      showWarning: config?.showWarning ?? true,
      cancelMessage: config?.cancelMessage ?? '请求被取消：发起了重复请求',
    };
  }

  /**
   * 默认的请求键生成器
   * 基于请求方法、URL和参数生成唯一标识
   */
  private defaultKeyGenerator(config: AxiosRequestConfig): string {
    const { method = 'GET', url = '', params, data } = config;

    // 将参数和数据序列化为字符串
    const paramsStr = params ? JSON.stringify(params) : '';
    const dataStr = data ? JSON.stringify(data) : '';

    return `${method.toUpperCase()}:${url}:${paramsStr}:${dataStr}`;
  }

  /**
   * 生成请求键
   */
  private generateRequestKey(config: AxiosRequestConfig & IRequestConfig): string {
    // 如果提供了自定义请求键，直接使用
    if (config.requestKey) {
      return config.requestKey;
    }

    // 获取取消配置
    const cancelConfig = this.resolveCancelConfig(config.cancelDuplicate);

    // 使用配置的键生成器
    return cancelConfig.keyGenerator(config);
  }

  /**
   * 解析取消配置
   */
  private resolveCancelConfig(cancelDuplicate?: ICancelConfig | boolean): Required<ICancelConfig> {
    if (typeof cancelDuplicate === 'boolean') {
      return {
        ...this.defaultConfig,
        enabled: cancelDuplicate,
      };
    }

    if (cancelDuplicate) {
      return {
        ...this.defaultConfig,
        ...cancelDuplicate,
      };
    }

    return this.defaultConfig;
  }

  /**
   * 处理请求前的取消逻辑
   */
  handleRequestBefore(
    config: AxiosRequestConfig & IRequestConfig,
  ): AxiosRequestConfig & IRequestConfig {
    const cancelConfig = this.resolveCancelConfig(config.cancelDuplicate);

    // 如果未启用取消重复请求，直接返回
    if (!cancelConfig.enabled) {
      return config;
    }

    const requestKey = this.generateRequestKey(config);

    // 如果存在相同的请求，取消之前的请求
    if (this.pendingRequests.has(requestKey)) {
      const existingRequest = this.pendingRequests.get(requestKey)!;
      existingRequest.cancel(cancelConfig.cancelMessage);

      if (cancelConfig.showWarning) {
        console.warn(
          `🚫 取消重复请求: ${config.method?.toUpperCase()} ${config.url}\n` +
            `请求键: ${requestKey}\n` +
            `原因: 发起了新的相同请求`,
        );
      }
    }

    // 创建新的取消令牌
    const cancelTokenSource = axios.CancelToken.source();
    config.cancelToken = cancelTokenSource.token;

    // 存储到待处理请求中
    this.pendingRequests.set(requestKey, cancelTokenSource);

    return config;
  }

  /**
   * 处理请求完成后的清理逻辑
   */
  handleRequestAfter(config: AxiosRequestConfig & IRequestConfig): void {
    const cancelConfig = this.resolveCancelConfig(config.cancelDuplicate);

    if (!cancelConfig.enabled) {
      return;
    }

    const requestKey = this.generateRequestKey(config);

    // 从待处理请求中移除
    if (this.pendingRequests.has(requestKey)) {
      this.pendingRequests.delete(requestKey);
    }
  }

  /**
   * 取消指定的请求
   */
  cancelRequest(requestKey: string, reason?: string): boolean {
    if (this.pendingRequests.has(requestKey)) {
      const cancelTokenSource = this.pendingRequests.get(requestKey)!;
      cancelTokenSource.cancel(reason || '手动取消请求');
      this.pendingRequests.delete(requestKey);
      return true;
    }
    return false;
  }

  /**
   * 取消所有待处理的请求
   */
  cancelAllRequests(reason?: string): number {
    const count = this.pendingRequests.size;

    this.pendingRequests.forEach(cancelTokenSource => {
      cancelTokenSource.cancel(reason || '批量取消请求');
    });

    this.pendingRequests.clear();

    if (count > 0) {
      console.log(`🚫 已取消 ${count} 个待处理的请求`);
    }

    return count;
  }

  /**
   * 获取待处理请求的数量
   */
  getPendingRequestCount(): number {
    return this.pendingRequests.size;
  }

  /**
   * 获取所有待处理请求的键
   */
  getPendingRequestKeys(): string[] {
    return Array.from(this.pendingRequests.keys());
  }

  /**
   * 检查是否为取消错误
   */
  static isCancelError(error: any): boolean {
    return axios.isCancel(error);
  }

  /**
   * 清理过期的请求（可选的清理机制）
   */
  cleanup(): void {
    // 这里可以实现更复杂的清理逻辑，比如基于时间的清理
    // 目前简单地清空所有请求
    this.pendingRequests.clear();
  }
}
