import styles from "./Input.module.css"
import React from 'react'

const Input = ({value, onChange, type, fullwidth, ...rest}) => {
  return (
    <div>
        <input style={{width : fullwidth === "true" ? "100%" : "inherit"}} typeof={type || "text"} value={value} onChange={onChange} className={styles.input} type="text" {...rest} />
    </div>
  )
}

export default Input