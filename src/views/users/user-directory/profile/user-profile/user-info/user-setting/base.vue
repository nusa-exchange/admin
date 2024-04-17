<template>
  <div class="user-setting">
    <div class="user-setting-head">
      <div class="title">Setting</div>
    </div>
    <div class="user-setting-content">
      <z-info-row
        v-for="setting in SETTING_LIST"
        :key="setting.key"
        :item="setting"
        @change="onSettingChange"
      >
        <template v-if="setting.key === 'otp'" slot="otp">
          <span>{{ setting.value ? "Enabled" : "Disabled" }}</span>
          <span>
            <a-switch
              :checked="setting.value"
              @click="
                checked => onSettingChange({ key: 'otp', value: checked })
              "
              :loading="loading == 'otp'"
            />
          </span>
        </template>
      </z-info-row>
    </div>
  </div>
</template>

<script lang="tsx">
import store from "@/store";
import {
  UPDATE_USER_INFO,
  UPDATE_MEMBER_INFO,
  UPDATE_USER_ROLE
} from "@/store/types";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class App extends Vue {
  protected loading: string | null = null;
  @Prop() readonly user_info?: User;
  @Prop({ default: null }) readonly member_info?: Member;

  get SETTING_LIST() {
    return [
      {
        title: "Status",
        key: "state",
        value: this.user_info?.state,
        type: "select",
        style: "width: 45%",
        list: {
          active: "Active",
          pending: "Pending",
          banned: "Banned",
          deleted: "Deleted"
        }
      },
      {
        title: "Referral UID",
        key: "referral_uid",
        value: this.user_info?.referral_uid,
        type: "input",
        style: "width: 45%",
        edit: true
      },
      {
        title: "Role",
        key: "role",
        value: this.user_info?.role,
        type: "select",
        style: "width: 45%",
        list: (() => {
          return store.state.admin.role.reduce((obj, rl) => {
            return {
              ...obj,
              [rl]: rl
            };
          }, {});
        })()
      },
      {
        title: "Fee group",
        key: "group",
        value: this.member_info?.group,
        type: "select",
        style: "width: 45%",
        list: {
          "vip-0": "VIP 0",
          "vip-1": "VIP 1",
          "vip-2": "VIP 2",
          "vip-3": "VIP 3"
        }
      },
      {
        title: "Authorization 2FA",
        key: "otp",
        value: this.user_info?.otp,
        type: "slot",
        style: "width: 45%",
        style_content:
          "justify-content: space-between;display: flex;flex-wrap: wrap;"
      }
    ];
  }

  async on2FASwitch(checked: boolean) {
    this.loading = "otp";
    await store.dispatch(UPDATE_USER_INFO, {
      uid: this.user_info.uid,
      otp: checked
    });
    this.loading = null;
  }

  async onStateChange(state: string) {
    this.loading = "state";
    await store.dispatch(UPDATE_USER_INFO, {
      uid: this.user_info.uid,
      state: state
    });
    this.loading = null;
  }

  async onRoleChange(role: string) {
    this.loading = "role";
    await store.dispatch(UPDATE_USER_ROLE, {
      uid: this.user_info.uid,
      role: role
    });
    this.loading = null;
  }

  async onGroupChange(group: string) {
    this.loading = "group";
    await store.dispatch(UPDATE_MEMBER_INFO, {
      uid: this.user_info.uid,
      group: group
    });
    this.loading = null;
  }

  async onOTPChange(otp: boolean) {
    if (otp == true) {
      return;
    }

    this.loading = "otp";
    await store.dispatch(UPDATE_USER_INFO, {
      uid: this.user_info.uid,
      otp: otp
    });
    this.loading = null;
  }

  onSettingChange(payload: { key: string; value: any }) {
    switch (payload.key) {
      case "state":
        this.onStateChange(payload.value);
        break;
      case "role":
        this.onRoleChange(payload.value);
        break;
      case "group":
        this.onGroupChange(payload.value);
        break;
      case "otp":
        this.onOTPChange(payload.value);
        break;
    }
  }
}
</script>
