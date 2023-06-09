import SEOpages from "../src/scripts/core/i18n/translations/ru/SEO";
import fs from "fs";

interface ISEOtags {
  title: string;
  description: string;
}

interface ISEOPages {
  [path: string]: ISEOtags;
}

export const generateContent = (urls: ISEOPages) => {
  let content = `
  {%comment%}
    autogenerated by /build-scripts/generateSEOMetaTags.ts
  {%endcomment%}

  {%if  request.page_type contains "customers/" or request.page_type == "cart" or request.page_type == "collection" or request.page_type == "search"  or request.page_type == "password" %}
    <meta name="robots" content="noindex, nofollow" />
  {% endif %}
  {%if  request.host != "cream.ly" and request.page_type == "blog"  %}
    <meta name="robots" content="noindex, nofollow" />
  {% endif %}
  {%if  request.locale.iso_code != "ru" and request.page_type == "blog"  %}
    <meta name="robots" content="noindex, nofollow" />
  {% endif %}
  {%if  request.host != "cream.ly" and request.page_type == "article"  %}
    <meta name="robots" content="noindex, nofollow" />
  {% endif %}
  {%if  request.locale.iso_code != "ru" and request.page_type == "article"  %}
  <meta name="robots" content="noindex, nofollow" />
  {% endif %}
  {%if  request.path contains "pages/recommendations" or request.path contains "pages/contact-us" or request.path contains "terms-and-conditions" or request.path contains "privacy-policy" or request.path contains "blogs/beauty/tagged" or request.path contains "products/cream-my-skin-with-peptides" %}
    <meta name="robots" content="noindex, nofollow" />
  {% endif %}


  {% case request.path %}`;

  Object.keys(urls).map((path) => {
    const seoTags = urls[path];

    content += "\n" + `{% when "/${path}" %}`;
    content += "\n" + `<title>${seoTags.title}</title>`;
    content +=
      "\n" + `<meta name="description" content="${seoTags.description}">`;
  });

  content +=
    "\n" +
    `{% else %}


  <!-- use default seo tags for {{request.path}} -->
  {% include "_seo_default" %}
  {% endcase %}`;

  return content;
};

export const replaceFile = (content) => {
  const options = {
    // path to folder in which the file will be created
    path: "./src/snippets/",
    // file name
    fileName: `_seo_tags.liquid`,
    // content of the file
    content,
  };

  fs.writeFile(options.path + options.fileName, options.content, function(err) {
    if (err) throw err;
    // console.log("build file is created successfully", options.content);
  });
};

replaceFile(generateContent(SEOpages));
