declare global {
  namespace Quantex {
    type StrategyTypeCopy = "copy";
    type StrategyTypeTrade = "trade";
    type StrategyTypeMarketMaking = "market_making";
    type StrategyTypeFixedTrade = "fixed_trade";
    type StrategyType = StrategyTypeCopy | StrategyTypeTrade | StrategyTypeMarketMaking | StrategyTypeFixedTrade;
    type StrategySideBuy = "buy";
    type StrategySideSell = "sell";
    type StrategySideBoth = "both";
    type StrategySide = StrategySideBuy | StrategySideSell | StrategySideBoth;
    type StrategyStateEnabled = "enabled";
    type StrategyStateDisabled = "disabled";
    type StrategyState = StrategyStateEnabled | StrategyStateDisabled;

    interface Strategy {
      id?: number;
      type?: StrategyType;
      side?: StrategySide;
      enable_orderback?: boolean;
      target_market?: number;
      source_markets?: number[];
      state?: StrategyState;
      flows?: StrategyFlow[];
      loading?: boolean;
      created_at?: Date;
      updated_at?: Date;
    }

    interface StrategyFlow {
      id?: number;
      strategy_id?: number;
      period?: number;
      options?: {
        first_spread?: string;
        spread?: string;
        levels_size?: string;
        levels_count?: number;
        levels_start?: number;
        update_chance?: number;
      }
      state?: StrategyState;
      loading?: boolean;
      created_at?: Date;
      updated_at?: Date;
    }

    interface Market {
      id?: number;
      symbol?: string;
      ask?: string;
      bid?: string;
      exchange_id?: number;
      min_amount?: string;
      max_amount?: string;
      price_precision?: number;
      amount_precision?: number;
      created_at?: Date;
      updated_at?: Date;
    }

    interface Exchange {
      id?: number;
      name?: string;
      driver?: string;
      created_at?: Date;
      updated_at?: Date;
    }
  }

  interface Metrics {
    signups: { [key: string]: number };
    sucessful_logins: { [key: string]: number };
    failed_logins: { [key: string]: number };
    pending_applications: number;
  }

  interface Label {
    key: string;
    value: string;
    scope: string;
    description: null;
    created_at?: Date;
    updated_at?: Date;
  }

  interface UserLabel {
    email: string;
    uid: string;
    role: string;
    level: number;
    otp: boolean;
    state: string;
    referral_uid?: string;
    data?: string;
  }

  interface UserProfile {
    first_name: string;
    last_name: string;
    dob: Date;
    address: string;
    postcode: string | number;
    city: string;
    country: string;
    state: string;
    metadata?: string;
    created_at: Date;
    updated_at: Date;
  }

  export interface Member {
    id: number;
    uid: string;
    email: string;
    level: number;
    role: string;
    group: string;
    state: string;
    accounts: Account[];
    created_at: Date;
    updated_at?: Date;
  }

  export interface Account {
    currency: string;
    balance: string;
    locked: string;
    deposit_address: string | null;
  }

  interface User {
    email: string;
    uid: string;
    role: string;
    level: number;
    otp: boolean;
    state: string;
    labels: Label[];
    phones: any[];
    profiles: UserProfile[];
    documents: any[];
    data_storages: any[];
    referral_uid: string | null;
    created_at?: Date;
    updated_at?: Date;
  }

  interface UserOrder {
    id: number;
    side: string;
    ord_type: string;
    price: string;
    avg_price: string;
    state: string;
    market: string;
    origin_volume: string;
    remaining_volume: string;
    executed_volume: string;
    trades_count: number;
    email: string;
    uid: string;
    created_at?: Date;
    updated_at?: Date;
  }

  interface UserTrade {
    id: number;
    price: string;
    amount: string;
    total: string;
    market: string;
    created_at?: Date;
    taker_type: "buy" | "sell";
    maker_order_email: string;
    maker_uid: string;
    maker_fee_amount: string;
    maker_fee_currency: string;
    taker_order_email: string;
    taker_uid: string;
    taker_fee_currency: string;
    taker_fee_amount: string;
  }

  interface UserDeposit {
    id: number;
    currency: string;
    amount: string;
    fee: string;
    txid: null | string;
    state: string;
    tid: string;
    member: number;
    uid: string;
    email: string;
    type: string;
    confirmations?: number;
    address?: string;
    txout?: number;
    block_number?: number;
    spread?: {
      to_address: string;
      amount: string;
      currency_id: string;
      status: string;
      hash: string;
    };
    completed_at: Date;
    created_at?: Date;
    updated_at?: Date;
  }

  interface Operator {
    user_ip: string;
    user_agent: string;
    topic: string;
    action: string;
    result: string;
    data: string;
    admin: {
      email: string;
      uid: string;
      role: string;
      level: number;
      otp: boolean;
      state: string;
      referral_uid: null;
      data: null;
    };
    target: null;
    created_at?: Date;
  }

  interface Market {
    id: string;
    name: string;
    base_unit: string;
    quote_unit: string;
    min_price: string;
    max_price: string;
    min_amount: string;
    amount_precision: number;
    price_precision: number;
    total_precision: number;
    state: string;
    position: number;
    created_at?: Date;
    updated_at?: Date;
  }

  interface Currency {
    id: string;
    code: string;
    name: string;
    type: "coin" | "fiat";
    description?: string;
    homepage?: string;
    price: number;
    precision: number;
    position: number;
    icon_url: string;
    networks: BlockchainCurrency[];
    status?: "enabled" | "disabled" | "hidden";
    created_at?: Date;
    updated_at?: Date;
  }

  interface BlockchainCurrency {
    id?: number;
    blockchain_key?: string;
    currency_id?: string;
    parent_id?: string;
    deposit_enabled?: boolean;
    withdrawal_enabled?: boolean;
    deposit_fee?: number;
    min_deposit_amount?: number;
    withdraw_fee?: number;
    min_withdraw_amount?: number;
    explorer_transaction?: string;
    explorer_address?: string;
    description?: string;
    warning?: string;
    protocol?: string;
    min_confirmations?: string;
    options?: { [key: string]: string | number | boolean; };
    min_collection_amount?: number;
    auto_update_fees_enabled?: boolean;
    base_factor?: number;
    subunits?: number;
    status?: "enabled" | "disabled" | "hidden";
    created_at?: Date;
    updated_at?: Date;
  }

  interface Blockchain {
    id?: number;
    key: string;
    name?: string;
    client: string;
    server?: string;
    height: number;
    explorer_address?: string;
    explorer_transaction?: string;
    min_deposit_amount: number;
    withdraw_fee: number;
    min_withdraw_amount: number;
    collection_gas_speed: "standard" | "safelow" | "fast";
    withdrawal_gas_speed: "standard" | "safelow" | "fast";
    description?: string;
    warning?: string;
    min_confirmations: number;
    status: "active" | "disabled";
    protocol: string;
    created_at?: Date;
    updated_at?: Date;
  }

  interface WalletSettings {
    uri: string;
    secret: string;
  }

  interface Wallet {
    id?: number;
    name: string;
    kind: string;
    currencies: string[];
    address: string;
    gateway: string;
    max_balance?: string | number;
    balance?: { [key: string]: string };
    blockchain_key: string;
    status: "active" | "disabled";
    created_at?: Date;
    updated_at?: Date;
  }

  interface TradingFee {
    id: number;
    group: string;
    market_id: string;
    maker: string;
    taker: string;
    created_at: Date;
    updated_at: Date;
  }

  interface Permission {
    id: number;
    action: "ACCEPT" | "AUDIT" | "DROP";
    role: "accountant" | "admin" | "compliance" | "superadmin" | "technical";
    verb: "ALL" | "DELETE" | "GET" | "POST" | "PUT";
    path: string;
    topic: null;
    created_at?: Date;
    updated_at?: Date;
  }

  interface Restriction {
    id?: number;
    category: string;
    scope: string;
    value: string;
    code: number | string;
    state: string;
    created_at?: Date;
    updated_at?: Date;
  }

  namespace Operation {
    type AccountKind = "main" | "locked";
    type ReferenceType = "order" | "trade";
    interface Asset {
      id: number;
      code: number;
      currency: string;
      credit: string;
      debit: string;
      account_kind: AccountKind;
      rid: number;
      reference_type: "adjustment" | "deposit";
      created_at: Date;
    }

    interface Liability {
      id: number;
      code: number;
      currency: string;
      credit: string;
      debit: string;
      uid: string;
      account_kind: AccountKind;
      rid: number;
      reference_type: ReferenceType;
      created_at: Date;
    }

    interface Revenue {
      id: number;
      code: number;
      currency: string;
      credit: string;
      debit: string;
      uid: string;
      account_kind: AccountKind;
      rid: number;
      reference_type: ReferenceType;
      created_at: Date;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Expense {}
  }

  interface Deposit {
    id: number;
    member: number;
    uid: string;
    email: string;
    currency: string;
    type: string;
    amount: string;
    fee: string;
    state: string;
    tid: string;
    txout?: string;
    block_number?: number;
    address?: string;
    txid?: string;
    confirmations?: string;
    created_at: Date;
    updated_at?: Date;
    completed_at?: Date;
  }

  interface Withdraw {
    id: number;
    currency: string;
    type: string;
    amount: string;
    fee: string;
    blockchain_txid?: string;
    rid?: string;
    state: string;
    confirmations?: string;
    note?: string;
    member: number;
    uid: string;
    email: string;
    account: number;
    block_number?: number;
    sum: string;
    tid: string;
    created_at: Date;
    updated_at?: Date;
    completed_at?: Date;
    done_at?: Date;
  }

  interface Adjustment {
    id?: number;
    reason: string;
    description?: string;
    category: string;
    amount: string;
    creator_uid: string;
    currency_id: string;
    asset?: Operation.Asset;
    liability?: Operation.Asset;
    state?: "pending" | "accepted" | "rejected";
    asset_account_code: number;
    receiving_account_code?: number;
    receiving_member_uid?: string;
    validator_uid?: string;
    created_at?: Date;
    updated_at?: Date;
  }

  interface SmartContract {
    id?: number;
    address?: string;
    blockchain_key?: string;
    state?: string;
    description?: string;
    created_at?: Date;
    updated_at?: Date;
  }

  interface IEO {
    id?: number;
    currency_id?: string;
    main_payment_currency?: string;
    price?: string;
    payment_currencies?: string[];
    executed_quantity?: string;
    origin_quantity?: string;
    limit_per_user?: string;
    min_amount?: string;
    state?: string;
    start_time?: number;
    end_time?: number;
    data?: string;
    banner_url?: string;
    created_at?: Date;
    updated_at?: Date;
  }

  interface Banner extends ZTypes.Banner {
    id: number;
    state: "active" | "deleted";
    created_at: Date;
    updated_at: Date;
  }

  interface BroadCast extends ZTypes.BroadCast {
    id: number;
    state: "active" | "deleted";
    created_at: Date;
    updated_at: Date;
  }

  interface AdminState {
    role: string[];
    metrics: Metrics;
    user_info?: User;
    clients: string[];
    kinds: string[];
    gateways: string[];
    markets: Market[];
    currencies: Currency[];
    blockchains: Blockchain[];
  }

  interface RootState {
    admin: AdminState;
  }
}

export {};
