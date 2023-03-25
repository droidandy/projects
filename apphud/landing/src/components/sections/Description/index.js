import React from "react";
import cn from "classnames";
import Link from "next/link";
import styles from "./styles.module.scss";

const Description = ({
  collection,
  title,
  description,
  linkPath,
  linkText,
  img,
  alt,
  text = true,
  reverse = false,
}) => {
  return (
    <div className={styles.description}>
      <div className="container container_sm">
        <div className={cn(styles.row, { reverse })}>
          <div className={cn(styles.item, { text })}>
            <label className="h3">{title}</label>
            <p>{description}</p>
            {linkText && <Link href={linkPath}>{linkText}</Link>}
          </div>
          <div className={cn(styles.item, { collection: collection })}>
            {collection ? (
              collection?.map((e, i) => (
                <img src={`/icons/apps/${e.img}.svg`} key={i} />
              ))
            ) : (
                <>
                  {typeof img === "string"
                    && <img src={`/images/description/${img}.svg`} alt={alt}/>
                  }
                  { typeof img === "object" && img}
                </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Description;
