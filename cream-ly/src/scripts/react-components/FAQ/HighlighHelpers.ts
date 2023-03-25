import React from "react";

export const omitHtmlTagsRegex = str => str.replace(/(<([^>]+)>)/gi, "");

export const omitHtmlTagsForSearch = (content) => {
  let el = document.createElement("span");
  el.innerHTML = content;
  return el.innerText || "";
};

export const replacer = (match) => `<span style="background: #fdb6d1">${match}</span>`;

const processNode = (node, search) => {
  [...node.childNodes].forEach((inner) => {
    if (inner.nodeType === Node.TEXT_NODE) {
      const span = document.createElement("span");
      span.innerHTML = inner.nodeValue.replace(new RegExp(search, "gi"), replacer);
      inner.replaceWith(span);
    } else {
      processNode(inner, search);
    }
  });
};

export const buildHighlitedNodes = (content, search) => {
  const el = document.createElement("div");
  el.innerHTML = content;

  processNode(el, search);

  return el.innerHTML;
};
