import React from "react";

interface LogoProps {
  size?: { width: string; height: string };
}

const Logo = ({ size }: LogoProps) => {
  return (
    <svg
      width={size ? size.width : "107"}
      height={size ? size.height : "88"}
      viewBox="0 0 107 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_116_279)">
        <path
          d="M105.19 29.5C100.34 15.23 84.77 6.37 64.58 6.37C56.72 6.37 48.74 7.73 40.85 10.41C12.26 20.13 -5.39999 44.51 1.49001 64.76C6.34001 79.03 21.9 87.89 42.09 87.89C49.95 87.89 57.93 86.53 65.82 83.85C79.51 79.2 91.15 71.09 98.59 61.02C106.24 50.67 108.58 39.48 105.19 29.5ZM94.85 52.64C88.42 61.34 78.29 68.37 66.32 72.44C59.39 74.8 52.4 75.99 45.53 75.99C28.9 75.99 15.69 68.73 11.87 57.49C6.24001 40.95 21.52 20.74 45.92 12.44C52.85 10.09 59.84 8.89 66.72 8.89C83.35 8.89 96.56 16.15 100.38 27.39C103.05 35.24 101.08 44.21 94.85 52.64Z"
          fill="url(#paint0_linear_116_279)"
        />
        <path
          d="M17 1.24V0H0V17.21H17V1.24ZM14.52 14.74H2.47V2.48H14.52V14.74Z"
          fill="url(#paint1_linear_116_279)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_116_279"
          x1="-74.0363"
          y1="47.1299"
          x2="93.9926"
          y2="47.1299"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#F8EDB4" />
          <stop offset="0.35" stop-color="#DBBF78" />
          <stop offset="1" stop-color="#8C6E34" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_116_279"
          x1="-19.6224"
          y1="8.6073"
          x2="70.8635"
          y2="8.6073"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#F8EDB4" />
          <stop offset="0.35" stop-color="#DBBF78" />
          <stop offset="1" stop-color="#8C6E34" />
        </linearGradient>
        <clipPath id="clip0_116_279">
          <rect width="107" height="88" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const LogoSM = () => {
  return <Logo size={{ width: "26.75", height: "22" }} />;
};

export default Logo;
