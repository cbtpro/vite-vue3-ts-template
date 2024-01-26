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
import { http, HttpResponse } from 'msw';
import { builder } from '@/mocks/build';

export const authority = http.get(/api\/index\/authority/, () => {
  return HttpResponse.json(
    builder<IAuthority[]>([
      {
        uuid: 'e307713c-f191-43c7-9da6-c33ef193ba3a',
        roleName: 'NORMAL',
        description: '普通用户',
        updateTime: 1593193926684,
        createTime: 1593164217134,
      },
      {
        uuid: '81c33426-faf2-47f9-9256-ea5667418807',
        roleName: 'ADMIN',
        description: '超级管理员用户',
        updateTime: 1593164217183,
        createTime: 1593164217183,
      },
    ]),
  );
});
