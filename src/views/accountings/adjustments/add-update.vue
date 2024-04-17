<template>
  <div class="page-accountings-adjustments details">
    <z-configuration>
      <div class="z-edit-panel">
        <div class="z-edit-panel-content">
          <template v-if="page_type === 'add'">
            <z-info-row
              v-for="setting in SETTING_PANEL_LEFT"
              v-model="adjustment[setting.key]"
              :key="setting.key"
              :item="setting"
            >
              <template slot="counter_part_code">
                <a-input
                  :value="adjustment['currency_id']"
                  size="large"
                  placeholder="Currency"
                  style="width: 20%"
                />
                <span class="splash"></span>
                <a-select
                  v-model="adjustment['receiving_account_code']"
                  size="large"
                  style="width: 20%;"
                >
                  <a-select-option
                    v-for="code in [202, 302, 402]"
                    :value="code"
                    :key="code"
                  >
                    {{ code }}
                  </a-select-option>
                </a-select>
                <span class="splash"></span>
                <a-input
                  v-model="adjustment['receiving_member_uid']"
                  size="large"
                  placeholder="UID"
                  style="width: 35%"
                />
              </template>
            </z-info-row>
          </template>
          <template v-else>
            <z-info-row
              v-for="setting in SETTING_PANEL_LEFT"
              :value="adjustment[setting.key]"
              :key="setting.key"
              :class="setting.class"
              :item="setting"
            >
              <template slot="counter_part_code">
                <a-select
                  :value="adjustment['receiving_account_code']"
                  size="large"
                  style="width: 20%; margin-right: 20px"
                >
                  <a-select-option
                    v-for="code in [202, 302, 402]"
                    :value="code"
                    :key="code"
                  >
                    {{ code }}
                  </a-select-option>
                </a-select>
                <span
                  class="z-info-row-no-edit z-info-row-no-edit-border"
                  style="width: 35%; height: 40px; line-height: 40px;"
                >
                  {{ adjustment["receiving_member_uid"] }}
                </span>
              </template>
            </z-info-row>
          </template>
        </div>
      </div>
      <div class="z-edit-panel">
        <div class="z-edit-panel-content">
          <z-info-row
            v-for="setting in SETTING_PANEL_RIGHT"
            :value="adjustment[setting.key]"
            :key="setting.key"
            :item="setting"
            style="margin-bottom: 12px"
          />
          <a-textarea
            size="large"
            :value="adjustment['description']"
            placeholder="Adjustment description"
            allow-clear
            :auto-size="{ minRows: 5 }"
            disabled
          />
        </div>

        <div class="button-group">
          <a-button
            @click="create_adjustment"
            type="primary"
            :loading="loading"
            v-if="page_type == 'add'"
          >
            Submit
          </a-button>
          <template v-if="adjustment.state == 'pending'">
            <a-button type="danger" @click="adjustment_action('reject')">
              Reject
            </a-button>
            <a-button type="primary" @click="adjustment_action('accept')">
              Accept
            </a-button>
          </template>
        </div>
      </div>
    </z-configuration>
  </div>
</template>

<script lang="ts">
import { runNotice } from "@/mixins";
import store from "@/store";
import {
  ACTION_ADJUSTMENT,
  CREATE_ADJUSTMENT,
  GET_ADJUSTMENT,
  GET_CURRENCIES
} from "@/store/types";
import { Vue, Component, Watch } from "vue-property-decorator";

@Component
export default class AdjustmentInfo extends Vue {
  loading = false;
  adjustment: Adjustment = {
    amount: "",
    asset_account_code: 0,
    category: "",
    creator_uid: "",
    currency_id: "",
    description: "",
    reason: "",
    receiving_account_code: null,
    receiving_member_uid: ""
  };
  currencies: Currency[] = [];

  get page_type(): "add" | "update" {
    return this.$route.meta.page_type;
  }

  get id() {
    return this.$route.params.id;
  }

  get currencies_list(): { [key: string]: string } {
    return this.currencies.reduce(
      (a, b) => ((a[b.code] = b.code.toUpperCase()), a),
      {}
    );
  }

