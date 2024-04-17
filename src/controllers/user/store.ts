import Vue from "vue";
import VueCompositionAPI, { reactive } from "@vue/composition-api";

Vue.use(VueCompositionAPI);

export interface IStore {
  state?: "loading" | "active" | "pending" | "banned" | "deleted";
  email:                  string;
  uid:                    string;
  role:                   string;
  level:                  string;
  otp:                    boolean;
  need2fa:                boolean;
}

const store: IStore = reactive<IStore>({
  state: null,
  email: null,
  uid: null,
  role: null,
  level: null,
  otp: false,
  need2fa: false
});

export default store;
