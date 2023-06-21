import React, { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Plugins, { pluginPageName } from "./pages/Plugins";
import Samples, { samplePageName } from "./pages/Samples";
import SamplePacks, { samplePackPageName } from "./pages/SamplePacks";
import Presets, { presetPageName } from "./pages/Presets";
import PluginFormPage, { pluginFormPageName } from "./pages/PluginForm";
import Tags, { tagPageName } from "./pages/Tags";
import TagFormPage, { tagFormPageName } from "./pages/TagForm";
import SampleFormPage, { sampleFormPageName } from "./pages/SampleForm";
import SamplePackFormPage, { samplePackFormPageName } from "./pages/SamplePackForm";
import PresetFormPage, { presetFormPageName } from "./pages/PresetForm";

const pages = [
  {
    name: pluginPageName,
    component: Plugins,
    props: {},
  },
  {
    name: presetPageName,
    component: Presets,
    props: {},
  },
  {
    name: samplePageName,
    component: Samples,
    props: {},
  },
  {
    name: samplePackPageName,
    component: SamplePacks,
    props: {},
  },
  {
    name: tagPageName,
    component: Tags,
    props: {},
  },
  {
    name: pluginFormPageName,
    component: PluginFormPage,
    props: {},
  },
  {
    name: presetFormPageName,
    component: PresetFormPage,
    props: {},
  },
  {
    name: sampleFormPageName,
    component: SampleFormPage,
    props: {},
  },
  {
    name: samplePackFormPageName,
    component: SamplePackFormPage,
    props: {},
  },
  {
    name: tagFormPageName,
    component: TagFormPage,
    props: {},
  },
];

function App() {
  const [page, setPage] = useState(pages[0]);

  const redirect = (page: string, props = {}) => {
    const selectedPage = pages.find((p) => p.name === page);

    if (selectedPage === null || selectedPage === undefined) {
      return;
    }

    setPage({
      name: selectedPage.name,
      component: selectedPage.component,
      props: {
        ...selectedPage.props,
        ...props,
      },
    });
  };

  return (
    <div className="App">
      <Header
        currentPageName={page.name}
        pageNames={pages.map((page) => page.name)}
        changePage={redirect}
      />

      {React.createElement(page.component, {...page.props, ...{redirect: redirect}})}
    </div>
  );
}

export default App;
