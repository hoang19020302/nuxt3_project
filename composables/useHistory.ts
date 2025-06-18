export const useHistory = () => {
  const get = () => {
    if (process.client && typeof localStorage !== 'undefined') return localStorage.getItem('history')
    return null
  }

  const set = (history: string) => {
    if (process.client) localStorage.setItem('history', history)
  }

  const remove = () => {
    if (process.client && typeof localStorage !== 'undefined') localStorage.removeItem('history')
  }

  return { get, set, remove }
}
