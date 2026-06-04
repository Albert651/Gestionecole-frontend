import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import RouteProtegee from './components/RouteProtegee'
import ListeEtablissements from './pages/ListeEtablissements'
import DetailEtablissement from './pages/DetailEtablissement'
import Communique from './pages/Communique'
import Annonces from './pages/Annonces'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import Connexion from './pages/Connexion'
import Inscription from './pages/Inscription'
import MesReservations from './pages/MesReservations'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<ListeEtablissements />} />
          <Route path="/etablissements/:id" element={<DetailEtablissement />} />
          <Route path="/communique" element={<Communique />} />
          <Route path="/annonces" element={<Annonces />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/inscription" element={<Inscription />} />

          {/* Reserve aux utilisateurs connectes */}
          <Route
            path="/mes-reservations"
            element={
              <RouteProtegee>
                <MesReservations />
              </RouteProtegee>
            }
          />

          {/* Reserve aux administrateurs */}
          <Route
            path="/admin"
            element={
              <RouteProtegee adminRequis={true}>
                <Admin />
              </RouteProtegee>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}