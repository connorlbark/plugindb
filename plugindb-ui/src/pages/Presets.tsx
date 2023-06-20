import React from "react";
import PresetTable from "../components/tables/PresetTable";

export const presetPageName = "Presets";

export const Presets = (props: {redirect: (page: string, props?: {}) => void}) => {
  return <PresetTable redirect={props.redirect}></PresetTable>;
};

export default Presets;
