const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/

export const email = val => (!val || emailPattern.test(val)) || 'Please enter a valid email address'
export const required = val => !!val || 'Field is required'
export const phone = val => val.length === 10 || 'Phone number must be 10 digits'
export const strongPassword = val => {
  return (
    val.length >= 6 && // minimum 6 characters
    /[a-z]/.test(val) && // checks for a-z
    /[0-9]/.test(val) && // checks for 0-9
    /\W|_/.test(val) && // checks for special char
    val.length >= 6
  )
}
