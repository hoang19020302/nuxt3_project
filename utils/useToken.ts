export const getToken = () => {
  if (process.client) {
    return localStorage.getItem('token')
  }
  return null
}

export const setToken = (token: string) => {
  if (process.client) {
    localStorage.setItem('token', token)
  }
}

export const removeToken = () => {
  if (process.client) {
    localStorage.removeItem('token')
  }
}
