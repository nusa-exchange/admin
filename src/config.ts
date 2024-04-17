import getUrl from "@/getUrl";
import en from "@/plugins/locales/en";
import vn from "@/plugins/locales/vn";

export default {
  api: {
    url: "/api/v2/",
    ws: {
      public: getUrl(true) + "/api/v2/ranger/public",
      private:
        getUrl(true) +
        "/api/v2/websocket/private?stream=order&stream=trade&stream=balance"
    }
  },
  messages: {
    en: en,
    vn: vn
  },
  recaptcha: {
    sitekey: "6LcrA5wUAAAAABY8KW-beaUOjShGC_U2va3kJEJt"
  },
  timeZone: "UTC",
  finex: false,
  quantex: false,
};
