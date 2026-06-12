<template>
  <div class="contenedor">
    <!-- 1. Mostrar Skeleton mientras carga -->
    <MapSkeleton v-if="cargando" />

    <!-- 2. Mostrar contenido real cuando cargando es false -->
    <div v-else>
      <div class="contenedor-titulo">
        <span class="titulo1">
        <span class="punto-vivo"></span> Monitoreo en vivo</span>
      </div>

      <div class="buscador">
        <input
          v-model="filtroRuta"
          @input="buscarRuta"
          placeholder="🔎 Buscar ruta (ej: SM101)"
        />
        <button @click="irAMiUbicacion">📍 Mi ubicación</button>
      </div>

      <div class="stats">
        <div class="mini-carta" @click="mostrarBusesActivos">
          <div class="icon">🚌</div>
          <h2>{{ cantidadBuses }}</h2>
          <p>Buses activos</p>
        </div>

        <div class="mini-carta" @click="verRutasDisponibles">
          <div class="icon">🗺</div>
          <h2>{{ rutasDisponibles }}</h2>
          <p>Rutas disponibles</p>
        </div>
      </div>

      <!-- El mapa debe estar fuera del v-if del busSeleccionado -->
      <div id="map"></div>

      <!-- Panel flotante del bus seleccionado -->
      <div v-if="busSeleccionado" class="panelBus">
        <div
          class="contenedor-icono-reportes"
          @click="irAReportes"
          v-show="confirmarSesionMapa"
        >
          <i class="bx bx-chat"></i>
        </div>

        <h2>🚌 Bus {{ busSeleccionado.ruta }}</h2>
        <p><b>Conductor:</b> {{ busSeleccionado.conductor }}</p>
        <p><b>Placa:</b> {{ busSeleccionado.placa }}</p>
        <p><b>Capacidad:</b> {{ busSeleccionado.capacidad }} pasajeros</p>
        <p><b>Estado:</b> {{ estadoDeLosBuses }}</p>

        <button @click="cerrarPanel">Cerrar</button>
        <button v-show="confirmarSesionMapa" @click="guardarRuta">
          Guardar ruta
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-rotatedmarker";
import "leaflet-routing-machine";
import MapSkeleton from "@/components/MapSkeleton.vue";

import { Icon } from "leaflet";

