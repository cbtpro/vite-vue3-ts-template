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

import { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

export const useInterceptors = () => {
  const setCookieInterceptor = (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做些什么
    return config;
  };

  const requestErrorHandle = (error: AxiosError) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  };

  const setAuthInfoInterceptor = (config: InternalAxiosRequestConfig) => {
    return config;
  };

  const responseInterceptor = (response: AxiosResponse<IResponseBody<any>>) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
  };

  const responseErrorHandler = (error: AxiosError) => {
    const { response } = error;
    const { data } = response || {};
    return Promise.reject(new Error((data as any).message));
  };

  return {
    setCookieInterceptor,
    requestErrorHandle,
    setAuthInfoInterceptor,
    responseInterceptor,
    responseErrorHandler,
  };
};
