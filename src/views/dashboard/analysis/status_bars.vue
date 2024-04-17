<template>
  <div class="status-bars">
    <a-col :span="6">
      <a-card class="status-bar">
        <p class="status-title">New Signup</p>
        <p class="status-content">6</p>
      </a-card>
    </a-col>
    <a-col :span="6">
      <a-card class="status-bar">
        <p class="status-title">Login last 24h</p>
        <p class="status-content">5</p>
      </a-card>
    </a-col>
    <a-col :span="6">
      <a-card class="status-bar">
        <p class="status-title">Failed Login</p>
        <p class="status-content">2</p>
      </a-card>
    </a-col>
    <a-col :span="6">
      <a-card class="status-bar">
        <p class="status-title">Pending Applications</p>
        <p class="status-content">0</p>
      </a-card>
    </a-col>
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";

@Component({})
export default class App extends Vue {}
</script>
