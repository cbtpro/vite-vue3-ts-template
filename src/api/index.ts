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

import axios, { AxiosRequestConfig } from 'axios';
import defaultConfig from './config.default';
import { useInterceptors } from './interceptors';
import { RetryHandler } from './utils/retry';
import { RequestMonitor } from './utils/monitor';

export const useApi = () => {
  // 使用默认配置创建请求实例
  const axiosInstance = axios.create(defaultConfig);

  // 创建监控实例
  const monitor = new RequestMonitor();

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

  const request = <T>(config: AxiosRequestConfig & IRequestConfig) => {
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

          // 记录请求监控数据
          if (!skipMonitor && config.url) {
            monitor.recordRequest(config.url, responseTime);
          }

          resolve(response.data);
        })
        .catch(error => {
          const responseTime = Date.now() - startTime;

          // 即使失败也记录监控数据
          if (!skipMonitor && config.url) {
            monitor.recordRequest(config.url, responseTime);
          }

          reject(error);
        });
    });
  };

  // 便捷方法
  const get = <T>(url: string, config?: IRequestConfig) => {
    return request<T>({ ...config, method: 'GET', url });
  };

  const post = <T>(url: string, data?: any, config?: IRequestConfig) => {
    return request<T>({ ...config, method: 'POST', url, data });
  };

  const put = <T>(url: string, data?: any, config?: IRequestConfig) => {
    return request<T>({ ...config, method: 'PUT', url, data });
  };

  const del = <T>(url: string, config?: IRequestConfig) => {
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

  return {
    request,
    get,
    post,
    put,
    delete: del,
    getRequestStats,
    getTopRequests,
    clearStats,
  };
};
