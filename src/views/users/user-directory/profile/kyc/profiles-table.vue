<template>
  <div class="profiles-table">
    <z-table
      :columns="COLUMN"
      :data="profiles"
      :scroll="false"
      :loading="loading"
      :pagination="false"
    >
      <template slot="state" slot-scope="{ item, column }">
        <span
          :class="[
            'state',
            `text-${column.algin}`,
            {
              'text-warn': item.state == 'SUBMITTED' || item.state == 'PENDING'
            },
            { 'text-up': item.state == 'VERIFIED' },
            { 'text-down': item.state == 'REJECTED' }
          ]"
        >
          {{ item.state }}
        </span>
      </template>
      <template slot="action" slot-scope="{ item, column }">
        <span :class="`action text-${column.algin}`">
          <template v-if="item.state.toLowerCase() == 'submitted'">
            <a-button type="danger" @click="verify_user_profile('rejected')">
              Reject
            </a-button>
            <a-button type="primary" @click="verify_user_profile('verified')">
              Verify
            </a-button>
          </template>
          <a-button @click="open_modal_info(item)">Info</a-button>
        </span>
      </template>
    </z-table>

    <modal-profile ref="modal-profile" />
  </div>
</template>

<script lang="ts">
import { VERIFY_USER_PROFILE, GET_USER_INFO } from "@/store/types";
import { getDate } from "@/mixins";
import { Vue, Component, Prop } from "vue-property-decorator";
import store from "@/store";

@Component({
  components: {
    "modal-profile": () => import("./modal-profile.vue")
  }
})
export default class ProfilesTable extends Vue {
  @Prop() readonly user_info!: User;

  loading = false;

  get profiles() {
    return this.user_info.profiles.map(profile => {
      profile.state = profile.state.toUpperCase();
      (profile as any).created_at = getDate(profile.created_at, true);

      return profile;
    });
  }

  get COLUMN() {
    return [
      { title: "First name", key: "first_name", algin: "left" },
      { title: "Last name", key: "last_name", algin: "left" },
      { title: "Address", key: "address", algin: "left" },
      { title: "State", key: "state", algin: "center", scopedSlots: true },
      { title: "Date", key: "created_at", algin: "right" },
      { title: "Action", key: "action", algin: "right", scopedSlots: true }
    ];
  }

  open_modal_info(profile: UserProfile) {
    (this.$refs["modal-profile"] as any).create(profile);
  }

  async verify_user_profile(state: string) {
    this.loading = true;

    try {
      await store.dispatch(VERIFY_USER_PROFILE, {
        uid: this.user_info.uid,
        state: state
      });
      await store.dispatch(GET_USER_INFO, this.user_info.uid);
    } catch (error) {
      return error;
    } finally {
      this.loading = false;
    }
  }
}
</script>
