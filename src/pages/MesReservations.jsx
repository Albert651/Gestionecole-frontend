import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMesReservations, supprimerReservation } from '../api'

// Couleurs selon le statut de la reservation
const styleStatut = {
  EN_ATTENTE: 'bg-amber-100 text-amber-800',
  CONFIRMEE: 'bg-green-100 text-green-800',
  ANNULEE: 'bg-red-100 text-red-700',
}

export default function MesReservations() {
  const [liste, setListe] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState(null)

  function rafraichir() {
    getMesReservations()
      .then(setListe)
      .catch((e) => setErreur(e.message))
      .finally(() => setChargement(false))
  }
  useEffect(rafraichir, [])

  async function annuler(r) {
    if (!confirm(`Annuler votre réservation pour « ${r.etablissementNom} » ?`)) return
    try {
      await supprimerReservation(r.id)
      rafraichir()
    } catch (e) {
      setErreur(e.message)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-14 animate-fadeUp">
      <p className="text-or font-semibold tracking-widest uppercase text-xs">Espace membre</p>
      <h1 className="mt-3 font-display text-4xl font-semibold leading-tight">Mes réservations</h1>

      <div className="mt-10 space-y-4">
        {chargement && <p className="text-ardoise">Chargement…</p>}
        {erreur && <p className="text-red-700">{erreur}</p>}

        {!chargement && !erreur && liste.length === 0 && (
          <p className="text-ardoise">
            Vous n'avez aucune réservation.{' '}
            <Link to="/" className="text-or font-semibold">Découvrir les établissements →</Link>
          </p>
        )}

        {liste.map((r) => (
          <div key={r.id} className="flex items-center justify-between gap-4 rounded-2xl border border-encre/10 bg-white px-6 py-5">
            <div>
              <p className="font-display text-lg font-semibold">{r.etablissementNom}</p>
              <p className="text-sm text-ardoise">
                {r.dateReservation ? new Date(r.dateReservation).toLocaleDateString('fr-FR', {
                  day: 'numeric', month: 'long', year: 'numeric',
                }) : ''}
              </p>
              {r.dateSouhaitee && (
                <p className="mt-1 text-sm text-or font-medium">
                  Date souhaitée : {new Date(r.dateSouhaitee).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' })}
                </p>
              )}
              {r.note && <p className="mt-1 text-sm text-ardoise italic">« {r.note} »</p>}
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styleStatut[r.statut] || 'bg-sable text-ardoise'}`}>
                {r.statut}
              </span>
              <button onClick={() => annuler(r)}
                className="text-xs text-red-600 hover:underline">
                Annuler
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}