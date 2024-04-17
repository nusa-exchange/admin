import Vue from "vue";
import VueI18n from "vue-i18n";
import config from "@/config";

Vue.use(VueI18n);

const { messages } = config;

export const i18n = new VueI18n({
  locale: "en", // set locale
  fallbackLocale: "en", // set fallback locale
  messages
});
