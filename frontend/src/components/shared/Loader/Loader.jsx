import React from 'react'
import styles from "./Loader.module.css"
import Card from '../card/Card'

const Loader = ({message}) => {
  return (
    <div className={styles.cardWrapper}>
        <Card>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid"
            width="200"
            height="200"
            style={{
                shapeRendering: "auto",
                display: "block",
                background: "transparent",
                width: "50px",
                height: "50px",
                animation: "none",
                marginBottom: "1.75rem",
            }}
            >
            <g>
                <circle
                strokeDasharray="164.93361431346415 56.97787143782138"
                r="35"
                strokeWidth="7"
                stroke="#e15b64"
                fill="none"
                cy="50"
                cx="50"
                style={{
                    fill: "none",
                    stroke: "#5453E0",
                    animation: "spin 1s linear infinite", // CSS animation
                }}
                />
            </g>
            <style>
                {`
                @keyframes spin {
                    0% {
                    transform: rotate(0deg);
                    }
                    100% {
                    transform: rotate(360deg);
                    }
                }
                circle {
                    transform-origin: center; /* Ensure rotation is from the center */
                }
                `}
            </style>
            </svg>


            <span className={styles.message}>{message}</span>
        </Card>
      </div>
  )
}

export default Loader