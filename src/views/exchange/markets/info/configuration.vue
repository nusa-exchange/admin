<template>
  <z-configuration>
    <div class="z-edit-panel">
      <div class="z-edit-panel-head">
        <div class="z-edit-panel-title">
          <div>Setting</div>
          <div class="note">
            Last updated:
            {{
              $route.meta.type === "update" ? getDate(market.updated_at) : ""
            }}
          </div>
        </div>
        <z-info-row :item="setting_head_list">
          <template slot="state">
            <span style="margin-right: 8px">
              {{ this.market.state === "enabled" ? "Enabled" : "Disabled" }}
            </span>
            <span>
              <a-switch
                :checked="this.market.state === 'enabled'"
                @change="onStatusChanged"
              />
            </span>
          </template>
        </z-info-row>
      </div>
      <div class="z-edit-panel-content">
        <z-info-row
          v-for="setting in setting_list"
          v-model="market[setting.key]"
          :key="setting.key"
          :item="setting"
        />
        <div class="z-edit-panel-action">
          <a-button type="primary" @click="$emit('submit')">Submit</a-button>
        </div>
      </div>
    </div>
  </z-configuration>
</template>

<script lang="ts">
import { getDate } from "@/mixins";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class App extends Vue {
  @Prop() readonly market!: Market;
  @Prop() readonly setting_list!: any;

  getDate(date: Date, allow_year = true) {
    return getDate(date, allow_year);
  }

  get setting_head_list() {
    return {
      title: "Status",
      key: "state",
      value: this.market.state,
      style: "width: auto",
      style_title: "text-align: right",
      style_content:
        "justify-content: space-between;display: flex;flex-wrap: wrap",
      type: "slot"
    };
  }

  mounted() {
    this.$nextTick(() => {
      this.$forceUpdate();
    });
  }

  onStatusChanged(checked: boolean) {
    this.market.state = checked ? "enabled" : "disabled";

    this.$nextTick(() => {
      this.$forceUpdate();
    });
  }
}
</script>
