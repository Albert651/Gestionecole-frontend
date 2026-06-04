import { useState } from 'react'
import { supabase } from '../supabaseClient'

// Champ "importer une photo" : televerse le fichier vers Supabase Storage
// (bucket "images") et renvoie l'URL publique via onChange.
export default function ImportPhoto({ label, valeur, onChange }) {
  const [enCours, setEnCours] = useState(false)
  const [erreur, setErreur] = useState(null)

  async function televerser(e) {
    const fichier = e.target.files?.[0]
    if (!fichier) return

    setEnCours(true)
    setErreur(null)
    try {
      // Nom de fichier unique pour eviter les conflits
      const extension = fichier.name.split('.').pop()
      const nomFichier = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`

      // Envoi vers le bucket "images"
      const { error } = await supabase.storage
        .from('images')
        .upload(nomFichier, fichier)
      if (error) throw error

      // Recupere l'URL publique du fichier televerse
      const { data } = supabase.storage.from('images').getPublicUrl(nomFichier)
      onChange(data.publicUrl)
    } catch (err) {
      setErreur(err.message || "Le téléversement a échoué")
    } finally {
      setEnCours(false)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>

      {/* Apercu de l'image deja choisie */}
      {valeur && (
        <img
          src={valeur}
          alt="aperçu"
          className="mb-2 h-24 w-24 rounded-xl object-cover border border-encre/10 bg-white"
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={televerser}
        className="block w-full text-sm text-ardoise
                   file:mr-4 file:rounded-lg file:border-0 file:bg-encre file:text-creme
                   file:px-4 file:py-2 file:font-semibold hover:file:bg-or hover:file:text-encre
                   file:cursor-pointer cursor-pointer"
      />

      {enCours && <p className="mt-1 text-sm text-ardoise">Téléversement en cours…</p>}
      {erreur && <p className="mt-1 text-sm text-red-600">{erreur}</p>}
    </div>
  )
}