export default {
  components: {
    MapSkeleton,
  },
  data() {
    return {
      cargando: true,
      map: null,
      mapaActivo: true,
      busSeleccionado: null,
      estadoDeLosBuses: "En movimiento",
      rutaActiva: null,
      intervalosBuses: [],
      busesMarkers: [],
      confirmarSesionMapa: localStorage.getItem("SesionActiva") === "true",
      cantidadBuses: 0,
      rutasDisponibles: 0,
      usuarioUbicacion: null,
      paradaCercanaMarker: null,
      filtroRuta: "",
      buses: [],
      rutas: [],
      paradas: [],
    };
  },

  async mounted() {
    try {
      // 1. Configuración de credenciales (Token)
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

// 2. Carga de datos principales (Buses, Rutas, Paradas)
      const [resBuses, resRutas, resParadas] = await Promise.all([
        fetch(`${process.env.VUE_APP_API_URL}/buses`, { headers }),
        fetch(`${process.env.VUE_APP_API_URL}/rutas`, { headers }),
        fetch(`${process.env.VUE_APP_API_URL}/paradas`, { headers }),
      ]);

      // Si el token no es válido (401), mandamos al login
      if (resBuses.status === 401) {
        this.$router.push("/login");
        return;
      }

      this.buses = await resBuses.json();
      this.rutas = await resRutas.json();
      this.paradas = await resParadas.json();

      // 3. Cargar las coordenadas (puntos) de cada una de las rutas
      for (const ruta of this.rutas) {
        try {
          const res = await fetch(
            `${process.env.VUE_APP_API_URL}/rutas/${ruta.id}/puntos`,
            { headers },
          );
          const puntos = await res.json();
          // Convertimos los puntos al formato que Leaflet entiende [lat, lng]
          ruta.puntos = puntos.map((p) => [p.latitud, p.longitud]);
        } catch (err) {
          console.error(`Error cargando puntos para la ruta ${ruta.id}:`, err);
          ruta.puntos = []; // Evitamos que la app rompa si falla una ruta
        }
      }

      // Actualizamos los contadores de la interfaz
      this.cantidadBuses = this.buses.length;
      this.rutasDisponibles = this.rutas.length;

      // 4. Corrección de Iconos de Leaflet (Evita que desaparezcan los marcadores)
      delete Icon.Default.prototype._getIconUrl;
      Icon.Default.mergeOptions({
        iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
        iconUrl: require("leaflet/dist/images/marker-icon.png"),
        shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
      });
    } catch (error) {
      console.error("Error general en la carga del mapa:", error);
    } finally {
      // 5. Finalizar carga e iniciar el mapa
      // Importante: Cambiamos cargando a false primero para que aparezca el <div id="map">
      this.cargando = false;

      // $nextTick espera a que Vue renderice el HTML del mapa antes de ejecutar Leaflet
      this.$nextTick(() => {
        this.iniciarMapa();
      });
    }
  },

  methods: {
    iniciarMapa() {
      // --- PROTECCIÓN CONTRA DOBLE INICIALIZACIÓN ---
      const container = L.DomUtil.get("map");
      if (container !== null) {
        container._leaflet_id = null; // Reseteo forzado
      }
      if (this.map) {
        this.map.remove();
        this.map = null;
      }
      // ----------------------------------------------

      const santaMartaBounds = L.latLngBounds([11.0, -74.28], [11.32, -74.12]);

      this.map = L.map("map", {
        maxBounds: santaMartaBounds,
        maxBoundsViscosity: 0.9,
        minZoom: 11,
      }).setView([11.18, -74.21], 12);

      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 19 },
      ).addTo(this.map);

      this.dibujarBuses();
      this.configurarGeolocalizacion();
    },

    dibujarBuses() {
      this.buses.forEach((bus) => {
        const ruta = this.rutas.find((r) => r.codigo === bus.codigo);
        if (!ruta) return;

        const busIcon = L.icon({
          iconUrl: "https://cdn-icons-png.flaticon.com/128/3448/3448316.png",
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        const marker = L.marker([bus.latitud, bus.longitud], {
          icon: busIcon,
          rotationAngle: 0,
        }).addTo(this.map);

        marker.bindTooltip(bus.nombre_ruta, {
          permanent: true,
          direction: "top",
        });
        this.busesMarkers.push({ bus, marker, ruta });

        marker.on("click", () => {
          this.confirmarSesionMapa =
            localStorage.getItem("SesionActiva") === "true";
          this.busSeleccionado = bus;
          this.estadoDeLosBuses = bus.estado;
          this.mostrarRuta(ruta);
        });

        this.animarBus(marker, ruta, bus);
      });
    },

    configurarGeolocalizacion() {
      this.map.locate({ setView: true, maxZoom: 16 });

      this.map.on("locationfound", (e) => {
        this.usuarioUbicacion = e.latlng;
        L.marker(e.latlng)
          .addTo(this.map)
          .bindPopup("📍 Estás aquí")
          .openPopup();
        this.buscarBusMasCercano();
        this.buscarParadaMasCercana();
      });
    },

    // ... Tus otros métodos (mostrarRuta, animarBus, buscarRuta, etc.) se mantienen igual

    mostrarBusesActivos() {
      this.$router.push("/busesActivos");
    },
    irAReportes() {
      this.$router.push("/reportes");
    },
    verRutasDisponibles() {
      this.$router.push("/administrarRutas");
    },
    irAMiUbicacion() {
      if (!this.usuarioUbicacion) return;
      this.map.setView(this.usuarioUbicacion, 16, { animate: true });
    },

    mostrarRuta(ruta) {
      if (this.rutaActiva) {
        this.rutaActiva.remove();
      }
      const coordenadas = ruta.puntos.map((p) => L.latLng(p[0], p[1]));

      this.rutaActiva = L.Routing.control({
        waypoints: coordenadas,
        router: L.Routing.osrmv1({
          serviceUrl: "https://router.project-osrm.org/route/v1",
        }),
        addWaypoints: false,
        draggableWaypoints: false,
        show: false,
        createMarker: () => null,
        lineOptions: {
          styles: [{ color: "#1387d4", weight: 6, opacity: 0.95 }],
        },
      }).addTo(this.map);
    },

    buscarBusMasCercano() {
      if (!this.usuarioUbicacion) return;
      let busMasCercano = null;
      let distanciaMinima = Infinity;

      this.busesMarkers.forEach((b) => {
        const distancia = this.map.distance(
          this.usuarioUbicacion,
          b.marker.getLatLng(),
        );
        if (distancia < distanciaMinima) {
          distanciaMinima = distancia;
          busMasCercano = b;
        }
      });

      if (busMasCercano) {
        const distanciaKm = (distanciaMinima / 1000).toFixed(2);
        busMasCercano.marker
          .bindPopup(
            `🚍 Bus ${busMasCercano.bus.nombre_ruta}<br>📏 ${distanciaKm} km`,
          )
          .openPopup();
      }
    },

    buscarParadaMasCercana() {
      if (!this.usuarioUbicacion || this.paradas.length === 0) return;
      let paradaMasCercana = null;
      let distanciaMinima = Infinity;

      this.paradas.forEach((parada) => {
        const distancia = this.map.distance(this.usuarioUbicacion, [
          parada.latitud,
          parada.longitud,
        ]);
        if (distancia < distanciaMinima) {
          distanciaMinima = distancia;
          paradaMasCercana = parada;
        }
      });

      if (paradaMasCercana) {
        if (this.paradaCercanaMarker)
          this.map.removeLayer(this.paradaCercanaMarker);
        const icono = L.icon({
          iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
          iconSize: [40, 40],
        });
        this.paradaCercanaMarker = L.marker(
          [paradaMasCercana.latitud, paradaMasCercana.longitud],
          { icon: icono },
        ).addTo(this.map);
        this.paradaCercanaMarker
          .bindPopup(`🛑 <b>Parada cercana</b><br>${paradaMasCercana.nombre}`)
          .openPopup();
      }
    },

    animarBus(marker, ruta, bus) {
      const puntos = ruta.puntos.map((p) => L.latLng(p[0], p[1]));
      let i = 0;

      const moverAlSiguiente = () => {
        if (!this.map || !this.mapaActivo) return;
        const actual = puntos[i];
        const siguiente = puntos[(i + 1) % puntos.length];

        const cercaDeParada = this.paradas.some((p) => {
          return (
            this.map.distance(actual, L.latLng(p.latitud, p.longitud)) < 80
          );
        });

        bus.estado = cercaDeParada ? "En parada 🛑" : "En movimiento 🚌";
        if (this.busSeleccionado?.id === bus.id)
          this.estadoDeLosBuses = bus.estado;

        const angulo =
          Math.atan2(siguiente.lng - actual.lng, siguiente.lat - actual.lat) *
          (180 / Math.PI);
        marker.setLatLng(siguiente);
        if (marker.setRotationAngle) marker.setRotationAngle(angulo);
        i = (i + 1) % puntos.length;
      };

      const intervalo = setInterval(moverAlSiguiente, 1500);
      this.intervalosBuses.push(intervalo);
    },

    buscarRuta() {
      if (!this.filtroRuta) return;
      const texto = this.filtroRuta.toUpperCase();
      const encontrado = this.busesMarkers.find((b) =>
        b.bus.nombre_ruta.toUpperCase().includes(texto),
      );
      if (encontrado) {
        this.map.setView(encontrado.marker.getLatLng(), 16, { animate: true });
        encontrado.marker.openPopup();
        this.busSeleccionado = encontrado.bus;
      }
    },

    cerrarPanel() {
      this.busSeleccionado = null;
      if (this.rutaActiva) {
        this.rutaActiva.remove();
        this.rutaActiva = null;
      }
    },

    guardarRuta() {
      if (!this.busSeleccionado) return;
      const nombreRuta = prompt("📝 Ponle un nombre a esta ruta:");
      if (!nombreRuta) return;
      const rutasGuardadas =
        JSON.parse(localStorage.getItem("rutasMasUsadas")) || [];
      rutasGuardadas.push({
        id: Date.now(),
        nombreRuta: nombreRuta.trim(),
        rutaBus: this.busSeleccionado.nombre_ruta,
        placa: this.busSeleccionado.placa,
      });
      localStorage.setItem("rutasMasUsadas", JSON.stringify(rutasGuardadas));
      alert("✅ Ruta guardada");
    },
  },

  beforeUnmount() {
    this.mapaActivo = false;
    this.intervalosBuses.forEach((i) => clearInterval(i));

    if (this.map) {
      this.map.off();
      this.map.remove();
      this.map = null;
    }
  },
};
</script>

