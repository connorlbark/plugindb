import React from "react";
import PresetForm from "../components/forms/PresetForm";
import { Preset } from "../types";

export const presetFormPageName = "Preset Form";

export const PresetFormPage = (props: { initialPreset?: Preset, redirect: (page: string, props?: {}) => void}) => {
  return <PresetForm initialPreset={props.initialPreset} redirect={props.redirect}></PresetForm>;
};

export default PresetFormPage;
