import * as React from 'react'
import { forwardRef } from 'react'
import { Ref } from 'react'
import styles from './InputField.module.css'
export interface IInputFieldProps {
  name: string
  id: string
  placeholder?: string
  type?: string
  className?: string
  value?: string
  disabled?: boolean
}

const InputField = forwardRef(
  (props: IInputFieldProps, ref: Ref<HTMLInputElement>) => {
    return (
      <input
        className={`${props.className || ''} ${styles['input']}`}
        type={props.type || 'text'}
        name={props.name}
        id={props.id}
        placeholder={props.placeholder || ''}
        ref={ref}
        value={props.value || ''}
        disabled={props.disabled || false}
      />
    )
  }
)

export default InputField
