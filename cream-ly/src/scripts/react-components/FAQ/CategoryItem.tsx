// ts - nocheck
import React, { useEffect, useState } from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { FAQItem, RelatedLink } from "./data";
import InstagramIcon from "./icons/InstagramIcon";

interface ICategoryItemProps {
  item: FAQItem;
  index: number;
}

const CategoryItem = ({ item, index }: ICategoryItemProps) => {
  const [isManualToggled, setToggle] = useState(false);

  useEffect(() => {
    setToggle(item.isToggled);

    return () => {
      setToggle(false);
    };
  }, [item.isToggled]);

  return (
    <Accordion
      id={item.key}
      key={item.key}
      classes={{
        root: "accordion-root",
        expanded: "accordion-expanded"
      }}
      expanded={isManualToggled}
      onChange={(event, value) => setToggle(value)}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        id={item.key}
        aria-controls={`panel${index}bh-content`}
        classes={{
          root: "accordion-summary-root",
          expanded: "accordion-summary-expanded"
        }}
      >
        <Typography
          className="heading--question"
          dangerouslySetInnerHTML={{ __html: item.name }}
        />
      </AccordionSummary>
      <AccordionDetails
        classes={{
          root: "accordion-details-root"
        }}
      >
        <Typography
          classes={{
            root: "typography-root"
          }}
          dangerouslySetInnerHTML={{ __html: item.text }}
        />
        {item.relatedLinks && (
          <Typography>
            {item.relatedLinks.map((link: RelatedLink) => {
              const isInstagramLink = link.url.includes("instagram.com");
              return (
                <a
                  className={`related-link ${
                    isInstagramLink ? "related-link--instagram" : ""
                  }`}
                  href={link.url || "#"}
                  target="_blank"
                  key={link.url}
                >
                  {isInstagramLink && <InstagramIcon />}
                  <span className="related-link__label">{link.name}</span>
                </a>
              );
            })}
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default CategoryItem;
