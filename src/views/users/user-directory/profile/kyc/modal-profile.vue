<template>
  <a-modal
    v-model="modal_enabled"
    wrap-class-name="modal-profile"
    title="Profile Info"
    :width="width"
    :footer="false"
  >
    <z-info-row v-for="setting in INFO_LIST" :key="setting.key" :item="setting">
    </z-info-row>
  </a-modal>
</template>

<script lang="ts">
import CountriesList from "countries-list";
import ZModalMixin from "@/mixins/z-modal";
import { Component, Mixins } from "vue-property-decorator";

@Component
export default class ModalProfile extends Mixins(ZModalMixin) {
  profile?: UserProfile = null;

  get INFO_LIST() {
    return [
      {
        title: "First name",
        key: "first_name",
        value: this.profile?.first_name,
        style: "width: 45%",
        type: "input",
        edit: false
      },
      {
        title: "Last name",
        key: "last_name",
        value: this.profile?.last_name,
        style: "width: 45%",
        type: "input",
        edit: false
      },
      {
        title: "Birthday",
        key: "birthday",
        value: this.profile?.dob,
        type: "input",
        edit: false
      },
      {
        title: "Address",
        key: "address",
        value: this.profile?.address,
        type: "input",
        edit: false
      },
      {
        title: "Postcode",
        key: "postcode",
        value: this.profile?.postcode,
        style: "width: 30%",
        type: "input",
        edit: false
      },
      {
        title: "City",
        key: "city",
        value: this.profile?.city,
        style: "width: 30%",
        type: "input",
        edit: false
      },
      {
        title: "Country",
        key: "country",
        value: CountriesList?.countries[this.profile?.country]?.name,
        style: "width: 30%",
        type: "input",
        edit: false
      },
      {
        title: "State",
        key: "state",
        value: this.profile?.state.toUpperCase(),
        type: "input",
        style: "width: 45%",
        edit: false
      },
      {
        title: "Date",
        key: "created_at",
        value: this.profile?.created_at,
        type: "input",
        style: "width: 45%",
        edit: false
      }
    ];
  }

  onCreate(profile: UserProfile) {
    this.profile = profile;
  }
}
</script>
