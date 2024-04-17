const routes = [
  {
    name: "Dashboard",
    path: "/",
    meta: { user: true },
    component: () => import("@/views/dashboard/base.vue"),
    children: [
      {
        name: "Dashboard",
        path: "dashboard",
        component: () => import("@/layouts/page-view.vue"),
        children: [
          {
            name: "Analysis",
            path: "analysis",
            component: () => import("@/views/dashboard/analysis/base.vue")
          }
        ]
      },
      {
        name: "Users",
        path: "users",
        component: () => import("@/views/users/base.vue"),
        children: [
          {
            name: "User Directorys",
            path: "user-directory",
            component: () => import("@/views/users/user-directory/base.vue")
          },
          {
            name: "User Directory",
            path: "user-directory/:uid",
            component: () =>
              import("@/views/users/user-directory/profile/base.vue")
          },
          {
            name: "Operators",
            path: "operators",
            component: () => import("@/views/users/operators/base.vue")
          },
          {
            name: "Pending Applications",
            path: "pending",
            component: () => import("@/views/users/pending/base.vue")
          },
          {
            name: "Pending Applications",
            path: "pending/:name",
            component: () => import("@/views/users/pending/base.vue")
          }
        ]
      },
      {
        name: "Exchange",
        path: "exchange",
        component: () => import("@/views/exchange/base.vue"),
        children: [
          {
            name: "Currencies",
            path: "currencies",
            component: () => import("@/views/exchange/currencies/base.vue")
          },
          {
            name: "Create Currency",
            path: "currencies/create",
            meta: { type: "create", parent: "Currencies" },
            component: () => import("@/views/exchange/currencies/create-update.vue")
          },
          {
            name: "Update Currency",
            path: "currencies/:code",
            meta: { type: "update", parent: "Currencies" },
            component: () => import("@/views/exchange/currencies/create-update.vue")
          },
          {
            name: "Create Currency Network",
            path: "currencies/:code/networks/create",
            meta: { type: "create", parent: "Update Currency" },
            component: () =>
              import("@/views/exchange/currencies/blockchain-currency.vue")
          },
          {
            name: "Update Currency Network",
            path: "currencies/:code/networks/:id",
            meta: { type: "update", parent: "Update Currency" },
            component: () =>
              import("@/views/exchange/currencies/blockchain-currency.vue")
          },
          {
            name: "Markets",
            path: "markets",
            component: () => import("@/views/exchange/markets/base.vue")
          },
          {
            name: "Create Market",
            path: "markets/create",
            meta: { type: "new", parent: "Markets" },
            component: () => import("@/views/exchange/markets/create.vue")
          },
          {
            name: "Update Market",
            path: "markets/:market",
            meta: { type: "update", parent: "Markets" },
            component: () => import("@/views/exchange/markets/info/base.vue")
          },
          {
            name: "Tokenization",
            path: "ieo",
            component: () => import("@/views/exchange/ieo/base.vue")
          },
          {
            name: "Create New Token",
            path: "ieo/create",
            meta: { type: "create", parent: "IEO" },
            component: () => import("@/views/exchange/ieo/create-update.vue")
          },
          {
            name: "Update IEO",
            path: "ieo/:id",
            meta: { type: "update", parent: "IEO" },
            component: () => import("@/views/exchange/ieo/create-update.vue")
          },
          {
            name: "Orders",
            path: "orders",
            component: () => import("@/views/exchange/orders/base.vue")
          },
          {
            name: "Trades",
            path: "trades",
            component: () => import("@/views/exchange/trades/base.vue")
          }
        ]
      },
      {
        name: "Accountings",
        path: "accountings",
        component: () => import("@/views/accountings/base.vue"),
        children: [
          {
            name: "Deposits",
            path: "deposits",
            component: () => import("@/views/accountings/deposits/base.vue"),
          },
          {
            name: "Details",
            path: "deposits/:tid/details",
            meta: { parent: "Deposits" },
            component: () => import("@/views/accountings/deposits/details.vue"),
          },
          {
            name: "Withdrawals",
            path: "withdrawals",
            meta: { page_type: "normal" },
            component: () => import("@/views/accountings/withdrawals/base.vue"),
          },
          {
            name: "Details",
            path: "withdrawals/:id/details",
            meta: { page_type: "Withdrawals" },
            component: () => import("@/views/accountings/withdrawals/details.vue"),
          },
          {
            name: "Withdrawals Pending",
            path: "withdrawals-pending",
            meta: { page_type: "pending" },
            component: () => import("@/views/accountings/withdrawals/base.vue"),
          },
          {
            name: "Details",
            path: "withdrawals-pending/:id/details",
            component: () => import("@/views/accountings/withdrawals/details.vue"),
          },
          {
            name: "Adjustments",
            path: "adjustments",
            component: () => import("@/views/accountings/adjustments/base.vue"),
          },
          {
            name: "Add Adjustment",
            path: "adjustments/add",
            meta: { page_type: "add", name: "Adjustments" },
            component: () => import("@/views/accountings/adjustments/add-update.vue"),
          },
          {
            name: "Adjustment",
            path: "adjustments/:id",
            meta: { page_type: "update", name: "Adjustments" },
            component: () => import("@/views/accountings/adjustments/add-update.vue"),
          },
          {
            name: "Operations",
            path: "operations",
            component: () => import("@/views/accountings/operations/base.vue")
          },
          {
            name: "Operation",
            path: "operations/:name",
            meta: { name: "Operations" },
            component: () => import("@/views/accountings/operations/base.vue")
          }
        ]
      },
      {
        name: "Settings",
        path: "settings",
        component: () => import("@/views/settings/base.vue"),
        children: [
          {
            name: "Blockchains",
            path: "blockchains",
            component: () => import("@/views/settings/blockchains/base.vue"),
          },
          {
            name: "Create Blockchain",
            path: "blockchains/create",
            meta: { type: "create", parent: "Blockchains" },
            component: () =>
              import("@/views/settings/blockchains/create-update.vue")
          },
          {
            name: "Update Blockchain",
            path: "blockchains/:id/update",
            meta: { type: "update", parent: "Blockchains" },
            component: () =>
              import("@/views/settings/blockchains/create-update.vue")
          },
          {
            name: "Wallets",
            path: "wallets",
            component: () => import("@/views/settings/wallets/base.vue"),
          },
          {
            name: "Update Wallet",
            path: "wallets/:id/update",
            meta: { type: "update", parent: "Wallets" },
            component: () => import("@/views/settings/wallets/create-update.vue"),
          },
          {
            name: "Create Wallet",
            path: "wallets/create",
            meta: { type: "create", parent: "Wallets" },
            component: () => import("@/views/settings/wallets/create-update.vue"),
          },
          {
            name: "Fees Schedules",
            path: "fees-schedules",
            component: () => import("@/views/settings/fees-schedules/base.vue"),
          },
          {
            name: "Permissions",
            path: "permissions",
            component: () => import("@/views/settings/permissions/base.vue"),
          },
          {
            name: "Restrictions",
            path: "restrictions",
            component: () => import("@/views/settings/restrictions/base.vue"),
          },
          {
            name: "Whitelisted Smart Contract",
            path: "whitelisted-smart-contract",
            component: () =>
              import("@/views/settings/whitelisted-smart-contract/base.vue")
          },
          {
            name: "Banners",
            path: "banners",
            component: () => import("@/views/settings/banners/base.vue"),
          },
          {
            name: "Broadcasts",
            path: "broadcasts",
            component: () => import("@/views/settings/broadcasts/base.vue")
          }
        ]
      },
      {
        name: "Bot",
        path: "bot",
        component: () => import("@/views/settings/base.vue"),
        children: [
          {
            name: "Exchanges",
            path: "exchanges",
            component: () => import("@/views/bot/exchanges/base.vue"),
          },
          {
            name: "Markets",
            path: "markets",
            component: () => import("@/views/bot/markets/base.vue"),
          },
          {
            name: "Strategies",
            path: "strategies",
            component: () => import("@/views/bot/strategies/base.vue"),
          },
          {
            name: "Create Strategy",
            path: "strategies/create",
            meta: { type: "create", parent: "Strategies" },
            component: () => import("@/views/bot/strategies/create-update.vue"),
          },
          {
            name: "Update Strategy",
            path: "strategies/:id",
            meta: { type: "update", parent: "Strategies" },
            component: () => import("@/views/bot/strategies/create-update.vue"),
          },
        ]
      }
    ]
  },
  {
    path: "/login",
    component: () => import("@/views/login.vue"),
    meta: { guest: true }
  },
  {
    path: "/*",
    component: () => import("@/views/404.vue")
  }
];

export default routes;
