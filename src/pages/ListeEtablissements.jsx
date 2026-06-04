import { useEffect, useState } from 'react'
import { getEtablissements } from '../api'
import EtablissementCard from '../components/EtablissementCard'

// Page d'accueil : affiche la liste des etablissements venant de l'API
export default function ListeEtablissements() {
  const [etablissements, setEtablissements] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState(null)

  // useEffect s'execute au chargement de la page : on va chercher les donnees
  useEffect(() => {
    getEtablissements()
      .then((donnees) => setEtablissements(donnees))
      .catch((e) => setErreur(e.message))
      .finally(() => setChargement(false))
  }, [])

  return (
    <div>
      {/* En-tete / hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-10">
        <p className="text-or font-semibold tracking-widest uppercase text-xs">
          Plateforme d'information
        </p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl font-semibold leading-[1.05] max-w-2xl">
          Découvrez nos établissements scolaires
        </h1>
        <p className="mt-5 text-ardoise max-w-xl leading-relaxed">
          Consultez la liste des établissements, leurs caractéristiques uniques,
          les modalités d'admission et les frais. Contactez directement la
          direction de l'école de votre choix.
        </p>
      </section>

      {/* Liste */}
      <section className="mx-auto max-w-6xl px-6 pb-10">
        {chargement && (
          <p className="text-ardoise">Chargement des établissements…</p>
        )}

        {erreur && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
            <p className="font-semibold">Erreur de connexion à l'API</p>
            <p className="text-sm mt-1">
              {erreur}. Vérifie que le backend Spring Boot tourne bien sur le
              port 8080 (commande <code>mvn spring-boot:run</code>).
            </p>
          </div>
        )}

        {!chargement && !erreur && etablissements.length === 0 && (
          <p className="text-ardoise">
            Aucun établissement pour l'instant. Ajoutes-en un via l'espace Admin.
          </p>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {etablissements.map((etab, i) => (
            <EtablissementCard key={etab.id} etablissement={etab} index={i} />
          ))}
        </div>
      </section>
    </div>
  )
}