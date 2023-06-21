import React, { useState } from "react";
import { SamplePack } from "../../types";
import { SamplePackAPI } from "../../utils/service";
import { samplePackPageName } from "../../pages/SamplePacks";
import { Input, InputLabel, Button} from "@mui/material";

export const SamplePackForm = (props: { initialSamplePack?: SamplePack | null, redirect: (page: string, props?: {}) => void }) => {

  const isEdit = props.initialSamplePack !== null && props.initialSamplePack !== undefined;
  const [sample_pack, setSamplePack] = useState<SamplePack>(props.initialSamplePack || {
    name: "",
    description: "",
    url: "",
    license: "",
  });

  const updateSamplePack = (newValues: any) => {
    setSamplePack({...sample_pack, ...newValues})
  };


  const submit = async () => {
    if (isEdit) {
      await SamplePackAPI.update(sample_pack);
    } else {
      await SamplePackAPI.create(sample_pack);
    }

    props.redirect(samplePackPageName)
  }

  return (
    <div style={{ margin: 40, width: 300 }}>
      
      <div>
        <InputLabel style={{marginRight: 10}}>Name</InputLabel>
        <Input disabled={isEdit} type="text" value={sample_pack.name} onChange={(e) => updateSamplePack({name: e.target.value})}/>
      </div>

      <div>
        <InputLabel style={{marginRight: 10}}>Description</InputLabel>
        <Input type="text" value={sample_pack.description} onChange={(e) => updateSamplePack({description: e.target.value})}/>
      </div>

      <div>
        <InputLabel style={{marginRight: 10}}>URL</InputLabel>
        <Input type="text" value={sample_pack.url} onChange={(e) => updateSamplePack({url: e.target.value})}/>
      </div>

      <div>
        <InputLabel style={{marginRight: 10}}>License</InputLabel>
        <Input type="text" value={sample_pack.license} onChange={(e) => updateSamplePack({license: e.target.value})}/>
      </div>
 

      <Button onClick={submit}>Submit</Button>
    </div>
  )
}

export default SamplePackForm;