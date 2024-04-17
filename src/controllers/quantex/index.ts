import { applyMixins } from "../mixins";
import ApiClient from "@zsmartex/z-apiclient";
import GettersSetters from "./getters_setters";
import store from "./store";
import Vue from "vue";
import { runNotice } from "@/mixins";
import router from "@/router";
import path from "@antv/g2/lib/geometry/path";

export class QuantexController {
  constructor() {
    this.store = store;
  }

  async get_strategy_types() {
    try {
      this.strategy_types.loading = true;
      const { data } = await new ApiClient("quantex").get("admin/strategies/types");
      this.strategy_types.data = data;
    } catch (error) {
      return error;
    } finally {
      this.strategy_types.loading = false;
    }
  }

  async get_strategies() {
    try {
      this.strategies.loading = true;
      const { data } = await new ApiClient("quantex").get("admin/strategies");
      this.strategies.data = data;
    } catch (error) {
      return error;
    } finally {
      this.strategies.loading = false;
    }
  }

  async create_strategy(payload: Quantex.Strategy) {
    try {
      const { data } = await new ApiClient("quantex").post("admin/strategies", payload);
      data.flows ||= [];
      data.source_market_ids ||= [];
      this.strategies.data.push(data);
      runNotice("success", "Strategy created successfully");
      router.push({ path: `/bot/strategies` });
    } catch (error) {
      return error;
    }
  }

  async update_strategy(payload: Quantex.Strategy) {
    delete payload.created_at;
    delete payload.updated_at;

    const index = this.strategies.data.findIndex(strategy => strategy.id == payload.id);
    Vue.set(this.strategies.data[index], "loading", true);

    try {
      const { data } = await new ApiClient("quantex").put("admin/strategies", payload);
      Vue.set(this.strategies.data[index], "loading", false);
      Vue.set(this.strategies.data, index, data);
      runNotice("success", "Strategy updated successfully");
    } catch (error) {
      return error;
    } finally {
      Vue.delete(this.strategies.data[index], "loading");
    }
  }

  async delete_strategy(id: number) {
    const index = this.strategies.data.findIndex(strategy => strategy.id == id);
    Vue.set(this.strategies.data[index], "loading", true);

    try {
      await new ApiClient("quantex").delete(`admin/strategies/${id}`);
      const index = this.strategies.data.findIndex(strategy => strategy.id == id);

      if (index >= 0) {
        Vue.delete(this.strategies.data, index);
      }
      runNotice("success", "Strategy deleted successfully");
    } catch (error) {
      Vue.delete(this.strategies.data[index], "loading");

      return error;
    }
  }

  async reload_strategy(id: number) {
    const index = this.strategies.data.findIndex(strategy => strategy.id == id);
    Vue.set(this.strategies.data[index], "loading", true);

    try {
      await new ApiClient("quantex").post(`admin/strategies/${id}/reload`);
      runNotice("success", "Strategy reloaded successfully");
    } catch (error) {
      return error;
    } finally {
      Vue.delete(this.strategies.data[index], "loading");
    }
  }

  async copy_strategy_flows(target_strategy_id: number, source_strategy_id: number, callback: () => void) {
    const index = this.strategies.data.findIndex(strategy => strategy.id == target_strategy_id);
    Vue.set(this.strategies.data[index], "loading", true);

    try {
      const { data } = await new ApiClient("quantex").post(`admin/strategies/${target_strategy_id}/copy-flows/${source_strategy_id}`);
      Vue.set(this.strategies.data, index, data);
      runNotice("success", "Copy Strategy flows successfully");
      callback();
      router.push("/bot/strategies");
    } catch (error) {
      return error;
    } finally {
      Vue.delete(this.strategies.data[index], "loading");
    }
  }

  async create_strategy_flow(payload: Quantex.StrategyFlow) {
    const strategy_index = this.strategies.data.findIndex(strategy => strategy.id == payload.strategy_id);
    const flows = this.strategies.data[strategy_index].flows;

    try {
      const { data } = await new ApiClient("quantex").post("admin/strategies/flows", payload);
      flows.push(data);
      runNotice("success", "Strategy flow created successfully");
    } catch (error) {
      return error;
    } finally {
      Vue.delete(this.strategies.data[strategy_index], "loading");
    }
  }

  async update_strategy_flow(payload: Quantex.StrategyFlow) {
    const strategy_index = this.strategies.data.findIndex(strategy => strategy.id == payload.strategy_id);
    const flows = this.strategies.data[strategy_index].flows;
    const flow_index = flows.findIndex(flow => flow.id == payload.id);

    Vue.set(this.strategies.data[strategy_index], "loading", true);
    Vue.set(flows[flow_index], "loading", true);

    try {
      const { data } = await new ApiClient("quantex").put("admin/strategies/flows", payload);
      runNotice("success", "Strategy flow update successfully");
      Vue.set(flows, flow_index, data);
    } catch (error) {
      Vue.delete(flows[flow_index], "loading");
      return error;
    } finally {
      Vue.delete(this.strategies.data[strategy_index], "loading");
    }
  }

