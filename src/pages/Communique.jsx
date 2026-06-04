// Page Communique : modalites d'admission, frais de scolarite et d'inscription.
// Pour l'instant le contenu est ecrit en dur ; plus tard on pourra le rendre
// modifiable depuis le backend (meme principe que les etablissements).
export default function Communique() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-14 animate-fadeUp">
      <p className="text-or font-semibold tracking-widest uppercase text-xs">
        Communiqué officiel
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold leading-tight">
        Admission, scolarité & inscription
      </h1>
      <p className="mt-5 text-ardoise leading-relaxed">
        Vous trouverez ci-dessous les modalités d'admission des étudiants ainsi
        que le détail des frais pour l'année en cours.
      </p>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-semibold">Modalités d'admission</h2>
        <ul className="mt-4 space-y-3 text-ardoise">
          <li className="flex gap-3"><span className="text-or font-bold">1.</span> Constitution du dossier (acte de naissance, bulletins, photo).</li>
          <li className="flex gap-3"><span className="text-or font-bold">2.</span> Dépôt du dossier auprès du secrétariat de l'établissement.</li>
          <li className="flex gap-3"><span className="text-or font-bold">3.</span> Test d'évaluation et/ou entretien selon le niveau.</li>
          <li className="flex gap-3"><span className="text-or font-bold">4.</span> Confirmation d'admission et paiement des frais d'inscription.</li>
        </ul>
      </section>

      <section className="mt-10 grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl bg-encre text-creme p-7">
          <p className="text-or text-sm font-semibold uppercase tracking-wide">Frais d'inscription</p>
          <p className="mt-2 font-display text-3xl font-semibold">50 000 Ar</p>
          <p className="mt-1 text-creme/70 text-sm">À régler une fois, à l'admission.</p>
        </div>
        <div className="rounded-2xl bg-sable p-7">
          <p className="text-or text-sm font-semibold uppercase tracking-wide">Frais de scolarité</p>
          <p className="mt-2 font-display text-3xl font-semibold">120 000 Ar</p>
          <p className="mt-1 text-ardoise text-sm">Par trimestre.</p>
        </div>
      </section>

      <p className="mt-8 text-sm text-ardoise italic">
        Les montants ci-dessus sont donnés à titre d'exemple — modifie-les dans
        le fichier <code>src/pages/Communique.jsx</code>.
      </p>
    </article>
  )
}
