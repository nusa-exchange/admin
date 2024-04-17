<template>
  <div class="documents-table">
    <z-table
      :columns="COLUMN"
      :data="documents"
      :scroll="false"
      :loading="loading"
      :pagination="false"
    >
      <template slot="front_upload" slot-scope="{ item, column }">
        <a
          :href="item.front_upload.url"
          target="document"
          :class="['front_upload', `text-${column.algin}`]"
        >
          Link
        </a>
      </template>
      <template slot="back_upload" slot-scope="{ item, column }">
        <a
          :href="item.back_upload.url"
          target="document"
          :class="['back_upload', `text-${column.algin}`]"
        >
          Link
        </a>
      </template>
      <template slot="hand_in_upload" slot-scope="{ item, column }">
        <a
          :href="item.hand_in_upload.url"
          target="document"
          :class="['hand_in_upload', `text-${column.algin}`]"
        >
          Link
        </a>
      </template>
      <template slot="state" slot-scope="{ item, column }">
        <span
          :class="[
            'state',
            `text-${column.algin}`,
            {
              'text-up': item.state == 'verified',
              'text-down': item.state == 'rejected',
              'text-warn': item.state == 'pending'
            }
          ]"
        >
          {{ item.state.toUpperCase() }}
        </span>
      </template>
      <template slot="action" slot-scope="{ item, column }">
        <span :class="['action', `text-${column.algin}`]">
          <template v-if="item.state == 'pending'">
            <a-button type="danger" @click="update_document_label('reject')">
              Reject
            </a-button>
            <a-button type="primary" @click="update_document_label('accept')">
              Accept
            </a-button>
          </template>
        </span>
      </template>
    </z-table>
  </div>
</template>

<script lang="ts">
import store from "@/store";
import { UPDATE_USER_LABEL, GET_DOCUMENTS } from "@/store/types";
import { Vue, Component, Prop } from "vue-property-decorator";

const groupBy = key => array =>
  array.reduce(
    (objectsByKeyValue, obj) => ({
      ...objectsByKeyValue,
      [obj[key]]: (objectsByKeyValue[obj[key]] || []).concat(obj)
    }),
    {}
  );

@Component({})
export default class DocumentsTable extends Vue {
  @Prop() readonly user_info!: User;

  loading = false;

  page = 1;
  limit = 50;

  get documents() {
    let documents: any[] = this.user_info.documents;

    documents = groupBy("identificator")(documents);
    for (const key in documents) {
      const front_upload = { ...documents[key][0]["upload"] };
      const back_upload = { ...documents[key][1]["upload"] };
      const hand_in_upload = { ...documents[key][2]["upload"] };

      documents[key] = { ...documents[key][0] };

      delete documents[key]["upload"];
      documents[key]["front_upload"] = front_upload;
      documents[key]["back_upload"] = back_upload;
      documents[key]["hand_in_upload"] = hand_in_upload;
    }

    documents = Object.values(documents) as any[];

    for (const i in documents) {
      const document = documents[i];

      if (Number(i) < documents.length - 1) {
        document.state = "rejected";
      } else {
        document.state = this.document_label.value;
      }

      documents[i] = document;
    }

    return documents;
  }

  get COLUMN() {
    return [
      { title: "Doc number", key: "doc_number", algin: "left" },
      { title: "Doc type", key: "doc_type", algin: "left" },
      {
        title: "State",
        key: "state",
        algin: "left",
        scopedSlots: true
      },
      {
        title: "Front Upload",
        key: "front_upload",
        algin: "center",
        scopedSlots: true
      },
      {
        title: "Back Upload",
        key: "back_upload",
        algin: "center",
        scopedSlots: true
      },
      {
        title: "Hand In Upload",
        key: "hand_in_upload",
        algin: "center",
        scopedSlots: true
      },
      {
        title: "Date",
        key: "created_at",
        algin: "right"
      },
      {
        title: "Action",
        key: "action",
        algin: "right",
        scopedSlots: true
      },
    ];
  }

  get document_label() {
    return this.user_info.labels.find(label => label.key == "document");
  }

  async update_document_label(action: "accept" | "reject") {
    this.loading = true;

    try {
      await store.dispatch(UPDATE_USER_LABEL, {
        uid: this.user_info.uid,
        key: "document",
        scope: "private",
        value: action == "accept" ? "verified" : "rejected",
        replace: true
      });
    } catch (error) {
      return error;
    } finally {
      this.loading = false;
    }
  }
}
</script>
