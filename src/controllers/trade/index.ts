import ApiClient from "@zsmartex/z-apiclient";
import GettersSetters from "./getters_setters";
import Store from "./store";

class TradeController extends GettersSetters {
  store = Store;

  async get_blockchains() {
    try {
      const { data } = await new ApiClient("trade").get("admin/blockchains");
      this.blockchains = data;
    } catch (error) {
      return error;
    }
  }
}

export default new TradeController();
