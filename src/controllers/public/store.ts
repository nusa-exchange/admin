import Vue from "vue";
import VueCompositionAPI, { reactive } from "@vue/composition-api";

Vue.use(VueCompositionAPI);

export interface IStore {
  page_ready: boolean;
}

const store: IStore = reactive<IStore>({
  page_ready: false
});

export default store;
