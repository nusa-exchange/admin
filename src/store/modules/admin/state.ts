const state: AdminState = {
  role: [
    "superadmin",
    "admin",
    "accountant",
    "compliance",
    "technical",
    "support",
    "trader",
    "member",
    "broker",
    "manager",
    "partner"
  ],
  metrics: {
    signups: {},
    sucessful_logins: {},
    failed_logins: {},
    pending_applications: 0
  },
  user_info: null,
  clients: [],
  kinds: [],
  gateways: [],
  markets: [],
  currencies: [],
  blockchains: []
};

export default state;
