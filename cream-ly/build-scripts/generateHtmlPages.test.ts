// @ts-nocheck
import { mount } from "enzyme";
import { defaultPage as PageHomePage } from "@Components/PageHomePage/index.stories";
import { defaultPage as PageAbout } from "@Components/PageAbout/index.stories";
import { defaultPage as PageProductsList } from "@Components/PageProductsList/index.stories";
import { defaultPage as PageVideos } from "@Components/PageVideos/index.stories";
import { defaultPage as PageLanding } from "@Components/PageLanding/index.stories";
import { Main as PageBlog } from "@Components/Blog/index.stories";
import { Article as PageBlogPost } from "@Components/Blog/sections/post/index.stories";
import * as Videos from "@Components/PageVideo/index.stories";
import { defaultState as PageFAQ } from "@Components/FAQ/index.stories";
import { empty as PageQuiz } from "@Components/PageQuiz/index.stories";
import { animationOff as Header } from "@Components/SharedComponents/SiteHeader/index.stories";
import * as Products from "@Components/PageProductDetails/index.stories";
import { articleHandles } from "@Core/api/shopify.storefront/blog/index";
import { globalDecorator } from "../.storybook/preview";
import { articleHandles } from "@Core/api/shopify.storefront/blog/index";

const writeSnipet = (fileName: string, lang: string, content) => {
  const fs = require("fs");

  const options = {
    // path to folder in which the file will be created
    path: "./src/snippets/",
    // file name
    fileName: `staticHTML-${fileName}-${lang}.liquid`,
    // content of the file
    content,
  };

  fs.writeFile(options.path + options.fileName, options.content, function(err) {
    if (err) throw err;
    // console.log("build file is created successfully", options.content);
  });
};

const writeTemplate = (
  fileName: string,
  content,
  templatePath = "templates"
) => {
  const fs = require("fs");

  const options = {
    // path to folder in which the file will be created
    path: `./src/${templatePath}/`,
    // file name
    fileName: `${fileName}.liquid`,
    // content of the file
    content,
  };

  fs.writeFile(options.path + options.fileName, options.content, function(err) {
    if (err) throw err;
    // console.log("build file is created successfully", options.content);
  });
};

// templates for products and videos paste in products-static-entry
const PRODUCTS = [
  {
    key: "cream-my-skin",
    story: Products.CreamMySkinNoVariant,
  },
  {
    key: "nourish-my-skin",
    story: Products.NourishMySkinNoVariant,
  },
  {
    key: "flower-powder-my-skin",
    story: Products.FlowerMyPowder,
  },
  {
    key: "cream-my-skin-with-peptides",
    story: Products.CreamMySkinSKUCreamWithPeptides,
  },
  {
    key: "exfoliate-my-skin",
    story: Products.Exfoliate,
  },
  {
    key: "cream-my-body",
    story: Products.CreamMyBody,
  },
  {
    key: "clean-my-skin",
    story: Products.CleanMySkin,
  },
  {
    key: "brush-my-body",
    story: Products.BrushMyBody,
  },
  {
    key: "gift-card",
    story: Products.GiftCard,
  },
  {
    key: "robe",
    story: Products.Robe,
  },
  {
    key: "headband",
    story: Products.Headband,
  },
  {
    key: "candle",
    story: Products.Candle,
  },
  {
    key: "individual-skincare-consultation",
    story: Products.IndividualSkinCareConsultation,
  },
  {
    key: "individual-face-massage",
    story: Products.ConsultationFaceMassage,
  },
  {
    key: "individual-consultation-with-alena",
    story: Products.IndividualConsultationWithAlena,
  },
  {
    key: "video-1",
    story: Videos.video1,
  },
  {
    key: "video-2-limfa",
    story: Videos.video2Limfa,
  },
  {
    key: "video-3-osanka",
    story: Videos.video3Osanka,
  },
  {
    key: "video-4-buccal-massage",
    story: Videos.video4BuccalMassage,
  },
  {
    key: "video-5-guasha-massage",
    story: Videos.video5GuashaMassage,
  },
  {
    key: "video-6-cellulite",
    story: Videos.video6Cellulite,
  },
  {
    key: "video-7-mewing",
    story: Videos.video7Mewing,
  },
  {
    key: "video-8-taping",
    story: Videos.video8Taping,
  },
  {
    key: "video-9-body-taping",
    story: Videos.video9BodyTaping,
  },
  {
    key: "video-aging",
    story: Videos.videoAging,
  },
];

