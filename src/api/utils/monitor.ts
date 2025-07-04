import { MONITOR_CONFIG } from '@/config';

export class RequestMonitor {
  private stats: IMonitorStats = {};
  private enabled: boolean;
  private config: IMonitorConfig;
  private cleanupTimer?: NodeJS.Timeout;

  constructor(config?: Partial<IMonitorConfig>) {
    this.config = {
      ...MONITOR_CONFIG,
      autoCleanup: true, // 默认启用自动清理
      ...config,
    };

    this.enabled = this.config.enabled;

    if (this.enabled && this.config.autoCleanup) {
      // 启动自动清理定时器
      this.startAutoCleanup();
    }
  }

  /**
   * 启动自动清理定时器
   */
  private startAutoCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    this.cleanupTimer = setInterval(() => {
      this.cleanupExpiredStats();
    }, this.config.statisticsWindow);

    console.log(`🧹 自动清理已启用，清理间隔: ${this.config.statisticsWindow}ms`);
  }
  /**
   * 停止自动清理定时器
   */
  private stopAutoCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
      console.log('🛑 自动清理已停止');
    }
  }

  recordRequest(url: string, responseTime: number, isCanceled: boolean = false): void {
    if (!this.enabled) return;

    const now = Date.now();

    if (!this.stats[url]) {
      this.stats[url] = {
        url,
        count: 0,
        lastRequestTime: now,
        averageResponseTime: 0,
        totalResponseTime: 0,
        successCount: 0,
        errorCount: 0,
        minResponseTime: responseTime,
        maxResponseTime: responseTime,
        cancelCount: 0,
      };
    }

    const stat = this.stats[url];
    stat.count++;
    stat.lastRequestTime = now;
    if (isCanceled) {
      stat.cancelCount = (stat.cancelCount || 0) + 1;
    } else {
      stat.totalResponseTime += responseTime;
      const successfulRequests = stat.count - (stat.cancelCount || 0);
      if (successfulRequests > 0) {
        stat.averageResponseTime = stat.totalResponseTime / successfulRequests;
      }
      stat.minResponseTime = Math.min(stat.minResponseTime, responseTime);
      stat.maxResponseTime = Math.max(stat.maxResponseTime, responseTime);
    }

    // 检查是否需要告警（只对非取消的请求进行告警检查）
    if (!isCanceled) {
      this.checkForWarnings(url, responseTime);
    }
  }

  private checkForWarnings(url: string, responseTime: number): void {
    const stat = this.stats[url];

    // 检查频繁请求告警
    const recentRequests = this.getRecentRequestCount(url);
    if (recentRequests > MONITOR_CONFIG.warningThreshold) {
      console.warn(
        `⚠️ 频繁请求告警: ${url}\n` +
          `最近1分钟内请求 ${recentRequests} 次，超过阈值 ${MONITOR_CONFIG.warningThreshold}\n` +
          `建议检查是否存在重复请求或考虑添加防抖/节流机制`,
      );
    }

    // 检查慢请求告警
    if (responseTime > MONITOR_CONFIG.slowRequestThreshold) {
      console.warn(
        `🐌 慢请求告警: ${url}\n` +
          `响应时间: ${responseTime}ms，超过阈值 ${MONITOR_CONFIG.slowRequestThreshold}ms\n` +
          `平均响应时间: ${Math.round(stat.averageResponseTime)}ms`,
      );
    }
  }

  private getRecentRequestCount(url: string): number {
    // 这里简化处理，实际应该维护一个时间窗口内的请求记录
    const stat = this.stats[url];
    const now = Date.now();

    // 如果最后一次请求在统计窗口内，返回总计数
    if (now - stat.lastRequestTime < MONITOR_CONFIG.statisticsWindow) {
      return stat.count;
    }

    return 0;
  }

  private cleanupExpiredStats(): void {
    const now = Date.now();
    const expiredUrls: string[] = [];

    for (const [url, stat] of Object.entries(this.stats)) {
      if (now - stat.lastRequestTime > MONITOR_CONFIG.statisticsWindow * 2) {
        expiredUrls.push(url);
      }
    }

    expiredUrls.forEach(url => {
      delete this.stats[url];
    });

    if (expiredUrls.length > 0) {
      console.log(`🧹 清理了 ${expiredUrls.length} 个过期的请求统计记录`);
    }
  }

  /**
   * 手动清理过期统计数据
   */
  manualCleanup(): number {
    const now = Date.now();
    const expiredUrls: string[] = [];

    for (const [url, stat] of Object.entries(this.stats)) {
      if (now - stat.lastRequestTime > this.config.statisticsWindow * 2) {
        expiredUrls.push(url);
      }
    }

    expiredUrls.forEach(url => {
      delete this.stats[url];
    });

    if (expiredUrls.length > 0) {
      console.log(`🧹 手动清理了 ${expiredUrls.length} 个过期的请求统计记录`);
    }

    return expiredUrls.length;
  }

  /**
   * 更新监控配置
   */
  updateConfig(newConfig: Partial<IMonitorConfig>): void {
    const oldAutoCleanup = this.config.autoCleanup;
    this.config = { ...this.config, ...newConfig };
    this.enabled = this.config.enabled;

    // 如果自动清理配置发生变化，重新设置定时器
    if (oldAutoCleanup !== this.config.autoCleanup) {
      if (this.config.autoCleanup && this.enabled) {
        this.startAutoCleanup();
      } else {
        this.stopAutoCleanup();
      }
    }
  }

  getStats(): IMonitorStats {
    return { ...this.stats };
  }

  getTopRequests(limit: number = 10): IRequestStats[] {
    return Object.values(this.stats)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  clearStats(): void {
    this.stats = {};
    console.log('📊 请求统计数据已清空');
  }
}
