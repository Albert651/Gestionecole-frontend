import { useState } from 'react'
import { envoyerMessage } from '../api'

// Page Contact : le formulaire envoie le message a l'API (POST /api/messages).
// Le message est stocke et devient visible dans l'espace Admin.
export default function Contact() {
  const [form, setForm] = useState({ nom: '', email: '', contenu: '' })
  const [envoye, setEnvoye] = useState(false)
  const [erreur, setErreur] = useState(null)
  const [enCours, setEnCours] = useState(false)

  function modifier(champ, valeur) {
    setForm((f) => ({ ...f, [champ]: valeur }))
  }

  async function envoyer() {
    if (!form.nom || !form.email || !form.contenu) {
      setErreur('Merci de remplir tous les champs.')
      return
    }
    setEnCours(true)
    setErreur(null)
    try {
      await envoyerMessage(form)
      setEnvoye(true)
    } catch (e) {
      setErreur(e.message)
    } finally {
      setEnCours(false)
    }
  }

  return (
    <article className="mx-auto max-w-2xl px-6 py-14 animate-fadeUp">
      <p className="text-or font-semibold tracking-widest uppercase text-xs">
        Nous écrire
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold leading-tight">
        Contacter la direction
      </h1>
      <p className="mt-5 text-ardoise leading-relaxed">
        Une question sur les admissions, les frais ou un établissement ?
        Écrivez à la direction via ce formulaire.
      </p>

      {envoye ? (
        <div className="mt-10 rounded-2xl bg-encre text-creme p-8 text-center">
          <p className="font-display text-2xl">Merci, {form.nom} !</p>
          <p className="mt-2 text-creme/80">
            Votre message a bien été envoyé. La direction vous répondra à {form.email}.
          </p>
        </div>
      ) : (
        <div className="mt-10 space-y-5">
          {erreur && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {erreur}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Votre nom</label>
            <input
              type="text"
              value={form.nom}
              onChange={(e) => modifier('nom', e.target.value)}
              className="w-full rounded-xl border border-encre/15 bg-white px-4 py-3 outline-none focus:border-or"
              placeholder="Jean Rakoto"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Votre courriel</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => modifier('email', e.target.value)}
              className="w-full rounded-xl border border-encre/15 bg-white px-4 py-3 outline-none focus:border-or"
              placeholder="jean@exemple.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Votre message</label>
            <textarea
              rows={5}
              value={form.contenu}
              onChange={(e) => modifier('contenu', e.target.value)}
              className="w-full rounded-xl border border-encre/15 bg-white px-4 py-3 outline-none focus:border-or resize-none"
              placeholder="Bonjour, je souhaiterais des informations sur…"
            />
          </div>
          <button
            onClick={envoyer}
            disabled={enCours}
            className="rounded-xl bg-encre text-creme px-7 py-3 font-semibold hover:bg-or hover:text-encre transition-colors disabled:opacity-50"
          >
            {enCours ? 'Envoi…' : 'Envoyer le message'}
          </button>
        </div>
      )}
    </article>
  )
}