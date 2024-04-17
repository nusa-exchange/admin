<template>
  <a-modal
    v-model="modal_enabled"
    wrap-class-name="modal-flow"
    :title="title"
    :width="width"
    :footer="false"
  >
    <z-info-row
      v-for="setting in SETTING_LIST"
      :key="setting.key"
      :item="setting"
      v-model="modal_payload[setting.key]"
    />
    <z-info-row
      v-for="setting in SETTING_OPTIONS_LIST"
      :key="setting.key"
      :item="setting"
      v-model="modal_payload.options[setting.key]"
    />

    <a-button
      type="primary"
      :loading="loading"
      :disabled="button_disabled"
      @click="onSubmit"
    >
      {{ button_string }}
    </a-button>
  </a-modal>
</template>

<script lang="ts">
import ZModalMixin from "@/mixins/z-modal";
import { QuantexController } from "@/controllers";
import { Component, Mixins } from "vue-property-decorator";

type ModalType = "edit" | "new";

@Component
export default class ModalExchange extends Mixins(ZModalMixin) {
  loading = false;
  modal_type?: ModalType = null;
  modal_payload: Quantex.StrategyFlow = {
    options: {}
  };
  strategy: Quantex.Strategy = {};

  get title() {
    return this.modal_type === "edit"
      ? "Edit Strategy Flow"
      : "Create Strategy Flow";
  }

  get SETTING_LIST() {
    return [
      {
        title: "Period",
        key: "period",
        value: this.modal_payload?.period,
        type: "input",
        edit: true,
      },
      {
        title: "State",
        key: "state",
        value: this.modal_payload.state,
        type: "select",
        list: {
          enabled: "Enabled",
          disabled: "Disabled",
        },
      },
    ];
  }

  get SETTING_OPTIONS_LIST() {
    return [
      {
        title: "First Spread",
        key: "first_spread",
        value: this.modal_payload?.options?.first_spread,
        type: "input",
        edit: true,
      },
      {
        title: "Spread",
        key: "spread",
        value: this.modal_payload?.options?.spread,
        type: "input",
        edit: true,
      },
      {
        title: "Levels Size",
        key: "levels_size",
        value: this.modal_payload?.options?.levels_size,
        type: "input",
        edit: true,
      },
      {
        title: "Levels Count",
        key: "levels_count",
        value: this.modal_payload?.options?.levels_count,
        type: "input",
        edit: true,
      },
      {
        title: "Levels Start",
        key: "levels_start",
        value: this.modal_payload?.options?.levels_start,
        type: "input",
        edit: true
      },
      {
        title: "Update Chance",
        key: "update_chance",
        value: this.modal_payload?.options?.update_chance,
        type: "input",
        edit: true
      }
    ].filter(item => {
      if (this.strategy.type == "trade" && item.key == "first_spread") {
        return false;
      } else if (this.strategy.type == "trade" && item.key == "spread") {
        return false;
      } else if (this.strategy.type == "trade" && item.key == "levels_count") {
        return false;
      } else if (this.strategy.type == "trade" && item.key == "levels_start") {
        return false;
      } else if (
        this.strategy.type == "fixed_trade" &&
        item.key == "first_spread"
      ) {
        return false;
      } else if (this.strategy.type == "fixed_trade" && item.key == "spread") {
        return false;
      } else if (
        this.strategy.type == "fixed_trade" &&
        item.key == "levels_size"
      ) {
        return false;
      } else if (
        this.strategy.type == "fixed_trade" &&
        item.key == "levels_count"
      ) {
        return false;
      } else if (
        this.strategy.type == "fixed_trade" &&
        item.key == "levels_start"
      ) {
        return false;
      } else if (
        this.strategy.type == "market_making" &&
        item.key == "levels_size"
      ) {
        return false;
      } else if (
        this.strategy.type == "market_making" &&
        item.key == "levels_start"
      ) {
        return false;
      } else if (this.strategy.type == "copy" && item.key == "first_spread") {
        return false;
      }

      if (
        this.strategy.type != "market_making" &&
        item.key == "update_chance"
      ) {
        return false;
      }

      return true;
    });
  }

  get button_disabled() {
    return this.loading;
  }

  get button_string() {
    return this.modal_type === "edit" ? "Edit" : "Create";
  }

  onCreate(payload: {
    type: ModalType;
    payload: Quantex.StrategyFlow;
    strategy: Quantex.Strategy;
  }) {
    this.modal_type = payload.type;
    if (this.modal_type == "edit") {
      this.modal_payload = payload.payload;
    } else {
      this.modal_payload = {
        options: {},
      };
    }
    this.strategy = payload.strategy;
  }

  async onSubmit() {
    this.loading = true;
    const payload: Quantex.StrategyFlow = {
      strategy_id: this.strategy.id,
      period: Number(this.modal_payload.period),
      options: {
        spread: this.modal_payload.options.spread || null,
        first_spread: this.modal_payload.options.first_spread || null,
        levels_size: this.modal_payload.options.levels_size || null,
        levels_count: Number(this.modal_payload.options.levels_count) || null,
        levels_start: Number(this.modal_payload.options.levels_start) || null,
        update_chance: Number(this.modal_payload.options.update_chance) || null
      },
      state: this.modal_payload.state
    };

    try {
      if (this.modal_type == "edit") {
        payload.id = this.modal_payload.id;
        await QuantexController.update_strategy_flow(payload);
      } else {
        await QuantexController.create_strategy_flow(payload);
      }
      this.delete();
    } catch (error) {
      return error;
    } finally {
      this.loading = false;
    }
  }
}
</script>

<style lang="less">
.modal-flow {
  .ant-modal-body {
    button {
      margin-top: 12px;
      width: 100%;
    }
  }
}
</style>
