import React from "react";
import styles from "./field.module.css";
import { Field } from "../index";

const FieldInput = React.forwardRef(({ error, ...props }, ref) => {
  return (
    <Field error={error}>
      <input
        ref={ref} // Важно для react-hook-form
        className={styles.field__input}
        {...props}
      />
    </Field>
  );
});

export default FieldInput;
