/* eslint-disable sort-class-members/sort-class-members */
// @ts-nocheck
import React from "react";
import { translate } from "@Core/i18n";
import debounce from "lodash/debounce";
import words from "lodash/words";
import uniq from "lodash/uniq";
import "./index.scss";

import { connect } from "@Components/index";
import Header from "@Components/Structure/Header";
import MessageUs from "@Components/SharedComponents/MessageUs";
import Typography from "@material-ui/core/Typography";
import fullFaqData, { FAQCategory, searchPattern } from "./data";
import Category from "./Category";
import Search from "./Search";
import { buildHighlitedNodes, replacer } from "./HighlighHelpers";

interface IFAQProps {
  isShortFaq?: boolean;
  initialSearchQuery?: string;
  lang?: string;
}

interface IFaqState {
  searchQuery: string;
  data: FAQCategory[];
}
@translate(
  {
    header: "Часто задаваемые вопросы",
    placeholderSearch: "Начните печатать для поиска..",
    noSearchResultsText: "Ничего не найдено...",
    commonURLTitle: "Подробнее",
  },
  "FAQ"
)
class FAQ extends React.Component<IFAQProps, IFaqState> {
  constructor(props: IFAQProps) {
    super(props);
    this.state = {
      searchQuery: "",
      data: fullFaqData(props.lang, props.isShortFaq),
    };
    this.originalData = fullFaqData(props.lang, props.isShortFaq);
  }

  componentDidMount() {
    const { initialSearchQuery } = this.props;
    // only for stories, or we can push someone to this page and take some query from url and use for search
    if (initialSearchQuery) {
      this.setState({ searchQuery: initialSearchQuery });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { searchQuery } = this.state;
    if (prevState.searchQuery !== searchQuery) {
      this.handleFilter(searchQuery);
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ searchQuery: event.target.value });
  };

  handleFilter = debounce((searchQuery: string) => {
    const search = searchQuery.toLowerCase();
    const searchWords = uniq(words(search, searchPattern));
    const replaceRegex = new RegExp(searchWords.join("|"), "gi");

    const isPartlyMatched = (contentWords: string[]) =>
      contentWords.some((word: string) => searchWords.includes(word));
    const isFullMatched = (text: string) => text.toLowerCase().includes(search);

    const filteredItems = (item) => {
      return (
        isFullMatched(item.name) ||
        isFullMatched(item.clearText) ||
        isPartlyMatched(item.searchNameWords) ||
        isPartlyMatched(item.searchTextWords)
      );
    };

    if (searchQuery.length > 2) {
      const result = this.originalData.map((category) => ({
        ...category,
        items: category.items.filter(filteredItems).map((item) => {
          const newName = item.name.replace(replaceRegex, replacer);
          const newText = buildHighlitedNodes(item.text, replaceRegex);

          return {
            ...item,
            name: newName,
            text: newText,
            isToggled:
              isFullMatched(item.clearText) ||
              isPartlyMatched(item.searchTextWords),
          };
        }),
      }));
      this.setState({ data: result });
    } else {
      this.setState({ data: this.originalData });
    }
  }, 200);

  handleClearSearch = () => {
    this.setState({
      searchQuery: "",
      data: this.originalData,
    });
  };

  render() {
    const { searchQuery, data } = this.state;
    const isResults = data.some(({ items }) => items.length > 0);

    return (
      <div className="ComponentFAQ">
        <Header isPageHeader>{this.t("header")}</Header>
        <Search
          searchQuery={searchQuery}
          handleClearSearch={this.handleClearSearch}
          handleChange={this.handleChange}
          placeholderSearch={this.t("placeholderSearch")}
        />

        <div className="root">
          {isResults ? (
            <>
              {data.map((category: FAQCategory) => (
                <Category category={category} key={category.name} />
              ))}
            </>
          ) : (
            <Typography
              className="heading heading--question"
              paragraph
              align="center"
              dangerouslySetInnerHTML={{
                __html: this.t("noSearchResultsText"),
              }}
            />
          )}

          <MessageUs lang={this.props.lang} />
        </div>
      </div>
    );
  }
}

FAQ.defaultProps = {
  initialSearchQuery: "",
  isShortFaq: false,
};

export default connect(null, null)(FAQ);