<style scoped>
.contenedor {
  background-color: #0b1120;
  min-height: 100vh;
  margin: 0;
  padding: 30px;
  background-attachment: fixed;
  font-family: "Inter", sans-serif;
}

.contenedor-titulo {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 45px;
}

.contenedor-titulo {
  display: flex;
  align-items: center; 
  gap: 12px;          /*espacio entre el punto y el texto*/
}

.punto-vivo {
  width: 10px;
  height: 10px;
  background-color: #ff4d4d;
  border-radius: 50%;
  position: relative;
  display: inline-block;
  box-shadow: 0 0 8px rgba(255, 77, 77, 0.8);
  transform: translate(-5px, -3px);  /*posicion del punto rojo*/
}

.punto-vivo::after {             /* el efecto de onda/pulso */
  content: "";
  width: 100%;
  height: 100%;
  background-color: #ff4d4d;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  animation: pulso-radar 1.8s ease-out infinite;
}

@keyframes pulso-radar {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(3.5);
    opacity: 0;
  }
}

.titulo1 {
  background: rgba(3, 53, 119, 0.45);
  color: #4f96fa;
  padding: 8px 30px;
  border-radius: 100px;
  font-size: 1.5rem;
  font-weight: bold;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: inline-block;
}

/* Buscador */
.buscador {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 25px;
}

