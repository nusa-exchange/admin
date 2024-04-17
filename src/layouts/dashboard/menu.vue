<template>
  <a-layout-sider
    collapsible
    :collapsed="collapsed"
    :trigger="null"
    :width="250"
    style="z-index: 1;"
  >
    <div class="ant-layout-sider-logo">
      <router-link to="/dashboard/analysis">
        <img src="@/assets/img/logo.png" />
        <h4>Fortem Tech | Admin</h4>
      </router-link>
    </div>
    <a-menu
      :defaultOpenKeys="[`${isMenuSelected}`]"
      :selectedKeys="[`${isSubMenuSelected}`]"
      mode="inline"
    >
      <template v-for="(menu, mindex) in MENUS">
        <a-sub-menu v-if="menu.children" :key="`menu-${mindex}`">
          <span slot="title">
            <a-icon :type="menu.icon" />
            <span>{{ menu.name }}</span>
          </span>
          <a-menu-item
            v-for="(sub, subindex) in menu.children"
            :key="`sub-${menu.key}-${subindex}`"
          >
            <router-link
              :to="change_route(menu.path, sub.path)"
              :exact-active-class="sub.attrs['exact-active-class']"
              :active-class="sub.attrs['active-class']"
            >
              <a-icon :type="sub.icon" />
              <span>{{ sub.name }}</span>
            </router-link>
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item v-else :key="`menu-${mindex}`">
          <router-link
            :to="change_route(menu.path)"
            :exact-active-class="menu.attrs['exact-active-class']"
            :active-class="menu.attrs['active-class']"
          >
            <a-icon :type="menu.icon" />
            <span>{{ menu.name }}</span>
          </router-link>
        </a-menu-item>
      </template>
    </a-menu>
    <div class="ant-layout-sider-footer" @click="logout">
      <a-icon type="logout" /> LOGOUT
    </div>
  </a-layout-sider>
</template>

<script lang="ts">
import { UserController } from "@/controllers";
import { Vue, Component, Prop } from "vue-property-decorator";

interface MenuAttrs {
  "exact-active-class"?: string;
  "active-class"?: string;
}

interface SubMenu {
  name: string;
  icon: string;
  path: string;
  attrs?: MenuAttrs;
}

interface Menu {
  key: string;
  name: string;
  icon: string;
  path: string;
  attrs?: MenuAttrs;
  children?: SubMenu[];
}

