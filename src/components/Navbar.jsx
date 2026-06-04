import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Navbar() {
  const { estConnecte, estAdmin, utilisateur, deconnecter } = useAuth()
  const navigate = useNavigate()

  const liens = [
    { to: '/', label: 'Établissements', exact: true },
    { to: '/communique', label: 'Communiqué' },
    { to: '/annonces', label: 'Annonces' },
    { to: '/contact', label: 'Contact' },
  ]

  function seDeconnecter() {
    deconnecter()
    navigate('/')
  }

  return (
    <header className="border-b border-encre/10 bg-creme/80 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3 group">
          <span className="grid place-items-center w-10 h-10 rounded-full bg-encre text-or font-display font-semibold text-lg">
            É
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">
            Établissements <span className="text-or">Scolaires</span>
          </span>
        </NavLink>

        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
          {liens.map((lien) => (
            <NavLink key={lien.to} to={lien.to} end={lien.exact}
              className={({ isActive }) => `transition-colors hover:text-or ${isActive ? 'text-or' : 'text-ardoise'}`}>
              {lien.label}
            </NavLink>
          ))}

          {/* Lien visible seulement si connecte */}
          {estConnecte && (
            <NavLink to="/mes-reservations"
              className={({ isActive }) => `transition-colors hover:text-or ${isActive ? 'text-or' : 'text-ardoise'}`}>
              Mes réservations
            </NavLink>
          )}

          {/* Lien Admin : visible uniquement pour un administrateur */}
          {estAdmin && (
            <NavLink to="/admin"
              className={({ isActive }) =>
                `rounded-lg px-3 py-1.5 border transition-colors ${
                  isActive ? 'bg-encre text-creme border-encre' : 'border-encre/20 text-encre hover:border-or hover:text-or'
                }`}>
              Admin
            </NavLink>
          )}

          {estConnecte ? (
            <div className="flex items-center gap-3 pl-2">
              <span className="text-encre">Bonjour, <strong>{utilisateur?.nom}</strong></span>
              <button onClick={seDeconnecter}
                className="rounded-lg px-3 py-1.5 border border-encre/20 text-ardoise hover:border-or hover:text-or transition-colors">
                Déconnexion
              </button>
            </div>
          ) : (
            <NavLink to="/connexion"
              className="rounded-lg bg-encre text-creme px-4 py-1.5 hover:bg-or hover:text-encre transition-colors">
              Connexion
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}