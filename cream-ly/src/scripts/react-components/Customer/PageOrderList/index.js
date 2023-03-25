import React from "react";
import { connect } from "@Components/index";
import Header from "@Components/Structure/Header";
import PageLink from "@Components/Structure/PageLink";
import VideoList from "@Components/VideoList";
import {useTranslate} from "@Core/i18n";

import "./index.scss";
import Order from "./sections/Order";

const PageOrderList = ({ orders, email, lang, videos }) => {
  const tOrderList = useTranslate("PageOrderList", lang);
  const tCustomerAccount = useTranslate("PageCustomerAccount", lang);
  return (
    <div className="PageOrderList">
      <div className="intro">{tCustomerAccount("loggedInAs", {email})}</div>
      <div className="logout">
        <PageLink pageType="PAGE_CUSTOMER_LOGOUT">
          {tCustomerAccount("logout")}
        </PageLink>
      </div>
      {Boolean(videos.length) && (
        <>
          <Header text={tCustomerAccount("videoTitle")} />
          {lang === "en" && (
            <p className="text-center">
              Sorry, videos are only available in Russian for now, we are
              working on translations
            </p>
          )}
          <VideoList videos={videos} hideFreeBadge={true} lang={lang} />
        </>
      )}
      <Header text={tOrderList("title")} />
      <div>
        {orders.map((order, index) => (
          <Order
            key={order.id}
            order={order}
            lang={lang}
            isCollapsed={index !== 0}
          />
        ))}
        {orders.length === 0 && (
          <div className="text-center" data-test="order-noOrders">
            {tOrderList("noOrders")}
          </div>
        )}
      </div>
    </div>
  );
};

export default connect((state, ownProps) => {
  const videos = ownProps.videos || state.products.videos;
  const customerVideos = ownProps.customerVideos || state.customer.videos;
  const availableCustomerVideos =
    Array.isArray(videos) && Array.isArray(customerVideos)
      ? videos
          .filter(video =>
            customerVideos.some(handle => video.handle === handle)
          )
          .map(video => {
            return { ...video, url: video.pageURL };
          })
      : [];

  return {
    videos: availableCustomerVideos,
    email: ownProps.email ? ownProps.email : state.customer.email,
    orders: ownProps.orders ? ownProps.orders : state.customer.orders,
    products: state.products.list
  };
}, null)(PageOrderList);
