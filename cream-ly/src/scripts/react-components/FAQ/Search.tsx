// ts - nocheck
import React, { FunctionComponent } from "react";
import CloseIcon from "@material-ui/icons/Close";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";

type SearchProps = {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClearSearch: () => void;
  searchQuery: string;
  placeholderSearch: string;
};

const Search: FunctionComponent<SearchProps> = ({
  searchQuery,
  handleClearSearch,
  handleChange,
  placeholderSearch
}) => (
  <div className={"search"}>
    <div className={"searchIcon"}>
      {searchQuery ? <CloseIcon onClick={handleClearSearch} /> : <SearchIcon />}
    </div>
    <InputBase
      placeholder={placeholderSearch}
      classes={{
        root: "searchInputRoot",
        input: "searchInputInput"
      }}
      inputProps={{ "aria-label": "search" }}
      onChange={handleChange}
      value={searchQuery}
    />
  </div>
);

export default Search;
