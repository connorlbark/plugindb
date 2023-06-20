export type Tag = {
  tag: string
  color: string
};

export type MusicPlugin = {
  plugin_id: number
  name: string
  developer: string
  developer_id: number
  tags: Tag[]
};
