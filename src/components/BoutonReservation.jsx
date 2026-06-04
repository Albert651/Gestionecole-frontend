import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { reserver } from '../api'
import { useAuth } from '../AuthContext'

// Affiche un bouton "Réserver". Si l'utilisateur n'est pas connecte,
// il est invite a se connecter. Sinon, un petit formulaire apparait.
export default function BoutonReservation({ etablissement }) {
  const { estConnecte } = useAuth()
  const navigate = useNavigate()

  const [ouvert, setOuvert] = useState(false)
  const [note, setNote] = useState('')
  const [reserve, setReserve] = useState(false)
  const [erreur, setErreur] = useState(null)
  const [enCours, setEnCours] = useState(false)

  // Visiteur non connecte : on l'envoie vers la connexion
  if (!estConnecte) {
    return (
      <div className="mt-6 rounded-2xl bg-sable p-6 text-center">
        <p className="text-ardoise">Connectez-vous pour réserver cet établissement.</p>
        <button
          onClick={() => navigate('/connexion')}
          className="mt-3 rounded-xl bg-encre text-creme px-6 py-2.5 font-semibold hover:bg-or hover:text-encre transition-colors"
        >
          Se connecter pour réserver
        </button>
      </div>
    )
  }

  async function envoyer() {
    setEnCours(true); setErreur(null)
    try {
      await reserver({ etablissementId: etablissement.id, note })
      setReserve(true)
    } catch (e) {
      setErreur(e.message)
    } finally {
      setEnCours(false)
    }
  }

  if (reserve) {
    return (
      <div className="mt-6 rounded-2xl bg-encre text-creme p-6 text-center">
        <p className="font-display text-xl">Réservation envoyée ! 🎉</p>
        <p className="mt-1 text-creme/80 text-sm">
          Votre demande pour {etablissement.nom} est en attente de confirmation.
          Retrouvez-la dans « Mes réservations ».
        </p>
      </div>
    )
  }

  return (
    <div className="mt-6">
      {!ouvert ? (
        <button
          onClick={() => setOuvert(true)}
          className="rounded-xl bg-or text-encre px-7 py-3 font-semibold hover:bg-encre hover:text-creme transition-colors"
        >
          Réserver cet établissement
        </button>
      ) : (
        <div className="rounded-2xl border border-encre/10 bg-white p-6 space-y-4">
          <h3 className="font-display text-xl font-semibold">Demande de réservation</h3>
          {erreur && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{erreur}</div>
          )}
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Un message ou une précision (facultatif)…"
            className="w-full rounded-xl border border-encre/15 bg-creme px-4 py-3 outline-none focus:border-or resize-none"
          />
          <div className="flex gap-3">
            <button onClick={envoyer} disabled={enCours}
              className="rounded-xl bg-encre text-creme px-6 py-2.5 font-semibold hover:bg-or hover:text-encre transition-colors disabled:opacity-50">
              {enCours ? 'Envoi…' : 'Confirmer la réservation'}
            </button>
            <button onClick={() => setOuvert(false)}
              className="rounded-xl border border-encre/15 px-6 py-2.5 text-ardoise hover:text-encre transition-colors">
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
