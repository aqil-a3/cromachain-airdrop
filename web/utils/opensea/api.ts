import {
  AssetEvent,
  NftResponse,
  OpenseaAPI,
  OpenseaEventSaleResponse,
} from "@/@types/opensea";
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.opensea.io/api/v2",
  headers: {
    accept: "application/json",
    "x-api-key": process.env.OPENSEA_API_KEY,
  },
});

export const opensea: OpenseaAPI = {
  async getEventsByCollection(collection_slug) {
    try {
      const { data } = await api.get(`/events/collection/${collection_slug}`);

      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  async getEventSalesByAccount(address) {
    let allEvents: AssetEvent[] = [];
    let next: string | null = null;

    try {
      do {
        const res = await api.get<OpenseaEventSaleResponse>(
          `/events/accounts/${address}`,
          {
            params: {
              event_type: "sale",
              ...(next ? { next } : {}),
            },
          }
        );

        const data: OpenseaEventSaleResponse = res.data;

        allEvents.push(...data.asset_events);
        next = data.next;
      } while (next);

      const response: OpenseaEventSaleResponse = {
        asset_events: allEvents,
        next,
      };

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  async getNFTsByAccount(wallet_address, chain, collection) {
    try {
      const { data } = await api.get<NftResponse>(
        `/chain/${chain}/account/${wallet_address}/nfts?collection=${collection}`
      );

      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
