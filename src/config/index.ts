// Copyright 2021 peter
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

/**
 * 是开发环境
 */
export const isDev = process.env.NODE_ENV === 'development';

/**
 * 请求url前缀
 */
export const BASE_URL = <string>import.meta.env.VITE_BASE_URL;

export const AMAP_SECURITY_KEY = <string>import.meta.env.VITE_AMAP_SECURITY_KEY;

export const DATE_FMT = 'YYYY-MM-DD';
export const TIME_FMT = 'YYYY-MM-DD HH:mm:ss';
