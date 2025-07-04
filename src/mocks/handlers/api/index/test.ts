// Copyright 2021 cbtpro
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

import { http, HttpResponse } from 'msw';
import { builder } from '@/mocks/build';

export const test = http.get(/\/index\/test/, (options, ...rest) => {
  console.log(options, rest);
  const url = new window.URL(options.request.url);
  const params = new window.URLSearchParams(url.search);
  // 获取请求参数
  const username = params.get('username');
  return HttpResponse.json(
    builder<IMockTest>({
      message: `你好，${username}`,
      now: Date.now(),
    }),
  );
});
