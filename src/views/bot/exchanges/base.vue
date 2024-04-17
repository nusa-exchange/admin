<template>
  <div class="page-bot-exchanges">
    <z-table
      :loading="exchanges.loading"
      :columns="COLUMN"
      :data="exchanges.data"
      :hover="true"
      :scroll="false"
      :pagination="false"
      @click="
        item =>
          this.$refs['modal-exchange'].create({
            type: 'update',
            payload: item
          })
      "
    >
      <template slot="driver" slot-scope="{ item, column }">
        <span :class="['driver', `text-${column.algin}`]">
          {{ item.driver.toUpperCase() }}
        </span>
      </template>
      <template slot="action" slot-scope="{ item, column }">
        <span :class="['action', `text-${column.algin}`]">
          <a-icon
            type="delete"
            theme="filled"
            @click.stop="delete_exchange(item.id)"
          />
        </span>
      </template>
    </z-table>
    <modal-exchange ref="modal-exchange" />
  </div>
</template>

<script lang="ts">
import ZSmartModel from "@zsmartex/z-eventbus";
import { QuantexController } from "@/controllers";
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "modal-exchange": () => import("./modal-exchange.vue")
  }
})
export default class Base extends Vue {
  COLUMN = [
    { title: "ID", key: "id", algin: "left" },
    { title: "Name", key: "name", algin: "left" },
    { title: "Driver", key: "driver", algin: "left", scopedSlots: true },
    { title: "Action", key: "action", algin: "right", scopedSlots: true }
  ];

  get exchanges() {
    return QuantexController.exchanges;
  }

  mounted() {
    this.set_action_header();
  }

  set_action_header() {
    this.$route.meta["action-header"] = [
      {
        title: "Create Exchange",
        key: "create_exchange",
        icon: "plus-circle",
        callback: () => {
          (this.$refs["modal-exchange"] as any).create({
            type: "create"
          });
        }
      }
    ];

    this.$nextTick(() => {
      ZSmartModel.emit("set-action-header");
    });
  }

  delete_exchange(id: number) {
    QuantexController.delete_exchange(id);
  }
}
</script>
