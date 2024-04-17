import Store, { IStore } from "./store";
import GettersSetters from "./getters_setters";
import { applyMixins } from '../mixins';
import ZSmartModel from "@zsmartex/z-eventbus";
import ApiClient from "@zsmartex/z-apiclient";
import router from "@/router";
import { runNotice } from "@/mixins";
import { QuantexController, TradeController } from "..";
import config from "@/config";

class UserController {
  store = Store;

  constructor() {
    ZSmartModel.on("user/LOGIN", async () => {
      this.keep_session();
    });

    ZSmartModel.on("user/LOGOUT", () => {
      this.auth_error();

      router.push({ path: "/" });
  
      runNotice("success", "LOG OUT");
    })
  }

  get_session() {
    return new ApiClient("auth").get("resource/users/me");
  }

  keep_session() {
    setTimeout(async () => {
      try {
        if (this.state != "active") return;
        await this.get_session();

        this.keep_session();
      } catch (error) {
        return error;
      }
    }, 300000);
  }

  async login(payload: {
      email: string;
      password: string;
      otp_code?: string;
      captcha_response?: string;
    },
    url_callback?: string
  ) {
    this.state = "loading";

    try {
      const { data } = await new ApiClient("auth").post("identity/sessions", payload);
      await this.auth_success(data, url_callback);
    } catch (error) {
      this.auth_error();
      return error;
    }
  }

  async get_logged() {
    this.state = "loading";

    try {
      const { data } = await this.get_session();

      if (data.state === 'member') {
        throw "YOU ARE NOT ADMIN"
      }

      await this.auth_success(data);
    } catch (error) {
      this.auth_error();
      return error;
    }
  }

  async logout() {
    try {
      await new ApiClient("auth").delete("identity/sessions");
      ZSmartModel.emit("user/LOGOUT");
    } catch (error) {
      return error;
    }
  }

  private async auth_success(payload, url_callback?: string) {
    if (payload.state != "active") {
      return runNotice("error", "User not ready to use");
    }

    this.state = payload.state;
    this.email = payload.email;
    this.uid = payload.uid;
    this.role = payload.role;
    this.level = payload.level;
    this.otp = payload.otp;

    this.need2fa = false;

    if (config.finex) {
      await Promise.all([
        QuantexController.get_exchanges(),
        QuantexController.get_drivers(),
        QuantexController.get_markets(),
        QuantexController.get_strategies(),
        QuantexController.get_strategy_types(),
        TradeController.get_blockchains()
      ]);
    }

    if (payload.csrf_token) localStorage.setItem("csrf_token", payload.csrf_token);

    ZSmartModel.emit("user/LOGIN");

    if (url_callback) router.push({ path: url_callback });
  }

  private auth_error() {
    this.state = null;
    localStorage.removeItem("csrf_token");
  }
}

interface UserController extends GettersSetters {
  store: IStore;
};

applyMixins(UserController, [GettersSetters]);
const class_mounted = new UserController();

export { UserController };

export default class_mounted;
