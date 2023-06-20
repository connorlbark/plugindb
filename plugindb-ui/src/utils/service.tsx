import axios from "axios";
import { MusicPlugin } from "../types";

const backend = "localhost:5000";

export const PluginAPI = {
  getAll: async () : Promise<MusicPlugin[]> => {
    const response = await axios.get(backend + "/plugin");
    return response.data;
  },
};
