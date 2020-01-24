import * as yup from "yup"
import "../yup-init"
import { useTranslation } from "react-i18next"
import facultyCodes from "../i18n/faculty-codes"
import { useMemo, useState, useCallback, useEffect } from "react"
import moment from "moment"

export const idNumberPattern = /^(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})$/
export const telPattern = /^(\d{2,4})(\d{3})(\d{4})$/
export const emailPattern = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

export function validateIdNumber(value) {
  if (value.length !== 13) {
    return false
  }
  if (!idNumberPattern.test(value)) {
    return false
  }
  const digits = Array.from(value.substring(0, 12)).map(ch => parseInt(ch))
  const sum = digits
    .map((d, i) => d * (13 - i))
    .reduce((a, b) => a + b, 0)
  const checkDigit = (11 - sum % 11) % 10
  return checkDigit === parseInt(value[12])
}

export function optionContains(input, option) {
  return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

export const userSchema = yup.object().shape({
  name: yup.string().required(),
  ID: yup
    .string()
    .nationalId("invalidValue")
    .required(),
  tel: yup
    .string()
    .required()
    .matches(telPattern, "invalidValue"),
  email: yup
    .string()
    .required()
    .matches(emailPattern, "invalidValue"),
  faculty: yup.string().required()
})

export function useFacultyOptions() {
  const { t } = useTranslation()
  return useMemo(() => {
    return facultyCodes.map(code => ({
      value: code,
      label: t(`facultyNames.${code}`),
    }))
  }, [t])
}

export function parseToken(token) {
  if (typeof token !== 'string') {
    return undefined
  }
  
  const parts = token.split('.')
  if (parts.length !== 3) {
    return undefined
  }
  try {
    return JSON.parse(atob(parts[1]))
  } catch {
    return undefined
  }
}

export function useCurrentTime(format = 'HH:mm:ss') {
  const [time, setTime] = useState('')

  const updateTime = useCallback(() => {
    setTime(moment().format(format))
  }, [format])

  useEffect(() => {
    const clear = setInterval(() => {
      updateTime()
    }, 1000)
    updateTime()
    return () => clearInterval(clear)
  }, [updateTime])

  return time
}
