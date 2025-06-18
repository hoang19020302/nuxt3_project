export const useFavorites = () => {
  const get = () => {
    if (process.client && typeof localStorage !== 'undefined') return localStorage.getItem('favorites')
    return null
  }

  const set = (favorites: string) => {
    if (process.client) localStorage.setItem('favorites', favorites)
  }

  const remove = () => {
    if (process.client && typeof localStorage !== 'undefined') localStorage.removeItem('favorites')
  }

  return { get, set, remove }
}
