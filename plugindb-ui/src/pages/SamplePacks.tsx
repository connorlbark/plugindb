import React from "react";
import SamplePackTable from "../components/tables/SamplePackTable";

export const samplePackPageName = "Sample Packs";

export const SamplePacks = (props: {redirect: (page: string, props?: {}) => void}) => {
  return <SamplePackTable redirect={props.redirect}></SamplePackTable>;


};

export default SamplePacks;
