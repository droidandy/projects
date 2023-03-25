import React from "react";
import * as stories from "./index.stories";

const lang = "dev";

export default {
  title: stories.getTitleData(lang),
};

export const allPossibleVariants = (props) =>
  stories.allPossibleVariants({ ...props, lang });

export const noSelectedProducts = (props) =>
  stories.noSelectedProducts({ ...props, lang });

/* 
export const partiallySelectedProducts = (props) =>
  stories.partiallySelectedProducts({ ...props, lang }); */
/* 

export const loadingState = props =>
  stories.loadingState({...props, lang: "en"});

export const allGoalsSelected = (props) =>
  stories.allGoalsSelected({ ...props, lang: "en" });

 */
