import React, { useState } from "react";
import { Sample } from "../../types";
import { toast } from "react-hot-toast";
import { SampleAPI, TagAPI } from "../../utils/service";
import { TagChip } from "../TagChip";
import { samplePageName } from "../../pages/Samples";
import { Input, InputLabel, Button } from "@mui/material";
import { totalmem } from "os";

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

    if (sample.filepath === "") {
      toast.error("File is a required field.");
      return;
    }

    if (isEdit) {
      SampleAPI.update(sample).then(() => {
        props.redirect(samplePageName)
      }).catch((e) => {
        if (e.response.status === 404) {
          toast.error('Sample pack does not exist.')
        } else {
          throw e;
        }
      });
    } else {
      await SampleAPI.create(sample).then(() => {
        props.redirect(samplePageName)
      }).catch((e) => {
        if (e.response.status === 404) {
          toast.error('Sample pack does not exist.')
        } else {
          throw e;
        }
      });
    }

  }

  return (
    <div style={{ margin: 40, width: 300 }}>
      
      <div>
        <InputLabel style={{marginRight: 10}}>File</InputLabel>
        <Input disabled={isEdit} type="text" value={sample.filepath} onChange={(e) => updateSample({filepath: e.target.value})}/>
      </div>

      <div>
        <InputLabel style={{marginRight: 10}}>Description</InputLabel>
        <Input disabled={isEdit} type="textbox" value={sample.description} onChange={(e) => updateSample({description: e.target.value})}/>
      </div>


      <div>
        <InputLabel style={{marginRight: 10}}>Sample Pack</InputLabel>
        <Input disabled={isEdit} type="textbox" value={sample.sample_pack_name} onChange={(e) => updateSample({sample_pack_name: e.target.value})}/>
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