import React from "react";
import Header from "@Components/Structure/Header";

export default ({ videoParts, lang, translate }) => {
  if (!Array.isArray(videoParts) || videoParts.length == 0) return null;

  return (
    <div className="videoDescription">
      <h2>{translate({ key: "PageVideoDetails:videoPartsIntro", lang })}</h2>
      <ul className="videoParts">
        {videoParts.map((partName) => (
          <li>{partName}</li>
        ))}
      </ul>
    </div>
  );
};
