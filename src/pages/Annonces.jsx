import { useEffect, useState } from 'react'
import { getAnnonces } from '../api'

// Page Annonces : affiche les vraies annonces venant de l'API.
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
          <p className="text-red-700">
            {erreur}. Vérifie que le backend tourne.
          </p>
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
            <p className="mt-3 text-ardoise leading-relaxed whitespace-pre-line">
              {a.contenu}
            </p>
          </div>
        ))}
      </div>
    </article>
  )
}