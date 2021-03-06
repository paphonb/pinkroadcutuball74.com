import { useTranslation } from "react-i18next"
import facultyCodes from "../i18n/faculty-codes"
import { useMemo, useState, useEffect } from "react"
import moment from "moment"

export const isEventDay = new Date() > moment("2020-02-08T04:00:00+07:00")

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
  const sum = digits.map((d, i) => d * (13 - i)).reduce((a, b) => a + b, 0)
  const checkDigit = (11 - (sum % 11)) % 10
  return checkDigit === parseInt(value[12])
}

export function optionContains(input, option) {
  return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

export function useFacultyOptions() {
  const { t } = useTranslation()
  return useMemo(() => {
    return facultyCodes.map(code => ({
      value: code,
      label: t(`facultyNames.${code}`)
    }))
  }, [t])
}

export function parseToken(token) {
  if (typeof token !== "string") {
    return undefined
  }

  const parts = token.split(".")
  if (parts.length !== 3) {
    return undefined
  }
  try {
    return JSON.parse(atob(parts[1]))
  } catch {
    return undefined
  }
}

function getCurrentTime(disp) {
  const date = moment()
  return [date.format(disp), date.valueOf()]
}

export function useCurrentTime(opts) {
  const disp = opts?.disp !== undefined ? opts.disp : 'HH:mm:ss'
  const timeout = opts?.timeout !== undefined ? opts.timeout : 1000
  const [time, setTime] = useState(() => getCurrentTime(disp))

  useEffect(() => {
    const clear = setInterval(() => {
      setTime(getCurrentTime(disp))
    }, timeout)
    return () => clearInterval(clear)
  }, [disp, timeout])

  return time
}

export function useTimeFormat(time, disp = 'HH:mm:ss') {
  return useMemo(() => time && moment(time).format(disp), [time, disp])
}

// https://www.kirupa.com/html5/detecting_retina_high_dpi.htm
export const isHiDpi = matchMedia("(-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2), (min-resolution: 192dpi)")?.matches

// https://stackoverflow.com/a/27232658
export const supportsWebP = (() => {
  const elem = document.createElement("canvas")
  if (!!(elem.getContext && elem.getContext("2d"))) {
    // was able or not to get WebP representation
    return elem.toDataURL("image/webp").indexOf("data:image/webp") === 0
  }

  // very old browser like IE 8, canvas not supported
  return false
})()

function getWindowDimensions() {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  }
}

// https://stackoverflow.com/a/36862446
export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return windowDimensions
}

export function formatQueueNumber(number) {
  if (!number) return number
  let str = `${number}`
  while (str.length < 4) {
    str = "0" + str
  }
  return str
}

export function formatDt(dt) {
  if (!dt) return dt
  return moment(dt).format('HH:mm:ss DD/MM/YYYY')
}

export const isStandalone = window.matchMedia('(display-mode: standalone)').matches
export const landingRoute = isStandalone ? '/home' : '/'
