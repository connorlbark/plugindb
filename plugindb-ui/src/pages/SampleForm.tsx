import React from "react";
import SampleForm from "../components/forms/SampleForm";
import { Sample } from "../types";

export const sampleFormPageName = "Sample Form";

export const SampleFormPage = (props: { initialSample?: Sample, redirect: (page: string, props?: {}) => void}) => {
  return <SampleForm initialSample={props.initialSample} redirect={props.redirect}></SampleForm>;
};

export default SampleFormPage;
