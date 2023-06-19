import "./Header.css";

export const Header = (props) => {
  const { changePage, pageNames, currentPageName } = props;

  return (
    <div class="header">
      <a href="#default" class="logo">
        plugindb
      </a>
      <div class="header-right">
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
