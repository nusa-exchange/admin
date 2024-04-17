import { runNotice } from "@/mixins";
import { MutationTree } from "vuex";

const mutations: MutationTree<AdminState> = {
  SET_METRICS(state, payload) {
    state.metrics = payload;
  },
  SET_USER_INFO(state, payload) {
    state.user_info = payload;
  },
  UPDATE_USER_INFO(state, payload) {
    const { user_info } = state;
    if (!user_info) return;

    if (Object.hasOwnProperty.call(payload, "otp")) {
      runNotice("success", "User otp updated successfully");
      user_info.otp = payload.otp;
    } else if (Object.hasOwnProperty.call(payload, "state")) {
      runNotice("success", "User state updated successfully");
      user_info.state = payload.state;
    }
  },
  UPDATE_USER_ROLE(state, payload) {
    runNotice("success", "User role updated successfully");

    const { user_info } = state;
    if (!user_info) return;

    if (Object.hasOwnProperty.call(payload, "role")) {
      user_info.role = payload.role;
    }
  },
  UPDATE_MEMBER_INFO(state) {
    runNotice("success", "User group updated successfully");
  },
  SET_BLOCKCHAIN_CLIENTS(state, payload) {
    state.clients = payload;
  },
  SET_WALLET_KINDS(state, payload) {
    state.kinds =  payload;
  },
  SET_WALLET_GATEWAYS(state, payload) {
    state.gateways = payload;
  }
};

export default mutations;
