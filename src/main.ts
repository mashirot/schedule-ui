import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import App from './App.vue';
import router from './router';
import axios from 'axios';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus);

// 注册 icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
library.add(fas, fab);
app.component('font-awesome-icon', FontAwesomeIcon);

// axios
axios.defaults.baseURL = "http://127.0.0.1:8080";
axios.defaults.withCredentials = true;

app.mount('#app');