  async delete_strategy_flow(id: number, strategy_id: number) {
    const strategy_index = this.strategies.data.findIndex(strategy => strategy.id == strategy_id);
    const flows = this.strategies.data[strategy_index].flows;
    const flow_index = flows.findIndex(flow => flow.id == id);

    Vue.set(this.strategies.data[strategy_index], "loading", true);
    Vue.set(flows[flow_index], "loading", true);

    try {
      await new ApiClient("quantex").delete(`admin/strategies/flows/${id}`);
      Vue.delete(flows, flow_index);
    } catch (error) {
      Vue.set(flows[flow_index], "loading", false);
      return error;
    } finally {
      Vue.delete(this.strategies.data[strategy_index], "loading");
    }
  }

  async add_strategy_source_market(strategy_id: number, markets: number[], callback: () => void) {
    const strategy_index = this.strategies.data.findIndex(strategy => strategy.id == strategy_id);
    Vue.set(this.strategies.data[strategy_index], "loading", true);
    try {
      await new ApiClient("quantex").post("admin/strategies/source_markets", { id: strategy_id, markets });
      Vue.set(this.strategies.data[strategy_index], "source_markets", [ ...markets, ...this.strategies.data[strategy_index].source_markets ]);
      if (callback) callback();
    } catch (error) {
      return error;
    } finally {
      Vue.delete(this.strategies.data[strategy_index], "loading");
    }
  }

  async delete_strategy_source_market(strategy_id: number, market_id: number) {
    const strategy_index = this.strategies.data.findIndex(strategy => strategy.id == strategy_id);
    Vue.set(this.strategies.data[strategy_index], "loading", true);
    try {
      await new ApiClient("quantex").delete("admin/strategies/source_markets", { id: strategy_id, market: market_id });

      const source_market_index = this.strategies.data[strategy_index].source_markets.indexOf(market_id)
      Vue.delete(this.strategies.data[strategy_index].source_markets, source_market_index);
    } catch (error) {
      return error;
    } finally {
      Vue.delete(this.strategies.data[strategy_index], "loading");
    }
  }

  async get_markets() {
    try {
      this.markets.loading = true;
      const { data } = await new ApiClient("quantex").get("admin/markets");
      this.markets.data = data;
    } catch (error) {
      return error;
    } finally {
      this.markets.loading = false;
    }
  }

  async create_market(payload: Quantex.Market) {
    try {
      const { data } = await new ApiClient("quantex").post("admin/markets", payload);
      this.markets.data.push(data);
    } catch (error) {
      return error;
    }
  }

  async update_market(payload: Quantex.Market) {
    try {
      const { data } = await new ApiClient("quantex").put("admin/markets", payload);
      const index = this.markets.data.findIndex(market => market.id == payload.id);

      if (index >= 0) {
        Vue.set(this.markets.data, index, data);
      }
    } catch (error) {
      return error;
    }
  }

  async delete_market(id: number) {
    const index = this.markets.data.findIndex(market => market.id == id);
    Vue.set(this.markets.data[index], "loading", true);

    try {
      await new ApiClient("quantex").delete(`admin/markets/${id}`);
      const index = this.markets.data.findIndex(market => market.id == id);

      if (index >= 0) {
        Vue.delete(this.markets.data, index);
      }
    } catch (error) {
      Vue.delete(this.markets.data[index], "loading");
      return error;
    }
  }

  async get_exchanges() {
    try {
      this.exchanges.loading = true;
      const { data } = await new ApiClient("quantex").get("admin/exchanges");
      this.exchanges.data = data;
    } catch (error) {
      return error;
    } finally {
      this.exchanges.loading = false;
    }
  }

  async create_exchange(payload: Quantex.Exchange) {
    try {
      const { data } = await new ApiClient("quantex").post("admin/exchanges", payload);
      this.exchanges.data.push(data);
    } catch (error) {
      return error;
    }
  }

  async update_exchange(payload: Quantex.Exchange) {
    try {
      const { data } = await new ApiClient("quantex").put("admin/exchanges");
      const index = this.exchanges.data.findIndex(exchange => exchange.id == payload.id);

      if (index >= 0) {
        Vue.set(this.exchanges.data, index, data);
      }
    } catch (error) {
      return error;
    }
  }

  async delete_exchange(id: number) {
    const index = this.exchanges.data.findIndex(market => market.id == id);
    console.log(index, id)
    Vue.set(this.exchanges.data[index], "loading", true);

    try {
      await new ApiClient("quantex").delete(`admin/exchanges/${id}`);
      const index = this.exchanges.data.findIndex(exchange => exchange.id == id);

      if (index >= 0) {
        Vue.delete(this.exchanges.data, index);
      }
    } catch (error) {
      Vue.delete(this.markets.data[index], "loading");
      return error;
    }
  }

  async get_drivers() {
    try {
      this.drivers.loading = true;
      const { data } = await new ApiClient("quantex").get("admin/exchanges/drivers");
      this.drivers.data = data;
    } catch (error) {
      return error;
    } finally {
      this.drivers.loading = false;
    }
  }
}

export interface QuantexController extends GettersSetters {
}

applyMixins(QuantexController, [GettersSetters]);

const class_mounted = new QuantexController();

export default class_mounted;
