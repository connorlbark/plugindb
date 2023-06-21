import React from "react";
import SamplePackForm from "../components/forms/SamplePackForm";
import { SamplePack } from "../types";

export const samplePackFormPageName = "Sample Pack Form";

export const SamplePackFormPage = (props: { initialSamplePack?: SamplePack, redirect: (page: string, props?: {}) => void}) => {
  return <SamplePackForm initialSamplePack={props.initialSamplePack} redirect={props.redirect}></SamplePackForm>;
};

export default SamplePackFormPage;
