import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getEtablissement, envoyerMessage } from '../api'

// Page de detail : etablissement + caracteristiques + formulaire de contact direct.
export default function DetailEtablissement() {
  const { id } = useParams()
  const [etab, setEtab] = useState(null)
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState(null)

  useEffect(() => {
    getEtablissement(id)
      .then(setEtab)
      .catch((e) => setErreur(e.message))
      .finally(() => setChargement(false))
  }, [id])

  if (chargement) {
    return <p className="mx-auto max-w-4xl px-6 py-16 text-ardoise">Chargement…</p>
  }

  if (erreur || !etab) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-red-700">{erreur || "Établissement introuvable."}</p>
        <Link to="/" className="mt-4 inline-block text-or font-semibold">← Retour à la liste</Link>
      </div>
    )
  }

  const caracteristiques = (etab.caracteristiques || '')
    .split(/[,\n]/).map((c) => c.trim()).filter(Boolean)

  return (
    <article className="mx-auto max-w-4xl px-6 py-12 animate-fadeUp">
      <Link to="/" className="text-sm text-ardoise hover:text-or transition-colors">
        ← Tous les établissements
      </Link>

      {/* Image principale */}
      <div className="mt-5 h-64 sm:h-80 rounded-3xl overflow-hidden bg-encre">
        {etab.imageUrl ? (
          <img src={etab.imageUrl} alt={etab.nom} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full grid place-items-center">
            <span className="font-display text-7xl text-or/60">{etab.nom?.charAt(0)}</span>
          </div>
        )}
      </div>

      {/* Logo + titre */}
      <div className="mt-8 flex items-center gap-4">
        {etab.logoUrl && (
          <img src={etab.logoUrl} alt="logo" className="h-16 w-16 rounded-xl object-cover border border-encre/10 bg-white" />
        )}
        <div>
          <h1 className="font-display text-4xl font-semibold leading-tight">{etab.nom}</h1>
          {etab.adresse && <p className="mt-1 text-or font-medium">{etab.adresse}</p>}
        </div>
      </div>

      {etab.description && (
        <p className="mt-6 text-lg text-ardoise leading-relaxed">{etab.description}</p>
      )}

      {/* Caracteristiques */}
      {caracteristiques.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl font-semibold">Caractéristiques de l'établissement</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {caracteristiques.map((c, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl bg-sable px-4 py-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-or" />
                <span className="text-encre">{c}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Coordonnees + formulaire de contact direct */}
      <FormulaireContact etab={etab} />
    </article>
  )
}

// ---------- Formulaire de contact lie a l'etablissement ----------
function FormulaireContact({ etab }) {
  const [form, setForm] = useState({ nom: '', email: '', contenu: '' })
  const [envoye, setEnvoye] = useState(false)
  const [erreur, setErreur] = useState(null)
  const [enCours, setEnCours] = useState(false)

  const set = (champ) => (e) => setForm((f) => ({ ...f, [champ]: e.target.value }))

  async function envoyer() {
    if (!form.nom || !form.email || !form.contenu) {
      return setErreur('Merci de remplir tous les champs.')
    }
    setEnCours(true); setErreur(null)
    try {
      // On joint l'id de l'etablissement : le backend enverra l'e-mail au bon directeur
      await envoyerMessage({ ...form, etablissementId: etab.id })
      setEnvoye(true)
    } catch (e) {
      setErreur(e.message)
    } finally {
      setEnCours(false)
    }
  }

  return (
    <section className="mt-10 rounded-2xl border border-encre/10 bg-white p-7">
      <h2 className="font-display text-2xl font-semibold">Contacter la direction</h2>

      {/* Coordonnees */}
      <div className="mt-4 space-y-1 text-ardoise text-sm">
        {etab.email && <p>Courriel : <span className="text-encre font-medium">{etab.email}</span></p>}
        {etab.telephone && <p>Téléphone : <span className="text-encre font-medium">{etab.telephone}</span></p>}
      </div>

      {envoye ? (
        <div className="mt-6 rounded-xl bg-encre text-creme p-6 text-center">
          <p className="font-display text-xl">Message envoyé, merci {form.nom} !</p>
          <p className="mt-1 text-creme/80 text-sm">La direction de {etab.nom} vous répondra par e-mail.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {erreur && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{erreur}</div>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            <input type="text" value={form.nom} onChange={set('nom')} placeholder="Votre nom"
              className="w-full rounded-xl border border-encre/15 bg-creme px-4 py-3 outline-none focus:border-or" />
            <input type="email" value={form.email} onChange={set('email')} placeholder="Votre courriel"
              className="w-full rounded-xl border border-encre/15 bg-creme px-4 py-3 outline-none focus:border-or" />
          </div>
          <textarea rows={4} value={form.contenu} onChange={set('contenu')} placeholder="Votre message à la direction…"
            className="w-full rounded-xl border border-encre/15 bg-creme px-4 py-3 outline-none focus:border-or resize-none" />
          <button onClick={envoyer} disabled={enCours}
            className="rounded-xl bg-encre text-creme px-7 py-3 font-semibold hover:bg-or hover:text-encre transition-colors disabled:opacity-50">
            {enCours ? 'Envoi…' : 'Envoyer au directeur'}
          </button>
        </div>
      )}
    </section>
  )
}