  get SETTING_PANEL_LEFT() {
    return [
      {
        title: "Reason",
        key: "reason",
        value: this.adjustment.reason,
        type: "input",
        border: true,
        style: this.page_type === "update" ? "width: 45%" : "width: 100%",
        edit: this.page_type === "add"
      },
      {
        title: "State",
        key: "state",
        value: this.adjustment.state?.toUpperCase(),
        type: "input",
        style: "width: 45%",
        class: (() => {
          if (this.adjustment.state == "pending") return "text-warn";
          if (this.adjustment.state == "accepted") return "text-up";
          if (this.adjustment.state == "rejected") return "text-down";
        })(),
        edit: false
      },
      {
        title: "Currency",
        key: "currency_id",
        value: this.adjustment.currency_id || (this.adjustment as any).currency,
        type: "select",
        list: this.currencies_list
      },
      {
        title: "Category",
        key: "category",
        value: this.adjustment.category,
        type: "select",
        list: [
          "asset_registration",
          "investment",
          "minting_token",
          "balance_anomaly",
          "misc",
          "refund",
          "compensation",
          "incentive",
          "bank_fees",
          "bank_interest",
          "minor"
        ].reduce((acc, curr) => ((acc[curr] = curr), acc), {})
      },
      {
        title: "Amount",
        key: "amount",
        value: this.adjustment.amount,
        border: true,
        type: "input",
        edit: this.page_type === "add"
      },
      {
        title: "Asset code",
        key: "asset_account_code",
        value: this.adjustment.asset_account_code,
        border: true,
        type: "input",
        edit: false
      },
      { title: "Counterpart code", key: "counter_part_code", type: "slot" },
      {
        title: "Creator ID",
        key: "creator_uid",
        value: this.adjustment.creator_uid,
        border: true,
        algin: "left",
        type: "input",
        edit: false
      },
      {
        title: "Validator ID",
        key: "validator_uid",
        value: this.adjustment.validator_uid,
        border: true,
        algin: "left",
        type: "input",
        edit: false
      }
    ].filter(setting => {
      if (this.page_type === "add") {
        return !["state", "creator_uid"].includes(setting.key);
      }

      return true;
    });
  }

  get SETTING_PANEL_RIGHT() {
    return [
      {
        title: "Created At",
        key: "created_at",
        value: this.adjustment.created_at,
        type: "input",
        style: "width: 50%"
      },
      {
        title: "Updated At",
        key: "updated_at",
        value: this.adjustment.updated_at,
        type: "input",
        style: "width: 50%"
      }
    ].filter(() => this.page_type !== "add");
  }

  async mounted() {
    this.loading = true;
    await this.get_currencies();
    if (this.page_type === "update") await this.get_adjustment();
    this.loading = false;
  }

  async get_adjustment() {
    try {
      const { data } = await store.dispatch(GET_ADJUSTMENT, this.id);
      this.adjustment = data;
    } catch (error) {
      return error;
    }
  }

  async get_currencies() {
    try {
      const { data } = await store.dispatch(GET_CURRENCIES, { limit: 100 });
      this.currencies = data;
    } catch (error) {
      return error;
    }
  }

  async create_adjustment() {
    this.loading = true;
    try {
      await store.dispatch(CREATE_ADJUSTMENT, this.adjustment);

      runNotice("success", "Create adjustment successfully");
      this.$router.push("/accountings/adjustments");
    } catch (error) {
      return error;
    } finally {
      this.loading = false;
    }
  }

  async adjustment_action(action: "accept" | "reject") {
    this.loading = true;
    try {
      await store.dispatch(ACTION_ADJUSTMENT, {
        id: this.adjustment.id,
        action: action
      });

      await this.get_adjustment();
    } catch (error) {
      return error;
    } finally {
      this.loading = false;
    }
  }

  @Watch("adjustment.currency_id")
  onCurrencyIdChanged(currency_id: string) {
    const currency = this.currencies.find(c => c.code == currency_id);

    if (!currency) return;

    this.adjustment.asset_account_code = currency.type == "fiat" ? 101 : 102;
  }
}
</script>

<style lang="less">
.z-info-row {
  &-counter_part_code {
    .z-info-row-content {
      position: relative;
      align-items: center;
    }
  }

  .splash {
    background-color: #ccc;
    height: 2px;
    width: 16px;
  }
}

.z-edit-panel {
  .button-group {
    position: absolute !important;
    right: 20px;
    bottom: 10px;

    > * {
      margin: 0 4px;
    }
  }
}
</style>
