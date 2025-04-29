import React from "react";

export function KeplrIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width="24"
      height="24"
      viewBox="0 0 100 100"
      {...props}
    >
      <defs>
        <linearGradient
          id="likecoin-evm-wallet-connector-keplr-icon-bg-fill-1"
          x1="50"
          x2="50"
          y1=".279"
          y2="100.279"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#1FD1FF" />
          <stop offset="1" stop-color="#1BB8FF" />
        </linearGradient>
        <radialGradient
          id="likecoin-evm-wallet-connector-keplr-icon-bg-fill-2"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="rotate(-45.156 118.416 42.5) scale(160.368 162.768)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#232DE3" />
          <stop offset="1" stop-color="#232DE3" stop-opacity="0" />
        </radialGradient>
        <radialGradient
          id="likecoin-evm-wallet-connector-keplr-icon-bg-fill-3"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(-75.04053 -66.50709 101.40455 -114.41565 94.614 99.708)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#8B4DFF" />
          <stop offset="1" stop-color="#8B4DFF" stop-opacity="0" />
        </radialGradient>
        <radialGradient
          id="likecoin-evm-wallet-connector-keplr-icon-bg-fill-4"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(0 78.8417 -191.291 0 49.167 1.02)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#24D5FF" />
          <stop offset="1" stop-color="#1BB8FF" stop-opacity="0" />
        </radialGradient>
      </defs>
      <circle
        cx="50"
        cy="50"
        r="50"
        fill="url(#likecoin-evm-wallet-connector-keplr-icon-bg-fill-1)"
      />
      <circle
        cx="50"
        cy="50"
        r="50"
        fill="url(#likecoin-evm-wallet-connector-keplr-icon-bg-fill-2)"
      />
      <circle
        cx="50"
        cy="50"
        r="50"
        fill="url(#likecoin-evm-wallet-connector-keplr-icon-bg-fill-3)"
      />
      <circle
        cx="50"
        cy="50"
        r="50"
        fill="url(#likecoin-evm-wallet-connector-keplr-icon-bg-fill-4)"
      />
      <path
        fill="#fff"
        d="M39.328 77.66V54.464L61.866 77.66h12.539v-.604L48.48 50.638l23.93-25.063v-.296H59.79L39.327 47.426V25.28H29.167v52.38h10.16Z"
      />
    </svg>
  );
}
