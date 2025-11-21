import React from "react";

export const MENU_ICON = React.memo(({ className = "" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m4 6 16 0" strokeWidth="2"></path>
    <path d="m4 12 16 0" strokeWidth="2"></path>
    <path d="m4 18 16 0" strokeWidth="2"></path>
  </svg>
));

export const X_ICON = React.memo(({ className = "" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18" strokeWidth="2"></path>
    <path d="m6 6 12 12" strokeWidth="2"></path>
  </svg>
));

export const CHECK_ICON = React.memo(({ className = "" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12l5 5l10 -10" strokeWidth="2"></path>
  </svg>
))