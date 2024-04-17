<template>
  <div class="page-users-pending">
    <a-tabs v-model="active_hey">
      <a-tab-pane v-for="pane in panes" :key="pane.key" :tab="pane.title">
        <pending-table :pending="pendings[pane.key]" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts">
import { getDate } from "@/mixins";
import store from "@/store";
import { GET_LABELS, GET_DOCUMENTS } from "@/store/types";
import { Vue, Component } from "vue-property-decorator";
import { reactive } from "@vue/composition-api";

interface Pane {
  title: string;
  key: string;
}

interface Pendings {
  [key: string]: {
    type: string;
    loading: boolean;
    columns: any[];
    data: UserLabel[];
    page: number;
    total: number;
    limit: number;
    load_data(
      type: string,
      payload?: { page: number; limit: number }
    ): Promise<any>;
  } | null;
}

@Component({
  components: {
    "pending-table": () => import("./table.vue")
  }
})
export default class PendingApplications extends Vue {
  page = 1;
  limit = 50;

  panes: Pane[] = [
    { title: "Profile", key: "profile" },
    { title: "Document", key: "document" }
  ];

  pendings: Pendings = reactive<Pendings>({
    profile: null,
    document: null
  });

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
    this.$router.push(`/users/pending/${value}`);
  }

  get is_root_path() {
    return this.$route.fullPath == "/users/pending";
  }

  beforeMount() {
    this.panes.forEach(pane => {
      this.pendings[pane.key] = {
        type: pane.key,
        loading: false,
        columns: this.columns(pane.key),
        data: [],
        page: 1,
        total: 0,
        limit: 50,
        load_data: this.get_labels
      };
    });
  }

  mounted() {
    if (this.is_root_path) this.$router.push("/users/pending/profile");
    this.panes.forEach(pane => {
      this.get_labels(pane.key);
    });
  }

  columns(pane_key: string) {
    return [
      { title: "Email", key: "email", algin: "left" },
      { title: "UID", key: "uid", algin: "left" },
      { title: "Level", key: "level", algin: "center" },
      { title: "OTP", key: "otp", algin: "right", scopedSlots: true },
      { title: "State", key: "state", algin: "right" },
      {
        title: "Action",
        key: "action",
        algin: "right",
        scopedSlots: true
      }
    ].filter(col => {
      return true;
    });
  }

  async get_labels(
    type: string,
    payload = {
      page: this.pendings[type].page,
      limit: this.pendings[type].limit
    }
  ) {
    if (type == "profile") {
      payload = Object.assign(payload, { key: type, value: "submitted" });
    } else {
      payload = Object.assign(payload, { key: type, value: "pending" });
    }

    this.pendings[type].loading = true;

    try {
      const { data, headers } = await store.dispatch(GET_LABELS, payload);

      this.pendings[type].page = Number(headers.page);
      this.pendings[type].limit = Number(headers["per-page"]);
      this.pendings[type].data = data.map(record => {
        record.created_at = getDate(record.created_at, true);

        return record;
      });
    } catch (error) {
      return error;
    } finally {
      this.pendings[type].loading = false;
    }
  }
}
</script>
