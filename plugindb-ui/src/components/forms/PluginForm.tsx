import React, { useState } from "react";
import { MusicPlugin } from "../../types";
import { toast } from "react-hot-toast";
import { PluginAPI, TagAPI } from "../../utils/service";
import { TagChip } from "../TagChip";
import { pluginPageName } from "../../pages/Plugins";

export const PluginForm = (props: { initialPlugin?: MusicPlugin | null, redirect: (page: string, props?: {}) => void }) => {

  const isEdit = props.initialPlugin != null && props.initialPlugin != undefined;
  const [plugin, setPlugin] = useState<MusicPlugin>(props.initialPlugin || {
    name: "",
    developer: "",
    tags: []
  });

  const updatePlugin = (newValues: any) => {
    setPlugin({...plugin, ...newValues})
  };

  const [newTag, setNewTag] = useState<string>("");

  const tryAddTag = async () => {
    try {
      const tag = await TagAPI.searchForTag(newTag);

      setNewTag("");

      updatePlugin({ tags: plugin.tags.concat(tag) })
    } catch(e) {
      toast.error("Tag not found.");
    }
  }

  const submit = async () => {
    if (isEdit) {
      await PluginAPI.update(plugin);
    } else {
      await PluginAPI.create(plugin);
    }

    props.redirect(pluginPageName)
  }

  return (
    <div>
      <p>Name</p>
      <input type="text" value={plugin.name} onChange={(e) => updatePlugin({name: e.target.value})}/>
      <p>Developer</p>
      <input type="text" value={plugin.developer} onChange={(e) => updatePlugin({developer: e.target.value, developer_id: null})}/>
      <p>Tags</p>
      <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)}/>
      <button onClick={tryAddTag}>+</button>
      { plugin.tags.map((tag) => {
        return (
          <TagChip key={tag.tag} tag={tag}/>
        )
      }) }
      <button onClick={submit}>Submit</button>
    </div>
  )
}

export default PluginForm;