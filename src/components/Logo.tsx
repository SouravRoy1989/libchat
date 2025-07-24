// src\components\Logo.tsx
import React from 'react';

export default function Logo() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M31.25 10.5C31.25 10.5 22.4167 12.1667 15.4167 20.0833C8.41667 28 4.58333 34.6667 4.58333 34.6667C4.58333 34.6667 13.4167 32.9167 20.4167 25C27.4167 17.0833 31.25 10.5 31.25 10.5Z"
        fill="url(#paint0_linear_687_1063)"
      ></path>
      <path
        d="M20.4167 6.33331C20.4167 6.33331 29.25 8 36.25 15.9166C43.25 23.8333 39.4167 30.5 39.4167 30.5C39.4167 30.5 30.5833 28.75 23.5833 20.8333C16.5833 12.9166 20.4167 6.33331 20.4167 6.33331Z"
        fill="url(#paint1_linear_687_1063)"
      ></path>
      <defs>
        <linearGradient
          id="paint0_linear_687_1063"
          x1="17.9167"
          y1="10.5"
          x2="17.9167"
          y2="34.6667"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1675D6"></stop>
          <stop offset="1" stopColor="#00D67E"></stop>
        </linearGradient>
        <linearGradient
          id="paint1_linear_687_1063"
          x1="29.9167"
          y1="6.33331"
          x2="29.9167"
          y2="30.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#C850C0"></stop>
          <stop offset="1" stopColor="#FFCC70"></stop>
        </linearGradient>
      </defs>
    </svg>
  );
}
