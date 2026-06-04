// Pied de page simple, present sur toutes les pages
export default function Footer() {
  return (
    <footer className="mt-24 border-t border-encre/10">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-ardoise flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="font-display text-base text-encre">
          Établissements <span className="text-or">Scolaires</span>
        </p>
        <p>© {new Date().getFullYear()} — Plateforme d'information scolaire.</p>
      </div>
    </footer>
  )
}
