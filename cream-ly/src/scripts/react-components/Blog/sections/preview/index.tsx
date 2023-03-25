import React from "react";
import ClampLines from "react-clamp-lines";
import {
  CardActionArea, CardActions, CardContent, CardMedia,
} from "@material-ui/core";
import Image from "@Components/SharedComponents/LazyLoadImage";
import Chip from "../../chip";

import { PostProps } from "../../types";
import { urlForBlogArticle } from "@Core/app/router";

import "./index.scss";
//@ts-ignore
import placeholderImage from "./placeholder.jpg";

interface PreviewProps extends PostProps {
  handleTagClick: (tagName: string) => void;
}

const Preview = ({
  id,
  excerpt,
  handle,
  handleTagClick,
  image,
  tags,
  title,
}: PreviewProps) => {
  return (
    <div className="preview">
      <a href={urlForBlogArticle(handle)} className="preview-link">
        {image && image.originalSrc ? (
          <Image
            src={image.originalSrc}
            height={300}
            width={"100%"}
            alt={title}
          />
        ) : (
          <Image src={placeholderImage} height={282} alt={title} />
        )}
        <div className="preview-content">
          <div>
            {title && <h4 className="title">{title}</h4>}
            {excerpt && (
              <div className="summary">
                <ClampLines
                  text={excerpt}
                  id={`${id}-summary`}
                  lines={4}
                  buttons={false}
                />
              </div>
            )}
          </div>
          {tags.length > 0 && (
            <div className="tags-preview">
              {tags.map((tag) => (
                <Chip key={tag} label={tag} handleClick={handleTagClick} />
              ))}
            </div>
          )}
        </div>
      </a>
    </div>
  );
};

export default Preview;
