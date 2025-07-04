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

import axios, { type AxiosRequestConfig } from 'axios';
import defaultConfig from './config.default';
import { useInterceptors } from './interceptors';
import { RetryHandler } from './utils/retry';
import { RequestMonitor } from './utils/monitor';
import { RequestCancelManager } from './utils/cancel';

export const useApi = () => {
  // 使用默认配置创建请求实例
  const axiosInstance = axios.create(defaultConfig);

  // 创建监控实例
  const monitor = new RequestMonitor();

  // 创建取消管理器实例
  const cancelManager = new RequestCancelManager();

  const {
    requestErrorHandle,
    responseErrorHandler,
    responseInterceptor,
    setAuthInfoInterceptor,
    setCookieInterceptor,
  } = useInterceptors();
  // 请求时添加authInfo
  axiosInstance.interceptors.request.use(setAuthInfoInterceptor);

  // 添加请求拦截器
  axiosInstance.interceptors.request.use(setCookieInterceptor, requestErrorHandle);

  // 添加响应拦截器
  axiosInstance.interceptors.response.use(responseInterceptor, responseErrorHandler);

  const request = <T>(config: IRequestConfig & AxiosRequestConfig) => {
    return new Promise<IResponseBody<T>>((resolve, reject) => {
      const startTime = Date.now();
      const { retry, skipMonitor, ...axiosConfig } = config;

      // 创建重试处理器
      const retryHandler = new RetryHandler(retry);

      // 执行请求的函数
      const executeRequest = () => {
        return axiosInstance<IResponseBody<T>>(axiosConfig);
      };

      // 使用重试机制执行请求
      retryHandler
        .execute(executeRequest)
        .then(response => {
          const responseTime = Date.now() - startTime;

          // 清理请求取消管理器中的记录
          cancelManager.handleRequestAfter(config);

          // 记录请求监控数据
          if (!skipMonitor && config.url) {
            monitor.recordRequest(config.url, responseTime);
          }

          resolve(response.data);
        })
        .catch(error => {
          const responseTime = Date.now() - startTime;

          const isCanceled = RequestCancelManager.isCancelError(error);

          // 清理请求取消管理器中的记录
          cancelManager.handleRequestAfter(config);

          // 即使失败也记录监控数据
          if (!skipMonitor && config.url) {
            monitor.recordRequest(config.url, responseTime);
          }

          // 如果是取消错误，提供更友好的错误信息
          if (isCanceled) {
            console.log(`🚫 请求已取消: ${config.method?.toUpperCase()} ${config.url}`);
          }

          reject(error);
        });
    });
  };

  // 便捷方法
  const get = <T>(url: string, config?: IRequestConfig & AxiosRequestConfig) => {
    return request<T>({ ...config, method: 'GET', url });
  };

  const post = <T>(url: string, data?: unknown, config?: IRequestConfig & AxiosRequestConfig) => {
    return request<T>({ ...config, method: 'POST', url, data });
  };

  const put = <T>(url: string, data?: unknown, config?: IRequestConfig & AxiosRequestConfig) => {
    return request<T>({ ...config, method: 'PUT', url, data });
  };

  const del = <T>(url: string, config?: IRequestConfig & AxiosRequestConfig) => {
    return request<T>({ ...config, method: 'DELETE', url });
  };

  // 监控相关方法
  const getRequestStats = (): IMonitorStats => {
    return monitor.getStats();
  };

  const getTopRequests = (limit?: number) => {
    return monitor.getTopRequests(limit);
  };

  const clearStats = () => {
    monitor.clearStats();
  };
  const manualCleanup = () => {
    monitor.manualCleanup();
  };

  // 取消相关方法
  const cancelRequest = (requestKey: string, reason?: string) => {
    return cancelManager.cancelRequest(requestKey, reason);
  };

  const cancelAllRequests = (reason?: string) => {
    return cancelManager.cancelAllRequests(reason);
  };

  const getPendingRequestCount = () => {
    return cancelManager.getPendingRequestCount();
  };

  const getPendingRequestKeys = () => {
    return cancelManager.getPendingRequestKeys();
  };

  return {
    request,
    get,
    post,
    put,
    delete: del,
    getRequestStats,
    getTopRequests,
    clearStats,
    manualCleanup,
    cancelRequest,
    cancelAllRequests,
    getPendingRequestCount,
    getPendingRequestKeys,
  };
};
