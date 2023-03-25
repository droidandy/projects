import React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
  <svg width="230" height="149" viewBox="0 0 230 149" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_dddddd)">
        <path d="M188 4H155.087C153.833 4 152.607 4.37705 151.57 5.08222L136.511 15.3178C135.474 16.0229 134.248 16.4 132.994 16.4H118.02C116.528 16.4 115.086 16.933 113.952 17.9028L95.7268 33.4972C94.5934 34.467 93.1507 35 91.6589 35H74.5298C73.3588 35 72.2113 34.6714 71.2178 34.0515L51 21.4375" stroke="url(#paint0_linear)" stroke-width="1.2514"/>
    </g>
    <circle cx="188.246" cy="3.75419" r="3.75419" fill="#475569"/>
    <defs>
      <filter id="filter0_dddddd" x="0.612957" y="3.37433" width="237.443" height="144.877" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="1.73147"/>
        <feGaussianBlur stdDeviation="0.692587"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.631373 0 0 0 0 0.631373 0 0 0 0 0.631373 0 0 0 0.160253 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="4.16096"/>
        <feGaussianBlur stdDeviation="1.66438"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.631373 0 0 0 0 0.631373 0 0 0 0 0.631373 0 0 0 0.230219 0"/>
        <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="7.83471"/>
        <feGaussianBlur stdDeviation="3.13389"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.631373 0 0 0 0 0.631373 0 0 0 0 0.631373 0 0 0 0.285 0"/>
        <feBlend mode="normal" in2="effect2_dropShadow" result="effect3_dropShadow"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="13.9758"/>
        <feGaussianBlur stdDeviation="5.59032"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.631373 0 0 0 0 0.631373 0 0 0 0 0.631373 0 0 0 0.339781 0"/>
        <feBlend mode="normal" in2="effect3_dropShadow" result="effect4_dropShadow"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="26.1402"/>
        <feGaussianBlur stdDeviation="10.4561"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.631373 0 0 0 0 0.631373 0 0 0 0 0.631373 0 0 0 0.409747 0"/>
        <feBlend mode="normal" in2="effect4_dropShadow" result="effect5_dropShadow"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="62.5698"/>
        <feGaussianBlur stdDeviation="25.0279"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.633333 0 0 0 0 0.633333 0 0 0 0 0.633333 0 0 0 0.57 0"/>
        <feBlend mode="normal" in2="effect5_dropShadow" result="effect6_dropShadow"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect6_dropShadow" result="shape"/>
      </filter>
      <linearGradient id="paint0_linear" x1="120" y1="36.5" x2="61" y2="36.5" gradientUnits="userSpaceOnUse">
        <stop stop-color="#94A3B8"/>
        <stop offset="1" stop-color="#94A3B8" stop-opacity="0"/>
      </linearGradient>
    </defs>
  </svg>
`;

export default (): JSX.Element => <SvgXml xml={xml} width="230px" height="149px" />;
