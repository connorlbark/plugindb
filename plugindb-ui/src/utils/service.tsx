import axios from "axios";
import { MusicPlugin, Tag, Sample, Preset, SamplePack } from "../types";

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
  delete: async (id: number) => {
    await axios.delete(backend + "/plugin/"+id);
  },
};

export const TagAPI = {
  getAll: async () : Promise<Tag[]> => {
    const response = await axios.get(backend + "/tag");
    return response.data;
  },
  searchForTag: async (query: string) : Promise<Tag> => {
    const response = await axios.get(backend + "/tag/search", { params: { query: query } });

    return response.data;
  },
  delete: async (tag: string) => {
    await axios.delete(backend + "/tag/"+tag);
  },
}

export const SampleAPI = {
  getAll: async () : Promise<Sample[]> => {
    const response = await axios.get(backend + "/sample");
    return response.data;
  },
  create: async (sample: Sample) => {
    await axios.post(backend + "/sample", sample);
  },
  update: async (sample: Sample) => {
    await axios.put(backend + "/sample", sample);
  },
  delete: async (sample_id: number) => {
    await axios.delete(backend + "/sample/"+sample_id);
  },
};

export const SamplePackAPI = {
  getAll: async () : Promise<SamplePack[]> => {
    const response = await axios.get(backend + "/sample_pack");
    return response.data;
  },
  create: async (pack: SamplePack) => {
    await axios.post(backend + "/sample_pack", pack);
  },
  update: async (pack: SamplePack) => {
    await axios.put(backend + "/sample_pack", pack);
  },
  delete: async (sample_pack_id: number) => {
    await axios.delete(backend + "/sample_pack/"+sample_pack_id);
  },
};

export const PresetAPI = {
  getAll: async () : Promise<Preset[]> => {
    const response = await axios.get(backend + "/preset");
    return response.data;
  },
  create: async (preset: Preset) => {
    await axios.post(backend + "/preset", preset);
  },
  update: async (preset: Preset) => {
    await axios.put(backend + "/preset", preset);
  },
  delete: async (preset_id: number) => {
    await axios.delete(backend + "/preset/"+preset_id);
  },
};
