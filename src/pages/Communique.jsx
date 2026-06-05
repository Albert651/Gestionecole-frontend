import { useEffect, useState } from 'react'
import { getCommuniques } from '../api'

// Page Communiqué : affiche les communiqués venant de l'API.
// Chaque communiqué détaille les modalités d'admission et les frais.
export default function Communique() {
  const [liste, setListe] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState(null)

  useEffect(() => {
    getCommuniques()
      .then(setListe)
      .catch((e) => setErreur(e.message))
      .finally(() => setChargement(false))
  }, [])

  return (
    <article className="mx-auto max-w-3xl px-6 py-14 animate-fadeUp">
      <p className="text-or font-semibold tracking-widest uppercase text-xs">
        Communiqués officiels
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold leading-tight">
        Admission, scolarité & inscription
      </h1>

      <div className="mt-10 space-y-8">
        {chargement && <p className="text-ardoise">Chargement…</p>}
        {erreur && <p className="text-red-700">{erreur}</p>}

        {!chargement && !erreur && liste.length === 0 && (
          <p className="text-ardoise">
            Aucun communiqué pour l'instant. Publiez-en un depuis l'espace Admin.
          </p>
        )}

        {liste.map((c) => (
          <section key={c.id} className="rounded-2xl border border-encre/10 bg-white p-7">
            <time className="text-sm text-or font-medium">
              {c.datePublication
                ? new Date(c.datePublication).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })
                : ''}
            </time>
            <h2 className="mt-1 font-display text-2xl font-semibold">{c.titre}</h2>
            {c.etablissementNom && (
              <p className="mt-1 text-sm text-ardoise">📍 {c.etablissementNom}</p>
            )}

            {c.modalitesAdmission && (
              <div className="mt-4">
                <h3 className="font-semibold text-encre">Modalités d'admission</h3>
                <p className="mt-1 text-ardoise leading-relaxed whitespace-pre-line">
                  {c.modalitesAdmission}
                </p>
              </div>
            )}

            {(c.fraisInscription || c.fraisScolarite) && (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {c.fraisInscription && (
                  <div className="rounded-2xl bg-encre text-creme p-5">
                    <p className="text-or text-xs font-semibold uppercase tracking-wide">
                      Frais d'inscription
                    </p>
                    <p className="mt-1 font-display text-2xl font-semibold">{c.fraisInscription}</p>
                  </div>
                )}
                {c.fraisScolarite && (
                  <div className="rounded-2xl bg-sable p-5">
                    <p className="text-or text-xs font-semibold uppercase tracking-wide">
                      Frais de scolarité
                    </p>
                    <p className="mt-1 font-display text-2xl font-semibold">{c.fraisScolarite}</p>
                    {c.periodeScolarite && (
                      <p className="mt-1 text-sm text-ardoise">{c.periodeScolarite}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        ))}
      </div>
    </article>
  )
}