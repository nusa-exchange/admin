<template>
  <div class="page-accountings-operations">
    <a-tabs v-model="active_hey">
      <a-tab-pane v-for="pane in panes" :key="pane.key" :tab="pane.title">
        <operation-table :operation="operations[pane.key]" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts">
import store from "@/store";
import { getDate } from "@/mixins";
import { Vue, Component } from "vue-property-decorator";
import { reactive } from "@vue/composition-api";

interface Pane {
  title: string;
  key: string;
}

interface Operations {
  [key: string]: {
    type: string;
    loading: boolean;
    columns: any[];
    data:
      | Operation.Asset[]
      | Operation.Liability[]
      | Operation.Revenue[]
      | Operation.Expense[];
    page: number;
    total: number;
    limit: number;
    load_data(
      type: string,
      payload?: { page: number; limit: number }
    ): Promise<any>;
  };
}

@Component({
  components: {
    "operation-table": () => import("./table.vue")
  }
})
export default class PageOperation extends Vue {
  operations: Operations = {};

  panes: Pane[] = [
    { title: "Assets", key: "assets" },
    { title: "Liabilities", key: "liabilities" },
    { title: "Revenues", key: "revenues" },
    { title: "Expenses", key: "expenses" }
  ];

  columns(pane_key: string) {
    return [
      { title: "Assets ID", key: "id", algin: "left" },
      { title: "Code", key: "code", algin: "left" },
      { title: "Currency", key: "currency", algin: "left" },
      { title: "UID", key: "uid", algin: "left" },
      { title: "Ref ID", key: "rid", algin: "left" },
      { title: "Ref type", key: "reference_type", algin: "left" },
      { title: "Credit", key: "credit", algin: "left" },
      { title: "Debit", key: "debit", algin: "left" },
      { title: "Created At", key: "created_at", algin: "right" }
    ].filter(col => {
      if (col.key === "uid") {
        return pane_key === "liabilities";
      }

      return true;
    });
  }

  get active_pane() {
    const { active_hey } = this;

    return this.panes.find(pane => {
      pane.key === active_hey;
    });
  }

  get active_hey() {
    return this.$route.path.split("/")[3];
  }

  set active_hey(value: string) {
    this.$router.push(`/accountings/operations/${value}`);
  }

  mounted() {
    this.panes.forEach(pane => {
      this.operations[pane.key] = reactive({
        type: pane.key,
        loading: false,
        columns: this.columns(pane.key),
        data: [],
        page: 1,
        total: 0,
        limit: 50,
        load_data: this.get_operations
      });
    });

    if (this.$route.path == "/accountings/operations") {
      this.$router.push("/accountings/operations/assets");
    }
    this.panes.forEach(pane => {
      this.get_operations(pane.key);
    });
  }

  async get_operations(
    type: string,
    payload = {
      page: this.operations[type].page,
      limit: this.operations[type].limit
    }
  ) {
    this.operations[type].loading = true;
    try {
      const { data, headers } = await store.dispatch(
        `admin/GET_${type.toUpperCase()}`,
        payload
      );

      this.operations[type].page = Number(headers.page);
      this.operations[type].limit = Number(headers["per-page"]);
      this.operations[type].data = data.map(record => {
        record.created_at = getDate(record.created_at, true);

        return record;
      });
    } catch (error) {
      return error;
    } finally {
      console.log(type)
      this.operations[type].loading = false;
    }
  }
}
</script>