const PAGES = [
  {
    key: "PageHomePage",
    story: PageHomePage,
    templateTitle: "index",
    selector: ".PageHomePage",
  },
  {
    key: "PageAbout",
    story: PageAbout,
    templateTitle: "page.about",
  },
  {
    key: "PageProductsList",
    story: PageProductsList,
    templateTitle: "page.products",
  },
  {
    key: "PageVideos",
    story: PageVideos,
    templateTitle: "page.videos",
    selector: ".componentPageVideos",
  },

  {
    key: "PageQuiz",
    story: PageQuiz,
    templateTitle: "page.quiz",
    additionalAttr: "style='margin-top: 30px'",
  },
  {
    key: "PageFAQ",
    story: PageFAQ,
    templateTitle: "page.faq",
  },
  {
    key: "SiteHeader",
    story: Header,
    templateTitle: "header",
    templatePath: "sections",
  },
  {
    key: "PageLanding",
    story: PageLanding,
    templateTitle: "page.landing",
  },
  {
    key: "Blog",
    story: PageBlog,
    templateTitle: "blog",
    selector: "Connect(Blog)"
  },
];

const ARTICLES = articleHandles.map((handle) => ({
  key: handle,
  story: PageBlogPost,
}));

// todo dynamic use iso_code for lang
const generateTemplate = (componentName: string, additionalAttr?: string) => `
  <div ${additionalAttr ||
    ""} data-react-component-placeholder="${componentName}">
    {%if request.locale.iso_code == "en"%}
    {% include 'staticHTML-${componentName}-en' %}
    {%elsif request.locale.iso_code == "lv"%}
    {% include 'staticHTML-${componentName}-lv' %}
    {%else%}
    {% include 'staticHTML-${componentName}-ru' %}
    {%endif%}
     </div>
`;

describe("generate static HTML", () => {
  it(`smoke test`, async () => {});

  if (!process.env.ALLOW_SEO_GENERATOR) return;

  PAGES.forEach(
    ({
      key,
      story,
      templateTitle,
      templatePath,
      additionalAttr,
      selector = "Connect(Component)",
    }) => {
      ["ru", "en", "lv"].forEach((lang) => {
        it(`generate page ${key}`, (done) => {
          writeSnipet(key, lang, getStoryHTML(story, lang, selector));
          done();
        });
      });
      writeTemplate(
        templateTitle,
        generateTemplate(key, additionalAttr),
        templatePath
      );
    }
  );

  PRODUCTS.forEach(({ key, story }) => {
    ["ru", "en", "lv"].forEach((lang) => {
      it(`generate page ${key}`, (done) => {
        const wrapper = mount(
          globalDecorator((props) => story({ ...props, lang }))
        );
        const htmlContent = wrapper
          .find("Connect(Component)")
          .first()
          .html();
        writeSnipet(key, lang, htmlContent);
        done();
      });
    });
  });

  ARTICLES.forEach(({ key, story }) => {
    it(`generate articles ${key}`, (done) => {
      const wrapper = mount(
        globalDecorator((props) => story({ ...props, handle: key }))
      );
      const htmlContent = wrapper
        .find("Connect(Post)")
        .first()
        .html();
      writeSnipet(key, "ru", htmlContent);
      done();
    });
  });
});

const replaceAll = (str, find, replace) => {
  return str.replace(new RegExp(find, "g"), replace);
};

const getStoryHTML = (story, lang, selector) => {
  const wrapper = mount(globalDecorator((props) => story({ ...props, lang })));

  const htmlContent = wrapper
    .find(selector)
    .first()
    .html();

  return replaceAll(htmlContent, "<test-file-stub></test-file-stub>", "");
};
