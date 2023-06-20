import { Chip } from "@mui/material"
import { Tag } from "../types"
import { JsxElement } from "typescript"


function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

const textColorFromBgColor = (bgColor: string) => {
  const rgb = hexToRgb(bgColor)
  if (!rgb) {
    return 'black';
  }

  const brightness = Math.round(((rgb.r * 299) +
    (rgb.g * 587) +
    (rgb.b * 114)) / 1000);

  return (brightness > 125) ? 'black' : 'white';

}

export const TagChip = (props: {tag: Tag, onDelete?: () => void}) => {
  return (
    <Chip
      label={props.tag.tag}
      style={
        {
          backgroundColor: props.tag.color || "#ffffff",
          color: textColorFromBgColor(props.tag.color || "#ffffff")
        }
      }
      onDelete={props.onDelete}/>)
}

