import "./Header.css";

export const Header = (props) => {
  const { changePage, pageNames, currentPageName } = props;

  return (
    <div className="header">
      <a className="logo">plugindb</a>
      <div className="header-right">
        {pageNames.map((pageName) => {
          return (
            <a
              key={pageName}
              className={pageName === currentPageName ? "active" : ""}
              onClick={() => changePage(pageName)}
            >
              {pageName}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default Header;
