import Vue from "vue";
import VueCompositionAPI, { reactive } from "@vue/composition-api";

Vue.use(VueCompositionAPI);

const store = reactive<{
  blockchains: Blockchain[]
}>({
  blockchains: []
});

export default store;
