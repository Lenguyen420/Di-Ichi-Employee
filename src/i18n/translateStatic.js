export const translateStatic = (t, value, options) => {
  if (value === null || value === undefined || value === '') return value
  return t(String(value), { defaultValue: String(value), ...options })
}
