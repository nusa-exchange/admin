import config from "@/config";
import ApiClient from "@zsmartex/z-apiclient";
import { ActionTree } from "vuex";
import {
  CANCEL_ORDER,
  CANCEL_ORDERS,
  CREATE_BLOCKCHAIN,
  CREATE_CURRENCY,
  CREATE_MARKET,
  CREATE_PERMISSION,
  CREATE_TRADING_FEE,
  CREATE_USER_LABEL,
  CREATE_WALLET,
  DELETE_PERMISSION,
  DELETE_TRADING_FEE,
  DELETE_USER_LABEL,
  GET_ADJUSTMENT,
  GET_ADJUSTMENTS,
  GET_ASSETS,
  GET_BLOCKCHAIN,
  GET_BLOCKCHAINS,
  GET_BLOCKCHAIN_CLIENTS,
  GET_CURRENCIES,
  GET_CURRENCY,
  GET_DEPOSITS,
  GET_EXPENSES,
  GET_LIABILITIES,
  GET_MARKET,
  GET_MARKETS,
  GET_MEMBER,
  GET_METRICS,
  GET_OPERATORS,
  GET_ORDERS,
  GET_PERMISSIONS,
  GET_RESTRICTIONS,
  GET_REVENUES,
  GET_TRADES,
  GET_TRADING_FEES,
  GET_USERS,
  GET_USER_INFO,
  GET_WALLET,
  GET_WALLETS,
  GET_WALLET_GATEWAYS,
  GET_WALLET_KINDS,
  GET_WITHDRAW,
  GET_WITHDRAWS,
  SEND_WITHDRAW_ACTION,
  UPDATE_BLOCKCHAIN,
  UPDATE_CURRENCY,
  UPDATE_MARKET,
  UPDATE_MEMBER_INFO,
  UPDATE_PERMISSION,
  UPDATE_TRADING_FEE,
  UPDATE_USER_INFO,
  UPDATE_USER_LABEL,
  UPDATE_USER_ROLE,
  UPDATE_WALLET,
  GET_BANNERS,
  CREATE_BANNER,
  UPDATE_BANNER,
  GET_BROADCASTS,
  CREATE_BROADCAST,
  UPDATE_BROADCAST,
  CREATE_ADJUSTMENT,
  ACTION_ADJUSTMENT,
  GET_LABELS,
  VERIFY_USER_PROFILE,
  GET_DOCUMENTS,
  UPDATE_WALLET_CURRENCIES,
  DELETE_WALLET_CURRENCIES,
  CREATE_BLOCKCHAIN_CURRENCY,
  UPDATE_BLOCKCHAIN_CURRENCY,
  GET_WHITELISTED_SMART_CONTRACTS,
  GET_WHITELISTED_SMART_CONTRACT,
  CREATE_WHITELISTED_SMART_CONTRACT,
  UPDATE_WHITELISTED_SMART_CONTRACT,
  GET_BLOCKCHAIN_LATEST_BLOCK,
  SCAN_BLOCK,
  SEND_DEPOSIT_ACTION,
  GET_IEO_LIST,
  CREATE_IEO,
  GET_IEO,
  UPDATE_IEO,
  DELETE_IEO,
  ADD_IEO_CURRENCIES,
  REMOVE_IEO_CURRENCIES
} from "./action-types";

