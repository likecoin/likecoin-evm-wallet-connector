import React from "react";

export function CosmostationIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 100 100"
      width="24"
      height="24"
      {...props}
    >
      <circle cx="50" cy="50" r="50" fill="#fff" />
      <path
        fill="#9C6CFF"
        d="M68.553 18.041h-26.72a3.8 3.8 0 0 0-3.285 1.896l-13.36 23.138a3.78 3.78 0 0 0 0 3.793l13.36 23.138 6.57-3.792L32.86 44.972l11.166-19.346H66.37l12.268 21.242 6.57-3.793-13.37-23.138a3.79 3.79 0 0 0-3.285-1.896Z"
      />
      <path
        fill="#05D2DD"
        d="m61.37 30.616-6.57 3.792L67.07 55.65 55.902 74.996H33.559L21.29 53.754l-6.57 3.792 13.36 23.138a3.792 3.792 0 0 0 3.285 1.896h26.72a3.8 3.8 0 0 0 3.284-1.896l13.36-23.138a3.78 3.78 0 0 0 0-3.792L61.37 30.616Z"
      />
    </svg>
  );
}
