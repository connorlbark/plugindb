import React, { useState } from "react";
import { Preset } from "../../types";
import { toast } from "react-hot-toast";
import { PresetAPI, TagAPI } from "../../utils/service";
import { TagChip } from "../TagChip";
import { presetPageName } from "../../pages/Presets";
import { Input, InputLabel, Button} from "@mui/material";

export const PresetForm = (props: { initialPreset?: Preset | null, redirect: (page: string, props?: {}) => void }) => {

  const isEdit = props.initialPreset !== null && props.initialPreset !== undefined;
  const [preset, setPreset] = useState<Preset>(props.initialPreset || {
    name: "",
    plugin_name: "",
    filepath: "",
    tags: []
  });

  const updatePreset = (newValues: any) => {
    setPreset({...preset, ...newValues})
  };

  const [newTag, setNewTag] = useState<string>("");

  const tryAddTag = async () => {
    try {
      const tag = await TagAPI.searchForTag(newTag);

      setNewTag("");

      updatePreset({ tags: preset.tags.concat(tag) })
    } catch(e) {
      toast.error("Tag not found.");
    }
  }

  const removeTag = (tag: string) => {
    updatePreset({ tags: preset.tags.filter((t) => t.tag !== tag) })
  }

  const submit = async () => {

    if (preset.name === '') {
      toast.error("Name is a required field.");
      return;
    }

    if (preset.plugin_name === "") {
      toast.error("Plugin is a required field.");
      return;
    }

    if (isEdit) {
      PresetAPI.update(preset).then(() => {
        props.redirect(presetPageName);
      }).catch((e) => {
        if (e.response.status === 404) {
          toast.error('Plugin does not exist.')
        } else {
          throw e;
        }
      });
    } else {
      PresetAPI.create(preset).then(() => {
        props.redirect(presetPageName);
      }).catch((e) => {
        if (e.response.status === 404) {
          toast.error('Plugin does not exist.')
        } else {
          throw e;
        }
      });
    }

  }

  return (
    <div style={{ margin: 40, width: 300 }}>
      
      <div>
        <InputLabel style={{marginRight: 10}}>Name</InputLabel>
        <Input disabled={isEdit} type="text" value={preset.name} onChange={(e) => updatePreset({name: e.target.value})}/>
      </div>

      <div>
        <InputLabel style={{marginRight: 10}}>Plugin</InputLabel>
        <Input type="text" value={preset.plugin_name} onChange={(e) => updatePreset({plugin_name: e.target.value, plugin_id: null})}/>
      </div>

      <div>
        <InputLabel style={{marginRight: 10}}>Filepath</InputLabel>
        <Input type="text" value={preset.filepath} onChange={(e) => updatePreset({filepath: e.target.value})}/>
      </div>
      
      <div style={{ marginBottom: 10 }}>
        <InputLabel style={{marginRight: 10}}>Tags</InputLabel>
        <div style={{ display: '' }}>
          <Input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)}/>
          <Button className="button-link" style={{position: 'absolute', height: 50, marginLeft: 10}} onClick={tryAddTag}>Add Tag</Button>
        </div>
      </div>

      {
        preset.tags.map((tag) => {
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

export default PresetForm;