import { useEffect, useState } from 'react'
import { getAnnonces } from '../api'

// Ouvre la fenetre de partage Facebook pour une annonce
function partagerFacebook(annonce) {
  // On partage l'URL de la page Annonces (l'annonce y est visible).
  const url = window.location.href
  const lien =
    'https://www.facebook.com/sharer/sharer.php?u=' +
    encodeURIComponent(url) +
    '&quote=' +
    encodeURIComponent(annonce.titre + ' — ' + (annonce.contenu || ''))
  // Petite fenetre popup
  window.open(lien, 'partage-facebook', 'width=600,height=500')
}

// Page Annonces : affiche les annonces venant de l'API.
export default function Annonces() {
  const [annonces, setAnnonces] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState(null)

  useEffect(() => {
    getAnnonces()
      .then(setAnnonces)
      .catch((e) => setErreur(e.message))
      .finally(() => setChargement(false))
  }, [])

  return (
    <article className="mx-auto max-w-3xl px-6 py-14 animate-fadeUp">
      <p className="text-or font-semibold tracking-widest uppercase text-xs">
        Actualités
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold leading-tight">
        Annonces & publications
      </h1>

      <div className="mt-10 space-y-6">
        {chargement && <p className="text-ardoise">Chargement…</p>}

        {erreur && (
          <p className="text-red-700">{erreur}. Vérifie que le backend tourne.</p>
        )}

        {!chargement && !erreur && annonces.length === 0 && (
          <p className="text-ardoise">
            Aucune annonce pour l'instant. Crée-en une depuis l'espace Admin.
          </p>
        )}

        {annonces.map((a) => (
          <div key={a.id} className="rounded-2xl border border-encre/10 bg-white p-7">
            <time className="text-sm text-or font-medium">
              {a.datePublication
                ? new Date(a.datePublication).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })
                : ''}
            </time>
            <h2 className="mt-1 font-display text-2xl font-semibold">{a.titre}</h2>
            {a.etablissementNom && (
              <p className="mt-1 text-sm text-ardoise">📍 {a.etablissementNom}</p>
            )}
            <p className="mt-3 text-ardoise leading-relaxed whitespace-pre-line">
              {a.contenu}
            </p>

            {/* Bouton de partage Facebook */}
            <div className="mt-5 flex items-center gap-3 border-t border-encre/10 pt-4">
              <span className="text-sm text-ardoise">Partager :</span>
              <button
                onClick={() => partagerFacebook(a)}
                title="Partager sur Facebook"
                aria-label="Partager sur Facebook"
                className="grid place-items-center h-10 w-10 rounded-full text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#1877F2' }}
              >
                <span className="font-display text-lg leading-none">f</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}