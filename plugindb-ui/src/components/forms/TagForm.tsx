import React, { useState } from "react";
import { Tag } from "../../types";
import { TagAPI } from "../../utils/service";
import { tagPageName } from "../../pages/Tags";
import { Input, InputLabel, Button} from "@mui/material";
import { Circle } from '@uiw/react-color';

const palette = [
  '#000000',
  '#1D2B53',
  '#7E2553',
  '#008751',
  '#AB5236',
  '#5F574F',
  '#C2C3C7',
  '#FFF1E8',
  '#FF004D',
  '#FFA300',
  '#FFEC27',
  '#00E436',
  '#29ADFF',
  '#83769C',
  '#FF77A8',
  '#FFCCAA'
]

export const TagForm = (props: { initialTag?: Tag | null, redirect: (page: string, props?: {}) => void }) => {

  const isEdit = props.initialTag !== null && props.initialTag !== undefined;
  const [tag, setTag] = useState<Tag>(props.initialTag || {
    tag: "",
    color: ""
  });

  const updateTag = (newValues: any) => {
    console.log(newValues);
    setTag({...tag, ...newValues})
  };


  const submit = async () => {
    await TagAPI.upsert(tag);

    props.redirect(tagPageName)
  }

  return (
    <div style={{ margin: 40, width: 300 }}>
      
      <div>
        <InputLabel style={{marginRight: 10}}>Tag</InputLabel>
        <Input disabled={isEdit} type="text" value={tag.tag} onChange={(e) => updateTag({tag: e.target.value})}/>
      </div>

      <div>
        <InputLabel style={{marginRight: 10}}>Color</InputLabel>
        <Circle color={tag.color} onChange={(color) => updateTag({color: color.hex})} colors={palette} />
      </div>
 

      <Button onClick={submit}>Submit</Button>
    </div>
  )
}

export default TagForm;