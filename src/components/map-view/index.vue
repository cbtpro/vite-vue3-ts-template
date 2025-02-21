// Copyright 2021 peter // // Licensed under the Apache License, Version 2.0 (the "License"); // you
may not use this file except in compliance with the License. // You may obtain a copy of the License
at // // http://www.apache.org/licenses/LICENSE-2.0 // // Unless required by applicable law or
agreed to in writing, software // distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. // See the License for
the specific language governing permissions and // limitations under the License.
<template>
  <div class="map-view">
    <div id="container"></div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, onMounted } from 'vue';
import AMapLoader from '@amap/amap-jsapi-loader';
// import AMapLoader from '@vuemap/amap-jsapi-loader'
import { AMAP_SECURITY_KEY } from '@/config';

defineOptions({
  name: 'map-view',
});

let map: any = undefined;
const initAMap = () => {
  window._AMapSecurityConfig = {
    // serviceHost: "你的代理服务器域名或地址/_AMapService",
    //例如 ：serviceHost:'http://1.1.1.1:80/_AMapService',
    securityJsCode: AMAP_SECURITY_KEY,
  };
  AMapLoader.load({
    key: '95b013e975e8dc4750e6193a6ebd96da', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [
      'AMap.Scale',
      'AMap.ToolBar',
      'AMap.MapType',
      'AMap.ControlBar',
      'AMap.LineSearch',
      'AMap.StationSearch',
      'AMap.PolylineEditor',
      'AMap.PolygonEditor',
      'AMap.CircleEditor',
      'AMap.AutoComplete',
      'AMap.AutoComplete',
      'AMap.DistrictSearch',
      'AMap.PlaceSearch',
      'AMap.MouseTool',
    ], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    AMapUI: {
      //是否加载 AMapUI，缺省不加载
      version: '1.1', //AMapUI 版本
      plugins: ['overlay/SimpleMarker'], //需要加载的 AMapUI ui 插件
    },
    Loca: {
      //是否加载 Loca， 缺省不加载
      version: '2.0', //Loca 版本
    },
  })
    .then(AMap => {
      const options: AMap.MapOptions = {
        // 设置地图容器id
        viewMode: '3D', // 是否为3D地图模式
        pitch: 60,
        features: ['bg', 'road', 'point'],
        mapStyle: 'amap://styles/light',
        showBuildingBlock: false,
        zoom: 11, // 初始化地图级别
        center: [116.397428, 39.90923], // 初始化地图中心点位置
      };
      map = new AMap.Map('container', options);
      map.add(
        new AMap.Marker({
          position: map.getCenter(),
        }),
      );
      const building = new AMap.Buildings({
        zooms: [15, 20],
        zIndex: 10,
        heightFactor: 1.2, //2倍于默认高度，3D下有效
      });
      map.addLayer(building);
    })
    .catch(e => {
      console.error(e);
    });
};
onMounted(() => {
  initAMap();
});
onUnmounted(() => {
  map?.destroy();
});
</script>

<style lang="postcss" scoped>
.map-view {
  width: 100%;
  height: 100%;
  #container {
    width: 100%;
    height: 100%;
  }
}
</style>
