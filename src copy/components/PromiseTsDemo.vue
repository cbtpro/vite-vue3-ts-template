<!--
 Copyright 2023 Peter Chen
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
     http://www.apache.org/licenses/LICENSE-2.0
 
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
-->

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useApi } from '@/api';

const { request } = useApi();

const username = ref('勇者');
const response = ref('');
const getTest = async (username: string) => {
  return new Promise<IResponseBody<ITest>>((resolve, reject) => {
    request<ITest>({
      url: '/api/index/test',
      method: 'GET',
      data: {
        username
      }
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const onSendRequest = async () => {
  try {
    const { data } = await getTest(username.value);
    const { message, now } = data;
    response.value = `${message}， 现在时间是 ${now}`;
  } catch (error) {
    console.error(error);
    // 请求接口错误时的处理逻辑
  }
};

const authorityList = ref<IAuthority[]>([]);
const getAuthority = async () => {
  return new Promise<IResponseBody<IAuthority[]>>((resolve, reject) => {
    request<IAuthority[]>({
      url: '/api/index/authority',
      method: 'GET',
      data: {
        username
      }
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const onGetAuthorityList = async () => {
  try {
    const { data } = await getAuthority();
    authorityList.value = data;
  } catch (error) {
    console.error(error);
    // 接口请求错误时的处理
  }
};

const promiseTest = () => {
  return new Promise<string[]>((resolve, reject) => {
    setTimeout(() => {
      const random = Math.random();
      if (random > 0.7) {
        reject(['刘亦菲', '佟丽娅', '迪丽热巴'])
      } else if (random > 0.3) {
        resolve(['彭于晏', '胡歌', '张嘉译'])
      } else {
        reject(new Error('发生了异常'))
      }
    }, 300)
  });
}

const doTest = async () => {
  try {
    const list = await promiseTest();
    console.log(list);
  } catch (error) {
    console.error(error);
  }
}

onMounted(() => {
  doTest();
})

</script>

<template>
  你的名字：<input v-model="username" />
  <button @click="onSendRequest">打个招呼</button>
  <div>{{ response }}</div>

  <button @click="onGetAuthorityList">获取权限列表</button>
  <ul>
    <li v-for="(authority) in authorityList" :key="authority.uuid">
      {{ authority.roleName }} - {{ authority.description }}
    </li>
  </ul>
</template>

<style lang="less" scoped></style>
