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

export const pages = http.get(/api\/index\/pages/, () => {
  return HttpResponse.json(builder<number[]>([820, 932, 901, 934, 1290, 1330, 1320]));
});