const actions: ActionTree<AdminState, any> = {
  async [GET_METRICS]({ commit }) {
    try {
      const { data } = await new ApiClient("auth").get("admin/metrics");
      commit("SET_METRICS", data);
    } catch (error) {
      return error;
    }
  },
  [GET_USERS](store, payload) {
    return new ApiClient("auth").get("admin/users", payload);
  },
  async [GET_USER_INFO]({ commit }, uid) {
    try {
      const { data } = await new ApiClient("auth").get("admin/users/" + uid);
      commit("SET_USER_INFO", data);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async [UPDATE_USER_INFO]({ commit }, payload) {
    try {
      await new ApiClient("auth").post("admin/users/update", payload);
      commit("UPDATE_USER_INFO", payload);
    } catch (error) {
      return error;
    }
  },
  async [CREATE_USER_LABEL]({ dispatch }, payload) {
    try {
      await new ApiClient("auth").post("admin/users/labels", payload);
      await dispatch(GET_USER_INFO, payload.uid);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async [DELETE_USER_LABEL]({ dispatch }, payload) {
    try {
      await new ApiClient("auth").delete("admin/users/labels", payload);
      await dispatch(GET_USER_INFO, payload.uid);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async [UPDATE_USER_LABEL]({ dispatch }, payload) {
    try {
      await new ApiClient("auth").post("admin/users/labels/update", payload);
      await dispatch(GET_USER_INFO, payload.uid);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  [GET_MEMBER]({ commit }, uid) {
    return new ApiClient("trade").get("admin/members/" + uid);
  },
  async [UPDATE_MEMBER_INFO]({ commit }, payload) {
    try {
      await new ApiClient("trade").put("admin/members/" + payload.uid, {
        group: payload.group,
      });

      commit("UPDATE_MEMBER_INFO", payload);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async [UPDATE_USER_ROLE]({ commit }, payload) {
    try {
      await new ApiClient("auth").post("admin/users/role", {
        uid: payload.uid,
        role: payload.role,
      });

      commit("UPDATE_USER_ROLE", payload);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  [GET_ORDERS](store, payload) {
    return new ApiClient("trade").get("admin/orders", payload);
  },
  [CANCEL_ORDERS](store, payload: { market: string; side: ZTypes.OrderSide }) {
    return new ApiClient(config.finex ? "finex" : "trade").post(
      "admin/orders/cancel",
      payload
    );
  },
  [CANCEL_ORDER](store, uuid) {
    return new ApiClient(config.finex ? "finex" : "trade").post(
      `admin/orders/${uuid}/cancel`
    );
  },
  [GET_TRADES](store, payload) {
    return new ApiClient(config.finex ? "finex" : "trade").get(
      "admin/trades",
      payload
    );
  },
  [GET_OPERATORS](store, payload) {
    return new ApiClient("auth").get("admin/activities/admin", payload);
  },
  //TODO: Make it work with mutations and state
  [GET_CURRENCIES](store, payload) {
    return new ApiClient("trade").get("admin/currencies", payload);
  },
  [GET_CURRENCY](store, code) {
    return new ApiClient("trade").get("admin/currencies/" + code);
  },
  [CREATE_CURRENCY](store, payload) {
    return new ApiClient("trade").post("admin/currencies/new", payload);
  },
  [UPDATE_CURRENCY](store, payload) {
    return new ApiClient("trade").post("admin/currencies/update", payload);
  },
  //TODO: Make it work with mutations and state
  [GET_MARKETS]({ commit, state }, payload) {
    return new ApiClient("trade").get("admin/markets", payload);
  },
  [GET_MARKET]({ commit }, market_id) {
    return new ApiClient("trade").get("admin/markets/" + market_id);
  },
  [CREATE_MARKET](store, payload) {
    return new ApiClient("trade").post("admin/markets/new", payload);
  },
  [UPDATE_MARKET]({ commit }, payload) {
    return new ApiClient("trade").post("admin/markets/update", payload);
  },
  //TODO: Make it work with mutations and state
  [GET_BLOCKCHAINS]({ commit }, payload) {
    return new ApiClient("trade").get("admin/blockchains", payload);
  },
  [GET_BLOCKCHAIN](store, id) {
    return new ApiClient("trade").get(`admin/blockchains/${id}`);
  },
  [CREATE_BLOCKCHAIN](store, payload) {
    return new ApiClient("trade").post("admin/blockchains/new", payload);
  },
  [UPDATE_BLOCKCHAIN](store, payload) {
    return new ApiClient("trade").post("admin/blockchains/update", payload);
  },
  async [GET_BLOCKCHAIN_CLIENTS]({ commit }) {
    try {
      const { data } = await new ApiClient("trade").get(
        "admin/blockchains/clients"
      );

      commit("SET_BLOCKCHAIN_CLIENTS", data);
    } catch (error) {
      return error;
    }
  },
  [GET_WALLETS](store, payload) {
    return new ApiClient("trade").get("admin/wallets", payload);
  },
  [GET_WALLET](store, id) {
    return new ApiClient("trade").get(`admin/wallets/${id}`);
  },
  async [GET_WALLET_KINDS]({ commit }) {
    try {
      const { data } = await new ApiClient("trade").get("admin/wallets/kinds");

      commit("SET_WALLET_KINDS", data);
    } catch (error) {
      return error;
    }
  },
  async [GET_WALLET_GATEWAYS]({ commit }) {
    try {
      const { data } = await new ApiClient("trade").get(
        "admin/wallets/gateways"
      );

      commit("SET_WALLET_GATEWAYS", data);
    } catch (error) {
      return error;
    }
  },
  [GET_TRADING_FEES](store, payload) {
    return new ApiClient("trade").get("admin/trading_fees", payload);
  },
  [CREATE_TRADING_FEE](store, payload) {
    return new ApiClient("trade").post("admin/trading_fees/new", payload);
  },
  [UPDATE_TRADING_FEE](store, payload) {
    return new ApiClient("trade").post("admin/trading_fees/update", payload);
  },
  [DELETE_TRADING_FEE](store, id) {
    return new ApiClient("trade").post("admin/trading_fees/delete", { id });
  },
  [GET_PERMISSIONS](store, payload) {
    return new ApiClient("auth").get("admin/permissions", payload);
  },
  [CREATE_PERMISSION](store, payload) {
    return new ApiClient("auth").post("admin/permissions", payload);
  },
  [UPDATE_PERMISSION](store, payload) {
    return new ApiClient("auth").put("admin/permissions", payload);
  },
  [DELETE_PERMISSION](store, id) {
    return new ApiClient("auth").delete("admin/permissions", { id });
  },
  [GET_ASSETS](store, payload) {
    return new ApiClient("trade").get("admin/assets", payload);
  },
  [GET_LIABILITIES](store, payload) {
    return new ApiClient("trade").get("admin/liabilities", payload);
  },
  [GET_REVENUES](store, payload) {
    return new ApiClient("trade").get("admin/revenues", payload);
  },
  [GET_EXPENSES](store, payload) {
    return new ApiClient("trade").get("admin/expenses", payload);
  },
  [GET_RESTRICTIONS](store, payload) {
    return new ApiClient("auth").get("admin/restrictions", payload);
  },
  [GET_DEPOSITS](store, payload) {
    return new ApiClient("trade").get("admin/deposits", payload);
  },
  [GET_WITHDRAWS](store, payload) {
    let url = "admin/withdraws";
    if (payload.url_extend) url = url + "?" + payload.url_extend;

    delete payload.url_extend;

    return new ApiClient("trade").get(url, payload);
  },
  [GET_WITHDRAW](store, id: number) {
    return new ApiClient("trade").get(`admin/withdraws/${id}`);
  },
  [SEND_WITHDRAW_ACTION](store, payload) {
    return new ApiClient("trade").post("admin/withdraws/actions", payload);
  },
  [GET_ADJUSTMENTS](store, payload) {
    return new ApiClient("trade").get("admin/adjustments", payload);
  },
  [GET_ADJUSTMENT](store, id) {
    return new ApiClient("trade").get(`admin/adjustments/${id}`);
  },
  [CREATE_WALLET](store, payload) {
    return new ApiClient("trade").post("admin/wallets/new", payload);
  },
  [UPDATE_WALLET](store, payload) {
    return new ApiClient("trade").post("admin/wallets/update", payload);
  },
  [GET_BANNERS](store, payload) {
    return new ApiClient("applogic").get("admin/banners", payload);
  },
  [CREATE_BANNER](store, payload) {
    return new ApiClient("applogic").post("admin/banners", payload);
  },
  [UPDATE_BANNER](store, payload) {
    return new ApiClient("applogic").put("admin/banners", payload);
  },
  [GET_BROADCASTS](store, payload) {
    return new ApiClient("applogic").get("admin/broadcasts", payload);
  },
  [CREATE_BROADCAST](store, payload) {
    return new ApiClient("applogic").post("admin/broadcasts", payload);
  },
  [UPDATE_BROADCAST](store, payload) {
    return new ApiClient("applogic").put("admin/broadcasts", payload);
  },
  [CREATE_ADJUSTMENT](store, payload) {
    return new ApiClient("trade").post("admin/adjustments/new", payload);
  },
  [ACTION_ADJUSTMENT](store, payload) {
    return new ApiClient("trade").post("admin/adjustments/action", payload);
  },
  [GET_LABELS](store, payload) {
    return new ApiClient("auth").get("admin/users/labels", payload);
  },
  [VERIFY_USER_PROFILE](store, payload) {
    return new ApiClient("auth").put("admin/profiles", payload);
  },
  [GET_DOCUMENTS](store, payload) {
    return new ApiClient("auth").get("admin/users/documents/pending", payload);
  },
  [UPDATE_WALLET_CURRENCIES](store, payload) {
    return new ApiClient("trade").post("admin/wallets/currencies", payload);
  },
  [DELETE_WALLET_CURRENCIES](store, payload) {
    return new ApiClient("trade").delete("admin/wallets/currencies", payload);
  },
  [CREATE_BLOCKCHAIN_CURRENCY](store, payload) {
    return new ApiClient("trade").post(
      "admin/blockchain_currencies/new",
      payload
    );
  },
  [UPDATE_BLOCKCHAIN_CURRENCY](store, payload) {
    return new ApiClient("trade").post(
      "admin/blockchain_currencies/update",
      payload
    );
  },
  [GET_WHITELISTED_SMART_CONTRACTS](store, payload) {
    return new ApiClient("trade").get(
      "admin/whitelisted_smart_contracts",
      payload
    );
  },
  [GET_WHITELISTED_SMART_CONTRACT](store, id) {
    return new ApiClient("trade").get(
      "admin/whitelisted_smart_contracts/#{id}".replace("#{id}", id)
    );
  },
  [CREATE_WHITELISTED_SMART_CONTRACT](store, payload) {
    return new ApiClient("trade").post(
      "admin/whitelisted_smart_contracts",
      payload
    );
  },
  [UPDATE_WHITELISTED_SMART_CONTRACT](store, payload) {
    return new ApiClient("trade").put(
      "admin/whitelisted_smart_contracts",
      payload
    );
  },
  [GET_BLOCKCHAIN_LATEST_BLOCK](store, id: number) {
    return new ApiClient("trade").get(`admin/blockchains/${id}/latest_block`);
  },
  [SCAN_BLOCK](store, payload) {
    return new ApiClient("trade").post("admin/blockchains/process_block", payload);
  },
  [SEND_DEPOSIT_ACTION](store, payload) {
    return new ApiClient("trade").post("admin/deposits/actions", payload);
  },
  [GET_IEO_LIST](store, payload) {
    return new ApiClient("finex").get("admin/ieo/list", payload);
  },
  [CREATE_IEO](store, payload) {
    return new ApiClient("finex").post("admin/ieo", payload);
  },
  [GET_IEO](store, id) {
    return new ApiClient("finex").get("admin/ieo/" + id);
  },
  [UPDATE_IEO](store, payload) {
    return new ApiClient("finex").put("admin/ieo", payload);
  },
  [DELETE_IEO](store, payload) {
    return new ApiClient("finex").delete("admin/ieo", payload);
  },
  [ADD_IEO_CURRENCIES](store, payload) {
    return new ApiClient("finex").post("admin/ieo/currencies", payload);
  },
  [REMOVE_IEO_CURRENCIES](store, payload) {
    return new ApiClient("finex").delete("admin/ieo/currencies", payload);
  }
};

export default actions;
