import React, { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Plugins, { pluginPageName } from "./pages/Plugins";
import Samples, { samplePageName } from "./pages/Samples";

const pages = [
  {
    name: pluginPageName,
    component: Plugins,
    props: {},
  },
  {
    name: samplePageName,
    component: Samples,
    props: {},
  },
];

function App() {
  const [page, setPage] = useState(pages.find((p) => p.name === "Plugins"));

  const changePage = (page, props = {}) => {
    console.log("Hi");

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
        changePage={changePage}
      />

      {React.createElement(page.component, page.props)}
    </div>
  );
}

export default App;
