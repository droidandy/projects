import React from "react";

const SubmitSpinner = () => {
    return (
        <svg
            width="19"
            height="56"
            viewBox="0 0 19 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M0.999999 9.5C1 14.1944 4.80558 18 9.5 18C14.1944 18 18 14.1944 18 9.5C18 7.43461 17.2634 5.54128 16.0385 4.0684C14.4793 2.19357 12.129 0.999999 9.5 0.999999"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <defs>
                <linearGradient
                    id="paint0_linear"
                    x1="9.02778"
                    y1="9.5"
                    x2="3.36111"
                    y2="9.5"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
    );
};

export default SubmitSpinner;
