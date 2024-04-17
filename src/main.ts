import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/assets/css";
import "@/plugins";
import { Plugin } from "@grainrigi/vue-fragment";
import CKEditor from '@ckeditor/ckeditor5-vue2';

Vue.use(Plugin);
Vue.use(CKEditor);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("body");
