import Vue from "vue";
import VueCompositionAPI, { reactive } from "@vue/composition-api";

Vue.use(VueCompositionAPI);

export type IStoreData<T> = {
  loading: boolean;
  data: T[];
}

export interface Store {
  drivers: IStoreData<string>;
  exchanges: IStoreData<Quantex.Exchange>;
  markets: IStoreData<Quantex.Market>;
  strategies: IStoreData<Quantex.Strategy>;
  strategy_types: IStoreData<string>;
}

const store: Store = reactive<Store>({
  drivers: {
    loading: false,
    data: reactive([])
  },
  exchanges: {
    loading: false,
    data: reactive([])
  },
  markets: {
    loading: false,
    data: reactive([])
  },
  strategies: {
    loading: false,
    data: reactive([])
  },
  strategy_types: {
    loading: false,
    data: reactive([])
  }
});

export default store;
