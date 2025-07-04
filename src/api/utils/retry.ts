import { RETRY_CONFIG } from '@/config';

export class RetryHandler {
  private config: Required<IRetryConfig>;

  constructor(config?: IRetryConfig) {
    this.config = {
      maxRetries: config?.maxRetries ?? (RETRY_CONFIG.maxRetries as number),
      retryDelay: config?.retryDelay ?? (RETRY_CONFIG.retryDelay as number),
      retryDelayMultiplier:
        config?.retryDelayMultiplier ?? (RETRY_CONFIG.retryDelayMultiplier as number),
      maxRetryDelay: config?.maxRetryDelay ?? (RETRY_CONFIG.maxRetryDelay as number),
      retryCondition: config?.retryCondition ?? this.defaultRetryCondition,
      strategy: config?.strategy ?? 'exponential',
      customDelayCalculator: config?.customDelayCalculator ?? this.calculateExponentialDelay,
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

  /**
   * 指数退避策略
   * 延迟时间按指数增长：baseDelay * multiplier^(attempt-1)
   */
  private calculateExponentialDelay(attempt: number): number {
    const delay = this.config.retryDelay * Math.pow(this.config.retryDelayMultiplier, attempt - 1);
    return Math.min(delay, this.config.maxRetryDelay);
  }
  /**
   * 固定间隔策略
   * 每次重试都使用相同的延迟时间
   */
  private calculateFixedDelay(attempt: number): number {
    return Math.min(this.config.retryDelay, this.config.maxRetryDelay);
  }

  /**
   * 线性增长策略
   * 延迟时间线性递增：baseDelay * attempt
   */
  private calculateLinearDelay(attempt: number): number {
    const delay = this.config.retryDelay * attempt;
    return Math.min(delay, this.config.maxRetryDelay);
  }
  /**
   * 计算重试延迟时间
   * 根据配置的策略选择相应的计算方法
   */
  private calculateDelay(attempt: number): number {
    switch (this.config.strategy) {
      case 'exponential':
        return this.calculateExponentialDelay(attempt);

      case 'fixed':
        return this.calculateFixedDelay(attempt);

      case 'linear':
        return this.calculateLinearDelay(attempt);

      case 'custom':
        if (this.config.customDelayCalculator) {
          const customDelay = this.config.customDelayCalculator(attempt, this.config.retryDelay);
          return Math.min(customDelay, this.config.maxRetryDelay);
        }
        // 如果没有提供自定义函数，回退到指数退避
        console.warn('自定义重试策略未提供计算函数，回退到指数退避策略');
        return this.calculateExponentialDelay(attempt);

      default:
        console.warn(`未知的重试策略: ${this.config.strategy}，使用指数退避策略`);
        return this.calculateExponentialDelay(attempt);
    }
  }

  /**
   * 获取策略描述信息
   */
  private getStrategyDescription(): string {
    switch (this.config.strategy) {
      case 'exponential':
        return `指数退避 (${this.config.retryDelay}ms × ${this.config.retryDelayMultiplier}^n)`;
      case 'fixed':
        return `固定间隔 (${this.config.retryDelay}ms)`;
      case 'linear':
        return `线性增长 (${this.config.retryDelay}ms × n)`;
      case 'custom':
        return '自定义策略';
      default:
        return '未知策略';
    }
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
      } catch (error: any) {
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
