import React from "react";
import PluginTable from "../components/tables/PluginTable";

export const pluginPageName = "Plugins";

export const Plugins = (props: {redirect: (page: string, props?: {}) => void}) => {
  return <PluginTable redirect={props.redirect}></PluginTable>;
};

export default Plugins;
