import { Link } from 'react-router-dom'

// Carte affichee dans la liste des etablissements
export default function EtablissementCard({ etablissement, index = 0 }) {
  const { id, nom, description, adresse, imageUrl } = etablissement

  return (
    <Link
      to={`/etablissements/${id}`}
      className="group block animate-fadeUp"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <article className="h-full overflow-hidden rounded-2xl bg-white border border-encre/10 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Image (ou bandeau de remplacement si pas d'image) */}
        <div className="h-44 bg-sable overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={nom}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full grid place-items-center bg-encre">
              <span className="font-display text-5xl text-or/70">
                {nom?.charAt(0) ?? 'É'}
              </span>
            </div>
          )}
        </div>

        {/* Contenu texte */}
        <div className="p-6">
          <h3 className="font-display text-xl font-semibold leading-tight">
            {nom}
          </h3>
          {adresse && (
            <p className="mt-1 text-sm text-or font-medium">{adresse}</p>
          )}
          <p className="mt-3 text-sm text-ardoise line-clamp-3">
            {description}
          </p>
          <span className="mt-4 inline-block text-sm font-semibold text-encre group-hover:text-or transition-colors">
            Voir le détail →
          </span>
        </div>
      </article>
    </Link>
  )
}
