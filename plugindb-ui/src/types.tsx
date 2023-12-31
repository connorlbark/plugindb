export type Tag = {
  tag: string
  color?: string
};

export type MusicPlugin = {
  plugin_id?: number
  name: string
  developer: string
  developer_id?: number
  version?: string
  tags: Tag[]
};

export type Sample = {
  sample_id?: number
  filepath: string
  description?: string
  sample_pack_id?: number
  sample_pack_name?: string
  sample_pack_description?: string
  sample_pack_url?: string
  sample_pack_license?: string
  tags: Tag[]
};

export type SamplePack = {
  sample_pack_id?: number
  name: string
  description?: string
  url?: string
  license?: string
}

export type Preset = {
  preset_id?: number
  name: string
  filepath?: string
  plugin_id?: number
  plugin_name?: string
  tags: Tag[]
};