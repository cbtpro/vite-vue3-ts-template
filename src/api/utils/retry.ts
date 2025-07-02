// 重试工具函数
import { RETRY_CONFIG } from '../config.default';

export class RetryHandler {
  private config: Required<IRetryConfig>;

  constructor(config?: IRetryConfig) {
    this.config = {
      maxRetries: config?.maxRetries ?? RETRY_CONFIG.maxRetries,
      retryDelay: config?.retryDelay ?? RETRY_CONFIG.retryDelay,
      retryDelayMultiplier: config?.retryDelayMultiplier ?? RETRY_CONFIG.retryDelayMultiplier,
      maxRetryDelay: config?.maxRetryDelay ?? RETRY_CONFIG.maxRetryDelay,
      retryCondition: config?.retryCondition ?? this.defaultRetryCondition,
    };
  }

  private defaultRetryCondition(error: any): boolean {
    // 网络错误
    if (!error.response) {
      return true;
    }

    // 服务器错误 (5xx)
    if (error.response.status >= 500) {
      return true;
    }

    // 请求超时
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return true;
    }

    // 特定的4xx错误也可以重试
    const retryableStatus = [408, 429, 502, 503, 504];
    return retryableStatus.includes(error.response.status);
  }

  private calculateDelay(attempt: number): number {
    const delay = this.config.retryDelay * Math.pow(this.config.retryDelayMultiplier, attempt - 1);
    return Math.min(delay, this.config.maxRetryDelay);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async execute<T>(requestFn: () => Promise<T>): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= this.config.maxRetries + 1; attempt++) {
      try {
        const result = await requestFn();

        if (attempt > 1) {
          console.log(`✅ 重试成功！第 ${attempt - 1} 次重试后请求成功`);
        }

        return result;
      } catch (error) {
        lastError = error;

        // 如果是最后一次尝试，直接抛出错误
        if (attempt === this.config.maxRetries + 1) {
          console.error(`❌ 请求失败，已重试 ${this.config.maxRetries} 次`, error);
          throw error;
        }

        // 检查是否应该重试
        if (!this.config.retryCondition(error)) {
          console.warn('⚠️ 错误不符合重试条件，停止重试', error);
          throw error;
        }

        const delay = this.calculateDelay(attempt);
        console.warn(
          `🔄 第 ${attempt} 次请求失败，${delay}ms 后进行第 ${attempt} 次重试`,
          error.message,
        );

        await this.sleep(delay);
      }
    }

    throw lastError;
  }
}
