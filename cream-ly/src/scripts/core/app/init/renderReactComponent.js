import React, { Suspense } from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom";

import { getAllUrlParams } from "@Core/url";
import { trimSkinGoalsList, quiz2skuList } from "@Core/quiz";
import { goToQuizOrResults } from "@Core/app/router";

import store from "@Core/redux";

import SiteHeader from "@Components/SharedComponents/SiteHeader";
import SiteFooter from "@Components/SharedComponents/SiteFooter";
import LoadingIndicator from "@Components/Structure/LoadingIndicator";

export default () => {
  scheduleForWhenHTMLIsReady(findReactPlaceholdersInHTML);
};

const findReactPlaceholdersInHTML = () => {
  const placeholders = document.querySelectorAll(
    "[data-react-component-placeholder]"
  );
  placeholders.forEach((placeholder) => {
    const componentName = placeholder.dataset.reactComponentPlaceholder;
    if (!componentName) throw Error("no component name provided element");
    const datasetProps = { ...placeholder.dataset };
    delete datasetProps.reactComponentPlaceholder;

    renderComponent(
      placeholder,
      initComponent(componentName, {
        ...datasetProps,
        children: placeholder.innerHTML,
      })
    );
  });
};

let isRenderingStarted = false;
const scheduleForWhenHTMLIsReady = (fn) => {
  if (isRenderingStarted) return;

  if (["interactive", "complete"].includes(document.readyState)) {
    isRenderingStarted = true;
    return fn();
  }

  // Alternative to DOMContentLoaded event
  document.onreadystatechange = async () => {
    scheduleForWhenHTMLIsReady(fn);
  };
};

export function renderComponent(element, component, props) {
  ReactDOM.render(
    React.createElement(() => {
      return <Provider store={store}>{component}</Provider>;
    }, props),
    element
  );
}

export const initComponent = (componentName, props) => {
  // console.log("initComponent", componentName, props);

  if (componentName === "SiteHeader") return <SiteHeader {...props} />;
  if (componentName === "SiteFooter") return <SiteFooter {...props} />;

  if (componentName === "PageQuizResult") {
    const params = getAllUrlParams();
    const skinCareGoals = trimSkinGoalsList(params.goals);
    const skinType = params.type;
    const quiz =
      Array.isArray(skinCareGoals) && skinCareGoals.length && skinType
        ? {
            skinCareGoals,
            skinType,
          }
        : null;

    if (!quiz)
      return goToQuizOrResults(
        window.theme.quiz.skinType,
        window.theme.quiz.skinCareGoals
      );

    props.recommendedSKUs = quiz ? quiz2skuList(skinType, skinCareGoals) : null;
    props.quiz = quiz;
  }
  if (componentName === "PageLogin") {
    props.isSent = props.isSent == "1" ? true : false;
  }
  if (componentName === "PageContactUs") {
    props.isSent = props.isSent && props.isSent != "null" ? true : false;
  }
  if (componentName === "PageVideos" || componentName === "PageVideoDetails") {
    const videoGoals =
      window.theme &&
      window.theme.quiz &&
      Array.isArray(window.theme.quiz.videoGoals)
        ? window.theme.quiz.videoGoals
        : null;
    props.goals = videoGoals;
  }

  return lazyLoadComponent(componentName, props);
};

const getFallback = (props) => {
  return props.children ? (
    <div dangerouslySetInnerHTML={{ __html: props.children }} />
  ) : (
    <LoadingIndicator />
  );
};

const lazyLoadComponent = (componentName, props) => {
  const Component = React.lazy(() => dynamicImport(componentName));
  return (
    <Suspense fallback={getFallback(props)}>
      <Component {...props} />
    </Suspense>
  );
};

const dynamicImport = (componentName) => {
  switch (componentName) {
    case "Translate":
      return import(
        /* webpackChunkName: "Translate" */
        /* webpackPrefetch: true */
        `@Components/SharedComponents/Translate`
      );
    case "PageHomePage":
      return import(
        /* webpackChunkName: "PageHomePage" */
        /* webpackPrefetch: true */
        `@Components/PageHomePage`
      );
    case "PageQuiz":
      return import(
        /* webpackChunkName: "PageQuiz" */
        /* webpackPrefetch: true */
        `@Components/PageQuiz`
      );
    case "PageQuizResult":
      return import(
        /* webpackChunkName: "PageQuizResult" */
        /* webpackPrefetch: true */
        `@Components/PageQuizResult`
      );
    case "PageProductDetails":
      return import(
        /* webpackChunkName: "PageProductDetails" */
        /* webpackPrefetch: true */
        `@Components/PageProductDetails`
      );
    case "PageProductsList":
      return import(
        /* webpackChunkName: "PageProductsList" */
        /* webpackPrefetch: true */
        `@Components/PageProductsList`
      );
    case "Checkout":
      return import(
        /* webpackChunkName: "Checkout" */
        /* webpackPrefetch: true */
        `@Components/Checkout`
      );
    case "PageVideos":
      return import(
        /* webpackChunkName: "PageVideos" */
        /* webpackPrefetch: true */
        `@Components/PageVideos`
      );
    case "PageVideoDetails":
      return import(
        /* webpackChunkName: "PageVideoDetails" */
        /* webpackPrefetch: true */
        `@Components/PageVideo`
      );
    case "PageLogin":
      return import(
        /* webpackChunkName: "PageLogin" */
        /* webpackPrefetch: true */
        `@Components/Login`
      );
    case "PageCustomerVideo":
      return import(
        /* webpackChunkName: "PageCustomerVideo" */
        /* webpackPrefetch: true */
        `@Components/Customer/PageVideo`
      );
    case "PageCustomerOrders":
      return import(
        /* webpackChunkName: "PageCustomerOrders" */
        /* webpackPrefetch: true */
        `@Components/Customer/PageOrderList`
      );

    case "PageRegisterAccount":
      return import(
        /* webpackChunkName: "PageRegisterAccount" */
        /* webpackPrefetch: true */
        `@Components/PageRegisterAccount`
      );
    case "PageFAQ":
      return import(
        /* webpackChunkName: "PageFAQ" */
        /* webpackPrefetch: true */
        `@Components/FAQ`
      );
    case "PageDelivery":
      return import(
        /* webpackChunkName: "PageDelivery" */
        /* webpackPrefetch: true */
        `@Components/PageDelivery`
      );
    case "PageContactUs":
      return import(
        /* webpackChunkName: "PageContactUs" */
        /* webpackPrefetch: true */
        `@Components/ContactUs`
      );
    case "PageAbout":
      return import(
        /* webpackChunkName: "PageAbout" */
        /* webpackPrefetch: true */
        `@Components/PageAbout`
      );
    case "Blog":
      return import(
        /* webpackChunkName: "Blog" */
        /* webpackPrefetch: true */
        `@Components/Blog`
      );
    case "BlogPost":
      return import(
        /* webpackChunkName: "BlogPost" */
        /* webpackPrefetch: true */
        `@Components/Blog/sections/post`
      );
    case "PageLanding":
      return import(
        /* webpackChunkName: "PageLanding" */
        /* webpackPrefetch: true */
        `@Components/PageLanding/index.tsx`
      );

    default:
      throw Error("unknown component - " + componentName);
      return null;
  }
};
