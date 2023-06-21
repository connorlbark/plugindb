import React, { useState } from "react";
import { MusicPlugin } from "../../types";
import { toast } from "react-hot-toast";
import { PluginAPI, TagAPI } from "../../utils/service";
import { TagChip } from "../TagChip";
import { pluginPageName } from "../../pages/Plugins";
import { Input, InputLabel, Button} from "@mui/material";

export const PluginForm = (props: { initialPlugin?: MusicPlugin | null, redirect: (page: string, props?: {}) => void }) => {

  const isEdit = props.initialPlugin !== null && props.initialPlugin !== undefined;
  const [plugin, setPlugin] = useState<MusicPlugin>(props.initialPlugin || {
    name: "",
    developer: "",
    version: "",
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

  const removeTag = (tag: string) => {
    updatePlugin({ tags: plugin.tags.filter((t) => t.tag !== tag) })
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
    <div style={{ margin: 40, width: 300 }}>
      
      <div>
        <InputLabel style={{marginRight: 10}}>Name</InputLabel>
        <Input disabled={isEdit} type="text" value={plugin.name} onChange={(e) => updatePlugin({name: e.target.value})}/>
      </div>

      <div>
        <InputLabel style={{marginRight: 10}}>Developer</InputLabel>
        <Input type="text" value={plugin.developer} onChange={(e) => updatePlugin({developer: e.target.value, developer_id: null})}/>
      </div>

      <div>
        <InputLabel style={{marginRight: 10}}>Version</InputLabel>
        <Input type="text" value={plugin.version} onChange={(e) => updatePlugin({version: e.target.value})}/>
      </div>
      
      <div style={{ marginBottom: 10 }}>
        <InputLabel style={{marginRight: 10}}>Tags</InputLabel>
        <div style={{ display: '' }}>
          <Input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)}/>
          <Button className="button-link" style={{position: 'absolute', height: 50, marginLeft: 10}} onClick={tryAddTag}>Add Tag</Button>
        </div>
      </div>

      {
        plugin.tags.map((tag) => {
          return (
            <TagChip key={tag.tag} tag={tag} onDelete={() => removeTag(tag.tag)}/>
        )
        })
      }
      <br></br>
      <Button onClick={submit}>Submit</Button>
    </div>
  )
}

export default PluginForm;