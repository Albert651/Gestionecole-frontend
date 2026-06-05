import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { reserver } from '../api'
import { useAuth } from '../AuthContext'

// Bouton + formulaire de reservation. Si l'utilisateur n'est pas connecte,
// il est invite a se connecter.
export default function BoutonReservation({ etablissement }) {
  const { estConnecte, utilisateur } = useAuth()
  const navigate = useNavigate()

  const [ouvert, setOuvert] = useState(false)
  // On pre-remplit le nom avec celui du compte connecte
  const [form, setForm] = useState({
    nomComplet: utilisateur?.nom || '',
    telephone: '',
    dateSouhaitee: '',
    note: '',
  })
  const [reserve, setReserve] = useState(false)
  const [erreur, setErreur] = useState(null)
  const [enCours, setEnCours] = useState(false)

  const set = (champ) => (e) => setForm((f) => ({ ...f, [champ]: e.target.value }))

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
    if (!form.nomComplet || !form.telephone || !form.dateSouhaitee) {
      return setErreur('Merci de renseigner votre nom, votre téléphone et la date souhaitée.')
    }
    setEnCours(true); setErreur(null)
    try {
      await reserver({ etablissementId: etablissement.id, ...form })
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
          Vous recevrez un e-mail dès qu'elle sera traitée. Retrouvez-la dans « Mes réservations ».
        </p>
      </div>
    )
  }

  const champCss =
    'w-full rounded-xl border border-encre/15 bg-creme px-4 py-3 outline-none focus:border-or'

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
          <h3 className="font-display text-xl font-semibold">
            Réserver — {etablissement.nom}
          </h3>

          {erreur && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{erreur}</div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom complet *</label>
              <input type="text" value={form.nomComplet} onChange={set('nomComplet')}
                className={champCss} placeholder="Jean Rakoto" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Téléphone *</label>
              <input type="tel" value={form.telephone} onChange={set('telephone')}
                className={champCss} placeholder="+261 34 00 000 00" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date souhaitée *</label>
            <input type="date" value={form.dateSouhaitee} onChange={set('dateSouhaitee')}
              className={champCss} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message (facultatif)</label>
            <textarea rows={3} value={form.note} onChange={set('note')}
              className={`${champCss} resize-none`}
              placeholder="Précisez votre demande (visite, inscription…)" />
          </div>

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