.buscador input {
  padding: 2px 18px;
  border-radius: 18px;
  border: none;
  width: 240px;
  background-color: white;
  color: black;
  font-size: 1rem;
}

.buscador button {
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 18px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s;
}

.buscador button:hover {
  background: #1e40af;
}

/* Estadísticas */
.stats {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.mini-carta {
  width: 240px;
  background: white;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
}

.mini-carta:hover {
  transform: translateY(-5px);
}

.icon {
  font-size: 32px;
  margin-bottom: 5px;
}

.mini-carta h2 {
  font-size: 30px;
  margin: 5px 0;
  color: #2563eb;
}

.mini-carta p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

#map {
  height: 520px;
  width: 90%;
  margin: 0 auto 50px auto;
  border-radius: 20px;
  overflow: hidden;
  border: 3px solid #1e7eeb;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

/* Panel del Bus Flotante */
.panelBus {
  position: absolute;
  top: 458px;
  right: 108px;
  width: 280px;
  background: white;
  padding: 25px;
  border-radius: 18px;
  border-top: 6px solid #2563eb;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
  z-index: 1000;
}

.panelBus h2 {
  color: #1e3a8a;
  margin-bottom: 12px;
  font-size: 1.3rem;
}

.panelBus p {
  color: #334155;
  margin: 8px 0;
  font-size: 14px;
}

.panelBus button {
  width: 100%;
  margin-top: 12px;
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;
}

.panelBus button:hover {
  background: #1e40af;
}

.panelBus button:last-child {
  background: #facc15;
  color: #1e293b;
}

/* Icono de Reportes */
.contenedor-icono-reportes {
  position: absolute;
  top: -12px;
  right: -12px;
  background: #2363eb;
  color: white;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

/* Leaflet y otros */
:deep(.leaflet-routing-container) {
  display: none !important;
}

.leaflet-tooltip {
  background: #1e40af !important;
  color: white !important;
  border: none !important;
  border-radius: 6px !important;
  padding: 4px 10px !important;
}


.data-card {
  background: rgba(255, 255, 255, 0.05); /* Cristal muy claro */
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 200, 250, 0.1);
  color: white;
  text-align: center;
  padding: 10px;
}
.data-number {
  font-size: 2rem;
  font-weight: bold;
  color: #00c8fa; /* Cian brillante */
  text-shadow: 0 0 10px rgba(0, 200, 250, 0.5);
}

.control-panel {
  position: absolute;
  top: 20px; left: 20px;
  z-index: 10;
  background: rgba(10, 15, 24, 0.7); /* Tu azul oscuro translúcido */
  backdrop-filter: blur(10px); /* Efecto cristal */
  border: 1px solid rgba(0, 200, 250, 0.2); /* Borde cian sutil */
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}
</style>