import { useEffect, useState } from 'react'
import {
  getEtablissements, creerEtablissement, modifierEtablissement, supprimerEtablissement,
  getAnnonces, creerAnnonce, supprimerAnnonce,
  getMessages, supprimerMessage,
  getToutesReservations, changerStatutReservation, supprimerReservation,
} from '../api'
import ImportPhoto from '../components/ImportPhoto'

// Petit champ de saisie reutilisable
function Champ({ label, valeur, onChange, type = 'text', placeholder, aire }) {
  const commun =
    'w-full rounded-xl border border-encre/15 bg-white px-4 py-3 outline-none focus:border-or'
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      {aire ? (
        <textarea rows={3} value={valeur} onChange={(e) => onChange(e.target.value)}
          className={`${commun} resize-none`} placeholder={placeholder} />
      ) : (
        <input type={type} value={valeur} onChange={(e) => onChange(e.target.value)}
          className={commun} placeholder={placeholder} />
      )}
    </div>
  )
}

export default function Admin() {
  const [onglet, setOnglet] = useState('etablissements')
  const [message, setMessage] = useState(null)

  function notifier(type, texte) { setMessage({ type, texte }) }

  const onglets = [
    { cle: 'etablissements', label: 'Établissements' },
    { cle: 'annonces', label: 'Annonces' },
    { cle: 'messages', label: 'Messages reçus' },
    { cle: 'reservations', label: 'Réservations' },
  ]

  return (
    <div className="mx-auto max-w-5xl px-6 py-14 animate-fadeUp">
      <p className="text-or font-semibold tracking-widest uppercase text-xs">Espace administration</p>
      <h1 className="mt-3 font-display text-4xl font-semibold leading-tight">Back office</h1>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-encre/10">
        {onglets.map((o) => (
          <button key={o.cle} onClick={() => { setOnglet(o.cle); setMessage(null) }}
            className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              onglet === o.cle ? 'border-or text-encre' : 'border-transparent text-ardoise hover:text-encre'
            }`}>
            {o.label}
          </button>
        ))}
      </div>

      {message && (
        <div className={`mt-6 rounded-xl px-5 py-3 text-sm ${
          message.type === 'ok' ? 'bg-green-50 text-green-800 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.texte}
        </div>
      )}

      <div className="mt-8">
        {onglet === 'etablissements' && <GestionEtablissements notifier={notifier} />}
        {onglet === 'annonces' && <GestionAnnonces notifier={notifier} />}
        {onglet === 'messages' && <GestionMessages notifier={notifier} />}
        {onglet === 'reservations' && <GestionReservations notifier={notifier} />}
      </div>
    </div>
  )
}

// ---------- Onglet ÉTABLISSEMENTS (avec création ET modification) ----------
const etabVide = {
  nom: '', description: '', adresse: '', caracteristiques: '',
  imageUrl: '', logoUrl: '', email: '', telephone: '',
}

function GestionEtablissements({ notifier }) {
  const [form, setForm] = useState(etabVide)
  const [liste, setListe] = useState([])
  const [enCours, setEnCours] = useState(false)
  // id de l'etablissement en cours de modification (null = mode creation)
  const [enEdition, setEnEdition] = useState(null)
  const set = (champ) => (val) => setForm((f) => ({ ...f, [champ]: val }))

  function rafraichir() {
    getEtablissements().then(setListe).catch((e) => notifier('erreur', e.message))
  }
  useEffect(rafraichir, [])

  // Charge un etablissement dans le formulaire pour le modifier
  function commencerEdition(etab) {
    setForm({
      nom: etab.nom || '',
      description: etab.description || '',
      adresse: etab.adresse || '',
      caracteristiques: etab.caracteristiques || '',
      imageUrl: etab.imageUrl || '',
      logoUrl: etab.logoUrl || '',
      email: etab.email || '',
      telephone: etab.telephone || '',
    })
    setEnEdition(etab.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Revenir en mode "creation"
  function annulerEdition() {
    setForm(etabVide)
    setEnEdition(null)
  }

  async function soumettre() {
    if (!form.nom.trim()) return notifier('erreur', 'Le nom est obligatoire.')
    setEnCours(true)
    try {
      if (enEdition) {
        await modifierEtablissement(enEdition, form)
        notifier('ok', `« ${form.nom} » a été modifié !`)
      } else {
        await creerEtablissement(form)
        notifier('ok', `« ${form.nom} » a été créé !`)
      }
      annulerEdition()
      rafraichir()
    } catch (e) { notifier('erreur', e.message) }
    finally { setEnCours(false) }
  }

  async function supprimer(etab) {
    if (!confirm(`Supprimer « ${etab.nom} » ?`)) return
    try {
      await supprimerEtablissement(etab.id)
      notifier('ok', 'Supprimé.')
      if (enEdition === etab.id) annulerEdition()
      rafraichir()
    }
    catch (e) { notifier('erreur', e.message) }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <section>
        <h2 className="font-display text-2xl font-semibold mb-5">
          {enEdition ? "Modifier l'établissement" : "Ajouter un établissement"}
        </h2>
        <div className="space-y-4">
          <Champ label="Nom *" valeur={form.nom} onChange={set('nom')} placeholder="Lycée Saint-Michel" />
          <Champ label="Adresse" valeur={form.adresse} onChange={set('adresse')} placeholder="123 avenue…" />
          <Champ label="Description" valeur={form.description} onChange={set('description')} aire />
          <Champ label="Caractéristiques (virgules)" valeur={form.caracteristiques} onChange={set('caracteristiques')} aire placeholder="Bibliothèque, laboratoire, cantine" />
          <ImportPhoto label="Image de l'établissement" valeur={form.imageUrl} onChange={set('imageUrl')} />
          <ImportPhoto label="Logo de l'établissement" valeur={form.logoUrl} onChange={set('logoUrl')} />
          <Champ label="Courriel du directeur" valeur={form.email} onChange={set('email')} type="email" />
          <Champ label="Téléphone" valeur={form.telephone} onChange={set('telephone')} />
          <div className="flex gap-3">
            <button onClick={soumettre} disabled={enCours}
              className="rounded-xl bg-encre text-creme px-7 py-3 font-semibold hover:bg-or hover:text-encre transition-colors disabled:opacity-50">
              {enCours ? 'Enregistrement…' : (enEdition ? 'Mettre à jour' : "Créer l'établissement")}
            </button>
            {enEdition && (
              <button onClick={annulerEdition}
                className="rounded-xl border border-encre/15 px-6 py-3 text-ardoise hover:text-encre transition-colors">
                Annuler
              </button>
            )}
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-semibold mb-5">Existants ({liste.length})</h2>
        {liste.length === 0 ? <p className="text-ardoise">Aucun pour l'instant.</p> : (
          <ul className="space-y-3">
            {liste.map((etab) => (
              <li key={etab.id}
                className={`flex items-center justify-between gap-3 rounded-xl border px-5 py-4 ${
                  enEdition === etab.id ? 'border-or bg-or/5' : 'border-encre/10 bg-white'
                }`}>
                <div className="min-w-0">
                  <p className="font-semibold truncate">{etab.nom}</p>
                  <p className="text-sm text-ardoise truncate">{etab.adresse}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => commencerEdition(etab)}
                    className="rounded-lg border border-encre/20 text-encre px-3 py-2 text-sm font-medium hover:border-or hover:text-or transition-colors">
                    Modifier
                  </button>
                  <button onClick={() => supprimer(etab)}
                    className="rounded-lg border border-red-200 text-red-600 px-3 py-2 text-sm font-medium hover:bg-red-50 transition-colors">
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

// ---------- Onglet ANNONCES ----------
function GestionAnnonces({ notifier }) {
  const [form, setForm] = useState({ titre: '', contenu: '' })
  const [liste, setListe] = useState([])
  const [enCours, setEnCours] = useState(false)
  const set = (champ) => (val) => setForm((f) => ({ ...f, [champ]: val }))

  function rafraichir() {
    getAnnonces().then(setListe).catch((e) => notifier('erreur', e.message))
  }
  useEffect(rafraichir, [])

  async function soumettre() {
    if (!form.titre.trim()) return notifier('erreur', 'Le titre est obligatoire.')
    setEnCours(true)
    try {
      await creerAnnonce(form)
      notifier('ok', 'Annonce publiée !')
      setForm({ titre: '', contenu: '' }); rafraichir()
    } catch (e) { notifier('erreur', e.message) }
    finally { setEnCours(false) }
  }

  async function supprimer(a) {
    if (!confirm(`Supprimer l'annonce « ${a.titre} » ?`)) return
    try { await supprimerAnnonce(a.id); notifier('ok', 'Supprimée.'); rafraichir() }
    catch (e) { notifier('erreur', e.message) }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <section>
        <h2 className="font-display text-2xl font-semibold mb-5">Publier une annonce</h2>
        <div className="space-y-4">
          <Champ label="Titre *" valeur={form.titre} onChange={set('titre')} placeholder="Ouverture des inscriptions" />
          <Champ label="Contenu" valeur={form.contenu} onChange={set('contenu')} aire placeholder="Détail de l'annonce…" />
          <button onClick={soumettre} disabled={enCours}
            className="rounded-xl bg-encre text-creme px-7 py-3 font-semibold hover:bg-or hover:text-encre transition-colors disabled:opacity-50">
            {enCours ? 'Publication…' : "Publier l'annonce"}
          </button>
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-semibold mb-5">Annonces ({liste.length})</h2>
        {liste.length === 0 ? <p className="text-ardoise">Aucune annonce.</p> : (
          <ul className="space-y-3">
            {liste.map((a) => (
              <li key={a.id} className="flex items-start justify-between gap-4 rounded-xl border border-encre/10 bg-white px-5 py-4">
                <div className="min-w-0">
                  <p className="font-semibold truncate">{a.titre}</p>
                  <p className="text-sm text-ardoise line-clamp-2">{a.contenu}</p>
                </div>
                <button onClick={() => supprimer(a)}
                  className="shrink-0 rounded-lg border border-red-200 text-red-600 px-4 py-2 text-sm font-medium hover:bg-red-50 transition-colors">
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

// ---------- Onglet MESSAGES ----------
function GestionMessages({ notifier }) {
  const [liste, setListe] = useState([])
  const [chargement, setChargement] = useState(true)

  function rafraichir() {
    getMessages().then(setListe).catch((e) => notifier('erreur', e.message)).finally(() => setChargement(false))
  }
  useEffect(rafraichir, [])

  async function supprimer(m) {
    if (!confirm(`Supprimer le message de ${m.nom} ?`)) return
    try { await supprimerMessage(m.id); rafraichir() }
    catch (e) { notifier('erreur', e.message) }
  }

  if (chargement) return <p className="text-ardoise">Chargement…</p>

  return (
    <section>
      <h2 className="font-display text-2xl font-semibold mb-5">Messages reçus ({liste.length})</h2>
      {liste.length === 0 ? <p className="text-ardoise">Aucun message pour l'instant.</p> : (
        <ul className="space-y-4">
          {liste.map((m) => (
            <li key={m.id} className="rounded-xl border border-encre/10 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">{m.nom}</p>
                  <a href={`mailto:${m.email}`} className="text-sm text-or hover:underline">{m.email}</a>
                </div>
                <div className="text-right">
                  <time className="text-xs text-ardoise">{m.dateEnvoi ? new Date(m.dateEnvoi).toLocaleString('fr-FR') : ''}</time>
                  <button onClick={() => supprimer(m)}
                    className="block mt-2 ml-auto rounded-lg border border-red-200 text-red-600 px-3 py-1 text-xs font-medium hover:bg-red-50 transition-colors">
                    Supprimer
                  </button>
                </div>
              </div>
              <p className="mt-3 text-ardoise whitespace-pre-line">{m.contenu}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

// ---------- Onglet RÉSERVATIONS ----------
const styleStatut = {
  EN_ATTENTE: 'bg-amber-100 text-amber-800',
  CONFIRMEE: 'bg-green-100 text-green-800',
  ANNULEE: 'bg-red-100 text-red-700',
}

function GestionReservations({ notifier }) {
  const [liste, setListe] = useState([])
  const [chargement, setChargement] = useState(true)

  function rafraichir() {
    getToutesReservations().then(setListe).catch((e) => notifier('erreur', e.message)).finally(() => setChargement(false))
  }
  useEffect(rafraichir, [])

  async function changer(r, statut) {
    try { await changerStatutReservation(r.id, statut); notifier('ok', `Réservation ${statut.toLowerCase()}.`); rafraichir() }
    catch (e) { notifier('erreur', e.message) }
  }

  async function supprimer(r) {
    if (!confirm('Supprimer cette réservation ?')) return
    try { await supprimerReservation(r.id); rafraichir() }
    catch (e) { notifier('erreur', e.message) }
  }

  if (chargement) return <p className="text-ardoise">Chargement…</p>

  return (
    <section>
      <h2 className="font-display text-2xl font-semibold mb-5">Réservations ({liste.length})</h2>
      {liste.length === 0 ? <p className="text-ardoise">Aucune réservation.</p> : (
        <ul className="space-y-4">
          {liste.map((r) => (
            <li key={r.id} className="rounded-xl border border-encre/10 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">{r.etablissementNom}</p>
                  <p className="text-sm text-ardoise">{r.utilisateurEmail}</p>
                  {r.note && <p className="mt-1 text-sm text-ardoise italic">« {r.note} »</p>}
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styleStatut[r.statut] || 'bg-sable text-ardoise'}`}>
                  {r.statut}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => changer(r, 'CONFIRMEE')}
                  className="rounded-lg bg-green-600 text-white px-4 py-1.5 text-sm font-medium hover:bg-green-700 transition-colors">
                  Confirmer
                </button>
                <button onClick={() => changer(r, 'ANNULEE')}
                  className="rounded-lg border border-amber-300 text-amber-700 px-4 py-1.5 text-sm font-medium hover:bg-amber-50 transition-colors">
                  Refuser
                </button>
                <button onClick={() => supprimer(r)}
                  className="rounded-lg border border-red-200 text-red-600 px-4 py-1.5 text-sm font-medium hover:bg-red-50 transition-colors">
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}