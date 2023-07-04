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

/**
 * 测试对象
 */
interface ITest {
  /** 返回消息 */
  message: string;
  now: number;
}

/**
 * 权限对象
 */
interface IAuthority {
  uuid: string;
  roleName: string;
  description: string;
  updateTime: number;
  createTime: number;
}
