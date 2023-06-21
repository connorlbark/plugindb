import TagForm from "../components/forms/TagForm";
import { Tag } from "../types";

export const tagFormPageName = "Tag Form";

export const TagFormPage = (props: { initialTag?: Tag, redirect: (page: string, props?: {}) => void}) => {
  return <TagForm initialTag={props.initialTag} redirect={props.redirect}></TagForm>;
};

export default TagFormPage;
