import React from "react";
import SampleTable from "../components/tables/SampleTable";

export const samplePageName = "Samples";

export const Samples = (props: {redirect: (page: string, props?: {}) => void}) => {
  return <SampleTable redirect={props.redirect}></SampleTable>;
};

export default Samples;
