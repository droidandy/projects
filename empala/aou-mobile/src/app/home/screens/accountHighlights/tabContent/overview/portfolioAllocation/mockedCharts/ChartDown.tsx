import React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
  <svg width="238" height="158" viewBox="0 0 238 158" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_dddddd)">
        <path d="M192 44L162.994 31.8074C162.665 31.6694 162.349 31.5036 162.049 31.3117L145.232 20.5655C143.249 19.2981 140.722 19.2509 138.693 20.4435L123.556 29.339C121.254 30.6919 118.347 30.4348 116.318 28.6988L98.4701 13.4275C98.1379 13.1433 97.7769 12.8947 97.3929 12.6857L79.198 2.78444C76.7195 1.4357 73.6449 1.91275 71.6917 3.94912L51.5 25" stroke="url(#paint0_linear)" stroke-width="1.2514"/>
    </g>
    <circle r="3.75419" transform="matrix(1 0 0 -1 192.246 44.2458)" fill="#475569"/>
    <defs>
      <filter id="filter0_dddddd" x="0.992596" y="1.39746" width="241.306" height="155.805" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
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
      <linearGradient id="paint0_linear" x1="124" y1="11.5" x2="65" y2="11.5" gradientUnits="userSpaceOnUse">
        <stop stop-color="#94A3B8"/>
        <stop offset="1" stop-color="#94A3B8" stop-opacity="0"/>
      </linearGradient>
    </defs>
  </svg>
`;

export default (): JSX.Element => <SvgXml xml={xml} width="238px" height="158px" />;
