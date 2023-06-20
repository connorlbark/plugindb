import React from "react";
import TagTable from "../components/tables/TagTable";

export const tagPageName = "Tags";

export const Tags = (props: {redirect: (page: string, props?: {}) => void}) => {
  return <TagTable redirect={props.redirect}></TagTable>;
};

export default Tags;
