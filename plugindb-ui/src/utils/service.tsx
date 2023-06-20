import axios from "axios";
import { MusicPlugin, Tag } from "../types";

const backend = "http://127.0.0.1:5000";

export const PluginAPI = {
  getAll: async () : Promise<MusicPlugin[]> => {
    const response = await axios.get(backend + "/plugin");
    return response.data;
  },
  create: async (plugin: MusicPlugin) => {
    await axios.post(backend + "/plugin", plugin);
  },
  update: async (plugin: MusicPlugin) => {
    await axios.put(backend + "/plugin", plugin);
  },
};

export const TagAPI = {
  searchForTag: async (query: string) : Promise<Tag> => {
    const response = await axios.get(backend + "/tag/search", { params: { query: query } });

    return response.data;
  }
}
