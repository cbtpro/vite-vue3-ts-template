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

import Mock from 'mock2js';
import { builder } from '@/mock/build';

const response = (options: IMockRequestOptions) => {
  const { body } = options;
  const { username } = JSON.parse(body);
  return builder<ITest>({
    message: `你好，${username}`,
    now: Date.now(),
  });
};

Mock.mock(/\/api\/index\/test/, 'get', response);
