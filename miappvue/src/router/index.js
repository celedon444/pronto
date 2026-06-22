import { createRouter, createWebHistory } from "vue-router"

import HomeView from "../views/HomeView.vue"
import MapaView from "../views/MapaView.vue"
import LoginView from "../views/LoginView.vue"
import DashboardView from "../views/DashboardView.vue"
import PerfilView from "@/views/PerfilView.vue"
import RegistroView from "@/views/RegistroView.vue"
import MostrarRutasView from "@/views/MostrarRutasView.vue"
import ReportesView from "@/views/ReportesView.vue"
import BusesActivosView from "@/views/BusesActivosView.vue"
import NoticiasView from "@/views/NoticiasView.vue"
import AsistenteView from "../views/AsistenteView.vue"



const routes = [
  { path: "/", component: HomeView },
  { path: "/mapa", component: MapaView },
  { path: "/login", component: LoginView},
  { path: "/dashboard", component: DashboardView },
  { path: "/perfil", component: PerfilView },
  { path: "/registro", component: RegistroView },
  { path: "/administrarRutas", component: MostrarRutasView },
  { path: "/reportes", component: ReportesView },
  { path: "/busesActivos", component: BusesActivosView },
  { path: "/noticias", component: NoticiasView },
  { path: "/asistente", component: AsistenteView }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' };
  }
})

export default router
