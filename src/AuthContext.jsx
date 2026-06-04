import { createContext, useContext, useState } from 'react'

// Le "contexte" permet de partager l'utilisateur connecte dans toute l'appli,
// sans avoir a le passer manuellement de composant en composant.
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // On lit le jeton et l'utilisateur depuis localStorage au demarrage
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [utilisateur, setUtilisateur] = useState(() => {
    const u = localStorage.getItem('utilisateur')
    return u ? JSON.parse(u) : null
  })

  // Appelee apres une connexion/inscription reussie
  function connecter(data) {
    // data = { token, nom, email, role }
    const u = { nom: data.nom, email: data.email, role: data.role }
    localStorage.setItem('token', data.token)
    localStorage.setItem('utilisateur', JSON.stringify(u))
    setToken(data.token)
    setUtilisateur(u)
  }

  function deconnecter() {
    localStorage.removeItem('token')
    localStorage.removeItem('utilisateur')
    setToken(null)
    setUtilisateur(null)
  }

  const valeur = {
    token,
    utilisateur,
    estConnecte: !!token,
    estAdmin: utilisateur?.role === 'ADMIN',
    connecter,
    deconnecter,
  }

  return <AuthContext.Provider value={valeur}>{children}</AuthContext.Provider>
}

// Petit raccourci pour utiliser le contexte dans n'importe quel composant
export function useAuth() {
  return useContext(AuthContext)
}