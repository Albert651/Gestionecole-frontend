import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { connexion } from '../api'
import { useAuth } from '../AuthContext'

export default function Connexion() {
  const [form, setForm] = useState({ email: '', motDePasse: '' })
  const [erreur, setErreur] = useState(null)
  const [enCours, setEnCours] = useState(false)
  const { connecter } = useAuth()
  const navigate = useNavigate()

  const set = (champ) => (e) => setForm((f) => ({ ...f, [champ]: e.target.value }))

  async function soumettre() {
    if (!form.email || !form.motDePasse) {
      return setErreur('Merci de remplir tous les champs.')
    }
    setEnCours(true); setErreur(null)
    try {
      const data = await connexion(form)
      connecter(data)
      // Admin -> back office, sinon -> accueil
      navigate(data.role === 'ADMIN' ? '/admin' : '/')
    } catch (e) {
      setErreur(e.message)
    } finally {
      setEnCours(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16 animate-fadeUp">
      <p className="text-or font-semibold tracking-widest uppercase text-xs">Espace membre</p>
      <h1 className="mt-3 font-display text-4xl font-semibold leading-tight">Connexion</h1>

      <div className="mt-8 space-y-4">
        {erreur && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {erreur}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">Courriel</label>
          <input type="email" value={form.email} onChange={set('email')}
            className="w-full rounded-xl border border-encre/15 bg-white px-4 py-3 outline-none focus:border-or"
            placeholder="vous@exemple.com" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mot de passe</label>
          <input type="password" value={form.motDePasse} onChange={set('motDePasse')}
            className="w-full rounded-xl border border-encre/15 bg-white px-4 py-3 outline-none focus:border-or"
            placeholder="••••••••" />
        </div>
        <button onClick={soumettre} disabled={enCours}
          className="w-full rounded-xl bg-encre text-creme px-7 py-3 font-semibold hover:bg-or hover:text-encre transition-colors disabled:opacity-50">
          {enCours ? 'Connexion…' : 'Se connecter'}
        </button>
      </div>

      <p className="mt-6 text-sm text-ardoise">
        Pas encore de compte ?{' '}
        <Link to="/inscription" className="text-or font-semibold hover:underline">Créer un compte</Link>
      </p>
    </div>
  )
}