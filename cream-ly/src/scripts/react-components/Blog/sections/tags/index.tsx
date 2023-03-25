import React from "react";
import debounce from "lodash/debounce";
import Chip from '../../chip';

import "./index.scss";

interface TagsProps {
  tags: string[];
  handleClick: (tagName: string) => void;
  filter: string;
}

const Tags = ({ tags, handleClick, filter }: TagsProps) => {
  const withAllProperty = ["все", ...tags];
  const tagsRef = React.useRef(null);

  const [scrollLeft, setScrollLeft] = React.useState(0);
  const [tagsWidth, setTagsWidth] = React.useState(0);
  const [scrollWidth, setScrollWidth] = React.useState(0);

  const handleUpdate = debounce((e) => { setScrollLeft(e.target.scrollLeft) }, [100], { leading: true });

  React.useEffect(() => {
    setTagsWidth(tagsRef.current.offsetWidth);
    setScrollWidth(tagsRef.current.scrollWidth);
    tagsRef.current.addEventListener("scroll", handleUpdate);
    return () => {
      tagsRef.current.removeEventListener("scroll", handleUpdate);
    };
  }, []);

  const handleScroll = (direction: "right" | "left") => {
    const scrollJump = tagsWidth / 2;
    const left = direction === "right" ? scrollLeft + scrollJump : scrollLeft - scrollJump;
    tagsRef.current.scrollTo({ left, behavior: "smooth" });
  };

  return (
    <div className="tags">
      <Chip
        key="scroll-left"
        label="<"
        value="left"
        handleClick={handleScroll}
        disabled={scrollLeft === 0}
        className="arrow arrow--left"
      />
      <div className="wrapper" ref={tagsRef}>
        {withAllProperty.map((tag) => (
          <Chip
            key={tag}
            label={tag.toLowerCase()}
            handleClick={handleClick}
            active={filter === tag}
            className="navigation-tags"
          />
        ))}
      </div>
      <Chip
        key="scroll-right"
        label=">"
        value="right"
        handleClick={handleScroll}
        className="arrow arrow--right"
        disabled={scrollLeft + tagsWidth >= scrollWidth}
      />
    </div>
  );
};

export default Tags;
