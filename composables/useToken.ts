export const useToken = () => {
  const get = () => {
    if (process.client && typeof localStorage !== 'undefined') return localStorage.getItem('token')
    return null
  }

  const set = (token: string) => {
    if (process.client) localStorage.setItem('token', token)
  }

  const remove = () => {
    if (process.client && typeof localStorage !== 'undefined') localStorage.removeItem('token')
  }

  return { get, set, remove }
}
