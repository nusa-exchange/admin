<template>
  <div class="page-settings-blockchains">
    <z-table
      :loading="loading"
      :columns="COLUMN"
      :data="currencies_data"
      :hover="true"
      :scroll="false"
      :pagination="true"
      :page="page"
      :page-size="limit"
      @change-pagination="get_blockchains"
      @click="on_table_click"
    >
      <template slot="status" slot-scope="{ item, column }">
        <span
          :class="
            `status text-${column.algin} ${
              item.status === 'active' ? 'text-up' : 'text-down'
            }`
          "
        >
          {{ item.status }}
        </span>
      </template>
      <template slot="action" slot-scope="{ column }">
        <span :class="`action text-${column.algin}`">
          <a-icon type="right" />
        </span>
      </template>
    </z-table>
  </div>
</template>

<script lang="ts">
import ZSmartModel from "@zsmartex/z-eventbus";
import { getDate } from "@/mixins";
import store from "@/store";
import { GET_BLOCKCHAINS } from "@/store/types";
import { Vue, Component } from "vue-property-decorator";

@Component
export default class App extends Vue {
  loading = false;
  data: Blockchain[] = [];
  page = 1;
  limit = 50;
  readonly COLUMN = [
    { title: "Id", key: "id", algin: "left" },
    { title: "key", key: "key", algin: "left" },
    { title: "Name", key: "name", algin: "left" },
    { title: "Client", key: "client", algin: "left" },
    { title: "Height", key: "height", algin: "left" },
    { title: "Created", key: "created_at", algin: "left" },
    { title: "Status", key: "status", algin: "left", scopedSlots: true },
    { title: "", key: "action", algin: "center", scopedSlots: true }
  ];

  get currencies_data() {
    return this.data.map(blockchain => {
      (blockchain.created_at as any) = getDate(blockchain.created_at as Date);

      return blockchain;
    });
  }

  set_action_header() {
    this.$route.meta["action-header"] = [
      {
        title: "Create Blockchain",
        key: "create_blockchain",
        icon: "plus-circle",
        callback: () => {
          this.$router.push("/settings/blockchains/create");
        }
      }
    ];

    this.$nextTick(() => {
      ZSmartModel.emit("set-action-header");
    });
  }

  mounted() {
    this.set_action_header();
    this.get_blockchains({
      page: this.page,
      limit: this.limit
    });
  }

  async get_blockchains(payload) {
    this.loading = true;
    try {
      const { data, headers } = await store.dispatch(GET_BLOCKCHAINS, payload);
      this.page = Number(headers.page);
      this.limit = Number(headers["per-page"]);
      this.data = data;
      this.loading = false;
    } catch (error) {
      this.loading = false;
      return error;
    }
  }

  on_table_click(item) {
    this.$router.push(`/settings/blockchains/${item.id}/update`);
  }
}
</script>
