import { NftResponse, OpenseaAPI, OpenseaEventResponse } from "@/@types/opensea";
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
  async getEventsByAccount(address, event_type) {
    try {
      const { data } = await api.get<OpenseaEventResponse[]>(`/events/accounts/${address}`, {
        params: {
          event_type,
        },
      });

      return data;
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
