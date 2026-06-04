import { Navigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

// Enveloppe une page pour la proteger.
// - si pas connecte -> redirige vers /connexion
// - si adminRequis et pas admin -> redirige vers l'accueil
export default function RouteProtegee({ children, adminRequis = false }) {
  const { estConnecte, estAdmin } = useAuth()

  if (!estConnecte) {
    return <Navigate to="/connexion" replace />
  }
  if (adminRequis && !estAdmin) {
    return <Navigate to="/" replace />
  }
  return children
}