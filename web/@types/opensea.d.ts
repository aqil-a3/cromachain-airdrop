export interface OpenseaAPI {
  getEventsByCollection: (collection_slug: string) => Promise<unknown>;
  getEventsByAccount: (address: string, event_type: string) => Promise<unknown>;
  getNFTsByAccount: (
    wallet_address: string,
    chain: string,
    collection?: string
  ) => Promise<NftResponse>;
}

export interface Nft {
  identifier: string;
  collection: string;
  contract: string;
  token_standard: "erc721" | "erc1155";
  name: string;
  description: string;
  image_url?: string;
  display_image_url?: string;
  display_animation_url?: string;
  metadata_url?: string;
  opensea_url?: string;
  updated_at: string;
  is_disabled: boolean;
  is_nsfw: boolean;
}

export interface NftResponse {
  nfts: Nft[];
  next: string;
}

// EVENT ENDPOINT
export interface OpenseaEventResponse {
  asset_events: AssetEvent[];
  next: string | null;
}

export interface AssetEvent {
  event_type: string; // "sale", "transfer", dll.
  event_timestamp: number;
  transaction: string;
  order_hash: string;
  protocol_address: string;
  chain: string;
  payment: Payment;
  closing_date: number;
  seller: string;
  buyer: string;
  quantity: number;
  nft: EventNft;
}

export interface Payment {
  quantity: string; // dalam wei (string biar tidak overflow)
  token_address: string;
  decimals: number;
  symbol: string; // misalnya "ETH"
}

export interface EventNft {
  identifier: string;
  collection: string;
  contract: string;
  token_standard: string; // "erc721" | "erc1155"
  name: string;
  description: string;
  image_url: string;
  display_image_url: string;
  display_animation_url: string | null;
  metadata_url: string;
  opensea_url: string;
  updated_at: string;
  is_disabled: boolean;
  is_nsfw: boolean;
}
