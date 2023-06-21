import React, { useState } from "react";
import { Sample } from "../../types";
import { toast } from "react-hot-toast";
import { SampleAPI, TagAPI } from "../../utils/service";
import { TagChip } from "../TagChip";
import { samplePageName } from "../../pages/Samples";
import { Input, InputLabel, Button } from "@mui/material";

export const SampleForm = (props: { initialSample?: Sample | null, redirect: (page: string, props?: {}) => void }) => {

  const isEdit = props.initialSample !== null && props.initialSample !== undefined;
  const [sample, setSample] = useState<Sample>(props.initialSample || {
    filepath: "",
    sample_pack_name: "",
    tags: []
  });



  const updateSample = (newValues: any) => {
    setSample({...sample, ...newValues})
  };

  const [newTag, setNewTag] = useState<string>("");

  const tryAddTag = async () => {
    try {
      const tag = await TagAPI.searchForTag(newTag);

      setNewTag("");

      updateSample({ tags: sample.tags.concat(tag) })
    } catch(e) {
      toast.error("Tag not found.");
    }
  }

  const removeTag = (tag: string) => {
    updateSample({ tags: sample.tags.filter((t) => t.tag !== tag) })
  }

  const submit = async () => {
    if (isEdit) {
      await SampleAPI.update(sample);
    } else {
      await SampleAPI.create(sample);
    }

    props.redirect(samplePageName)
  }

  return (
    <div style={{ margin: 40, width: 300 }}>
      
      <div>
        <InputLabel style={{marginRight: 10}}>File</InputLabel>
        <Input disabled={isEdit} type="text" value={sample.filepath} onChange={(e) => updateSample({filepath: e.target.value})}/>
      </div>

      <div>
        <InputLabel style={{marginRight: 10}}>Descrption</InputLabel>
        <Input disabled={isEdit} type="textbox" value={sample.description} onChange={(e) => updateSample({description: e.target.value})}/>
      </div>
      
      <div style={{ marginBottom: 10 }}>
        <InputLabel style={{marginRight: 10}}>Tags</InputLabel>
        <div style={{ display: '' }}>
          <Input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)}/>
          <Button className="button-link" style={{position: 'absolute', height: 50, marginLeft: 10}} onClick={tryAddTag}>Add Tag</Button>
        </div>
      </div>

      {
        sample.tags.map((tag) => {
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

export default SampleForm;