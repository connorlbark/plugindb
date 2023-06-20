import React from "react";
import PluginForm from "../components/forms/PluginForm";
import { MusicPlugin } from "../types";

export const createPluginPageName = "Create/Edit Plugin";

export const Plugins = (props: { initialPlugin?: MusicPlugin, redirect: (page: string, props?: {}) => void}) => {
  return <PluginForm initialPlugin={props.initialPlugin} redirect={props.redirect}></PluginForm>;
};

export default Plugins;
