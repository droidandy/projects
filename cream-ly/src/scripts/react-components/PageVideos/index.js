import React from "react";
import "./index.scss";

import Header from "@Components/Structure/Header";
import InstagramFeedback from "@Components/SharedComponents/InstagramFeedback";
// import ConsultationPromo from "@Components/SharedComponents/ConsultationPromo";
import MessageUs from "@Components/SharedComponents/MessageUs";
import VideoList from "../VideoList";
import VideosFilter from "./VideosFilter";
import { useTranslate } from "@Core/i18n";

const defaultLang = (window.locale && window.locale.iso_code) || "ru";

const PageVideos = ({ lang = defaultLang, videos, goals, onQuizComplete }) => {
  const t = useTranslate("PageVideos", lang);
  return (
    <div className="componentPageVideos">
      <Header isPageHeader text={t("header")} />
      <div
        key="intro"
        className="intro"
        dangerouslySetInnerHTML={{ __html: t("intro") }}
      />
      <VideosFilter
        lang={lang}
        goals={goals}
        isButtonResultsClicked={goals && goals.length}
        videos={videos}
        onComplete={onQuizComplete}
      />
      <VideoList videos={videos} isVisiblePurchasedBadge={true} />
      <MessageUs lang={lang} />
      <InstagramFeedback lang={lang} />
    </div>
  );
};

export default PageVideos;