@Component
export default class MenuComponent extends Vue {
  @Prop() private readonly collapsed!: boolean;
  private readonly MENUS: Menu[] = [
    {
      key: "dashboard",
      name: "Dashboard",
      icon: "dashboard",
      path: "dashboard",
      children: [
        {
          name: "Analysis",
          icon: "fund",
          path: "analysis",
          attrs: {
            "exact-active-class": "",
            "active-class": ""
          }
        }
      ]
    },
    {
      key: "user",
      name: "Users",
      icon: "user",
      path: "users",
      children: [
        {
          name: "Users directory",
          icon: "team",
          path: "user-directory",
          attrs: {
            "exact-active-class": "",
            "active-class": ""
          }
        },
        {
          name: "Operators",
          icon: "user",
          path: "operators",
          attrs: {
            "exact-active-class": "",
            "active-class": ""
          }
        },
        {
          name: "Pending applications",
          icon: "user",
          path: "pending",
          attrs: {
            "exact-active-class": "",
            "active-class": ""
          }
        }
      ]
    },
    {
      key: "exchange",
      name: "Exchange",
      icon: "line-chart",
      path: "exchange",
      children: [
        {
          name: "Currencies and Tokens",
          icon: "dollar",
          path: "currencies",
          attrs: {
            "exact-active-class": "",
            "active-class": ""
          }
        },
        {
          name: "Markets",
          icon: "bar-chart",
          path: "markets",
          attrs: {
            "exact-active-class": "",
            "active-class": ""
          }
        },
        {
          name: "Tokenization",
          icon: "radar-chart",
          path: "ieo",
          attrs: {
            "exact-active-class": "",
            "active-class": ""
          }
        },
        {
          name: "Orders",
          icon: "database",
          path: "orders",
          attrs: {
            "exact-active-class": "",
            "active-class": ""
          }
        },
        {
          name: "Trades",
          icon: "carry-out",
          path: "trades",
          attrs: {
            "exact-active-class": "",
            "active-class": ""
          }
        }
      ]
    },
    {
      key: "accountings",
      name: "Accountings",
      icon: "calculator",
      path: "accountings",
      children: [
        {
          name: "Deposits",
          icon: "cloud-download",
          path: "deposits",
          attrs: {
            "exact-active-class": "",
            "active-class": ""
          }
        },
        {
          name: "Withdrawals",
          icon: "cloud-upload",
          path: "withdrawals",
          attrs: {
            "exact-active-class": "",
            "active-class": ""
          }
        },
        {
          name: "Withdrawals pending",
          icon: "cloud-sync",
          path: "withdrawals-pending",
          attrs: {
            "exact-active-class": "",
            "active-class": ""
          }
        },
        {
          name: "Adjustments",
          icon: "file-sync",
          path: "adjustments",
          attrs: {
            "exact-active-class": "",
            "active-class": ""
          }
        },
        {
          name: "Operations",
          icon: "sync",
          path: "operations",
          attrs: {
            "exact-active-class": "",
            "active-class": ""
          }
        }
      ]
    },
    {
      key: "settings",
      name: "Settings",
      icon: "setting",
      path: "settings",
      children: [
        {
          name: "Blockchains",
          icon: "fork",
          path: "blockchains",
          attrs: {
            "exact-active-class": "",
            "active-class": ""
          }
        },
        {
          name: "Wallets",
          icon: "wallet",
          path: "wallets",
          attrs: {
            "exact-active-class": "",
            "active-class": ""
          }
        },
        {
          name: "Fees Schedule",
          icon: "percentage",
          path: "fees-schedules",
          attrs: {
            "exact-active-class": "",
            "active-class": ""
          }
        },
        {
          name: "Permissions",
          icon: "solution",
          path: "permissions",
          attrs: {
            "exact-active-class": "",
            "active-class": ""
          }
        },
        {
          name: "Restrictions",
          icon: "stop",
          path: "restrictions",
          attrs: {
            "exact-active-class": "",
            "active-class": ""
          }
        },
        {
          name: "Whitelisted Smart Contracts",
          icon: "down-square",
          path: "whitelisted-smart-contract",
          attrs: {
            "exact-active-class": "",
            "active-class": ""
          }
        },
        {
          name: "Banners",
          icon: "picture",
          path: "banners",
          attrs: {
            "exact-active-class": "",
            "active-class": ""
          }
        },
        {
          name: "Broadcasts",
          icon: "sound",
          path: "broadcasts",
          attrs: {
            "exact-active-class": "",
            "active-class": ""
          }
        }
      ]
    },
    {
      key: "bot",
      name: "Rover Market Maker Bot",
      icon: "stock",
      path: "bot",
      children: [
        {
          name: "Exchanges",
          icon: "line-chart",
          path: "exchanges",
          attrs: {
            "exact-active-class": "",
            "active-class": ""
          }
        },
        {
          name: "Markets",
          icon: "bar-chart",
          path: "markets",
          attrs: {
            "exact-active-class": "",
            "active-class": ""
          }
        },
        {
          name: "Strategies",
          icon: "radar-chart",
          path: "strategies",
          attrs: {
            "exact-active-class": "",
            "active-class": ""
          }
        }
      ]
    }
  ];

  get isMenuSelected() {
    const { MENUS } = this;
    const { path } = this.$route;

    return `menu-${MENUS.findIndex(menu => path.split("/")[1] === menu.path)}`;
  }

  get isSubMenuSelected() {
    const { MENUS, isMenuSelected } = this;
    const { path } = this.$route;
    const indexMenu = Number(isMenuSelected.split("menu-")[1]);

    if (!MENUS[indexMenu].children) return isMenuSelected;

    return `sub-${MENUS[indexMenu].key}-${MENUS[indexMenu].children?.findIndex(
      sub => path.split("/")[2] === sub.path
    )}`;
  }

  change_route() {
    // eslint-disable-next-line prefer-rest-params
    const args = [...(arguments as any)];

    return ["", ...args].join("/");
  }

  logout() {
    UserController.logout();
  }
}
</script>
