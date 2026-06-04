// ============================================================
//  Toutes les communications avec le backend Spring Boot.
//  Le jeton JWT (s'il existe) est ajoute automatiquement
//  dans l'en-tete Authorization de chaque requete.
// ============================================================

const BASE_URL = "http://localhost:8080/api";

// Recupere le jeton stocke apres connexion
function getToken() {
  return localStorage.getItem("token");
}

// Construit les en-tetes, avec le jeton si l'utilisateur est connecte
function entetes() {
  const h = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) {
    h["Authorization"] = `Bearer ${token}`;
  }
  return h;
}

// ---------- AUTHENTIFICATION ----------

export async function inscription(donnees) {
  const r = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: entetes(),
    body: JSON.stringify(donnees),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.erreur || "L'inscription a échoué");
  return data;
}

export async function connexion(donnees) {
  const r = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: entetes(),
    body: JSON.stringify(donnees),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.erreur || "La connexion a échoué");
  return data;
}

// ---------- ÉTABLISSEMENTS ----------

export async function getEtablissements() {
  const r = await fetch(`${BASE_URL}/etablissements`, { headers: entetes() });
  if (!r.ok) throw new Error("Impossible de charger les établissements");
  return r.json();
}

export async function getEtablissement(id) {
  const r = await fetch(`${BASE_URL}/etablissements/${id}`, { headers: entetes() });
  if (!r.ok) throw new Error("Établissement introuvable");
  return r.json();
}

export async function creerEtablissement(donnees) {
  const r = await fetch(`${BASE_URL}/etablissements`, {
    method: "POST",
    headers: entetes(),
    body: JSON.stringify(donnees),
  });
  if (!r.ok) throw new Error("La création a échoué (es-tu connecté en admin ?)");
  return r.json();
}

export async function supprimerEtablissement(id) {
  const r = await fetch(`${BASE_URL}/etablissements/${id}`, {
    method: "DELETE",
    headers: entetes(),
  });
  if (!r.ok) throw new Error("La suppression a échoué");
}

// ---------- ANNONCES ----------

export async function getAnnonces() {
  const r = await fetch(`${BASE_URL}/annonces`, { headers: entetes() });
  if (!r.ok) throw new Error("Impossible de charger les annonces");
  return r.json();
}

export async function creerAnnonce(donnees) {
  const r = await fetch(`${BASE_URL}/annonces`, {
    method: "POST",
    headers: entetes(),
    body: JSON.stringify(donnees),
  });
  if (!r.ok) throw new Error("La création de l'annonce a échoué");
  return r.json();
}

export async function supprimerAnnonce(id) {
  const r = await fetch(`${BASE_URL}/annonces/${id}`, {
    method: "DELETE",
    headers: entetes(),
  });
  if (!r.ok) throw new Error("La suppression a échoué");
}

// ---------- MESSAGES (contact) ----------

export async function getMessages() {
  const r = await fetch(`${BASE_URL}/messages`, { headers: entetes() });
  if (!r.ok) throw new Error("Impossible de charger les messages");
  return r.json();
}

export async function envoyerMessage(donnees) {
  const r = await fetch(`${BASE_URL}/messages`, {
    method: "POST",
    headers: entetes(),
    body: JSON.stringify(donnees),
  });
  if (!r.ok) throw new Error("L'envoi du message a échoué");
  return r.json();
}

export async function supprimerMessage(id) {
  const r = await fetch(`${BASE_URL}/messages/${id}`, {
    method: "DELETE",
    headers: entetes(),
  });
  if (!r.ok) throw new Error("La suppression a échoué");
}

// ---------- RÉSERVATIONS ----------

export async function reserver(donnees) {
  const r = await fetch(`${BASE_URL}/reservations`, {
    method: "POST",
    headers: entetes(),
    body: JSON.stringify(donnees),
  });
  if (!r.ok) throw new Error("La réservation a échoué (es-tu connecté ?)");
  return r.json();
}

export async function getMesReservations() {
  const r = await fetch(`${BASE_URL}/reservations/mes`, { headers: entetes() });
  if (!r.ok) throw new Error("Impossible de charger vos réservations");
  return r.json();
}

export async function getToutesReservations() {
  const r = await fetch(`${BASE_URL}/reservations`, { headers: entetes() });
  if (!r.ok) throw new Error("Impossible de charger les réservations");
  return r.json();
}

export async function changerStatutReservation(id, statut) {
  const r = await fetch(`${BASE_URL}/reservations/${id}/statut`, {
    method: "PUT",
    headers: entetes(),
    body: JSON.stringify({ statut }),
  });
  if (!r.ok) throw new Error("Le changement de statut a échoué");
  return r.json();
}

export async function supprimerReservation(id) {
  const r = await fetch(`${BASE_URL}/reservations/${id}`, {
    method: "DELETE",
    headers: entetes(),
  });
  if (!r.ok) throw new Error("La suppression a échoué");
}

// Modifier un etablissement existant
export async function modifierEtablissement(id, donnees) {
  const r = await fetch(`${BASE_URL}/etablissements/${id}`, {
    method: "PUT",
    headers: entetes(),
    body: JSON.stringify(donnees),
  });
  if (!r.ok) throw new Error("La modification a échoué (es-tu connecté en admin ?)");
  return r.json();
}