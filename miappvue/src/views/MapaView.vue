<template>
  <div class="contenedor">
    <MapSkeleton v-if="cargando" />

    <div v-else>
      <div class="contenedor-titulo">
        <span class="titulo1">Mapa en Tiempo Real</span>
      </div>

      <div class="buscador">
        <input v-model="filtroRuta" @input="buscarRuta" placeholder="🔎 Buscar ruta (ej: SM101)" />
        <button @click="irAMiUbicacion">📍 Mi ubicación</button>
      </div>

      <div class="stats">
        <div class="mini-carta" v-on:click="mostrarBusesActivos">
          <div class="icon">🚌</div>
          <h2>{{ cantidadBuses }}</h2>
          <p>Buses activos</p>
        </div>

        <div class="mini-carta" v-on:click="verRutasDisponibles">
          <div class="icon">🗺</div>
          <h2>{{ rutasDisponibles }}</h2>
          <p>Rutas disponibles</p>
        </div>
      </div>

      <div id="map"></div>

      <div v-if="busSeleccionado" class="panelBus">
        <div class="contenedor-icono-reportes" v-on:click="irAReportes" v-show="confirmarSesionMapa">
          <i class='bx bx-chat'></i>
        </div>

        <h2>🚌 Bus {{ busSeleccionado.ruta }}</h2>
        <p><b>Conductor:</b> {{ busSeleccionado.conductor }}</p>
        <p><b>Placa:</b> {{ busSeleccionado.placa }}</p>
        <p><b>Capacidad:</b> {{ busSeleccionado.capacidad }} pasajeros</p>
        <p><b>Estado:</b> {{ estadoDeLosBuses }}</p>

        <button @click="cerrarPanel">Cerrar</button>
        <button v-show="confirmarSesionMapa" v-on:click="guardarRuta">Guardar ruta</button>
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

export default {
    components: {
        MapSkeleton
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
            confirmarSesionMapa: localStorage.getItem('SesionActiva') === 'true',
            cantidadBuses: 0,
            rutasDisponibles: 0,
            usuarioUbicacion: null,
            paradaCercanaMarker: null,
            filtroRuta: "",
            buses: [],
            rutas: [],
            paradas: []
        }
    },

    async mounted() {
        try {
            // Se ejecutan tus peticiones
            const [resBuses, resRutas, resParadas] = await Promise.all([
                fetch('http://localhost:3000/buses'),
                fetch('http://localhost:3000/rutas'),
                fetch('http://localhost:3000/paradas')
            ])
            this.buses = await resBuses.json()
            this.rutas = await resRutas.json()
            this.paradas = await resParadas.json()

            // Cargar puntos de cada ruta
            for (const ruta of this.rutas) {
                const res = await fetch(`http://localhost:3000/rutas/${ruta.id}/puntos`)
                const puntos = await res.json()
                ruta.puntos = puntos.map(p => [p.latitud, p.longitud])
            }

            this.cantidadBuses = this.buses.length
            this.rutasDisponibles = this.rutas.length

        } catch (error) {
            console.error("Error cargando los datos de los buses:", error)
        } finally {
            // 1. Quitamos el skeleton
            this.cargando = false;

            // 2. Esperamos a que Vue "dibuje" el div #map y luego iniciamos Leaflet
            this.$nextTick(() => {
                this.iniciarMapa();
            });
        }
    },

    methods: {
        iniciarMapa() {
            const santaMartaBounds = L.latLngBounds([11.00, -74.28], [11.32, -74.12]);

            this.map = L.map("map", {
                maxBounds: santaMartaBounds,
                maxBoundsViscosity: 0.9,
                minZoom: 11
            }).setView([11.18, -74.21], 12);

            L.tileLayer(
                "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
                { maxZoom: 19 }
            ).addTo(this.map);

            this.buses.forEach((bus) => {
                const ruta = this.rutas.find(r => r.codigo === bus.codigo)
                if (!ruta) return;

                const busIcon = L.icon({
                    iconUrl: "https://cdn-icons-png.flaticon.com/128/3448/3448316.png",
                    iconSize: [40, 40],
                    iconAnchor: [20, 20]
                });

                const marker = L.marker([bus.latitud, bus.longitud], {
                    icon: busIcon,
                    rotationAngle: 0
                }).addTo(this.map);

                marker.bindTooltip(bus.nombre_ruta, { permanent: true, direction: "top" });

                this.busesMarkers.push({ bus, marker, ruta });

                marker.on("click", () => {
                    this.confirmarSesionMapa = localStorage.getItem('SesionActiva') === 'true';
                    this.busSeleccionado = bus;
                    this.estadoDeLosBuses = bus.estado;
                    this.mostrarRuta(ruta);
                    marker.setZIndexOffset(1000);
                });

                this.animarBus(marker, ruta, bus);
            });

            this.map.locate({ setView: true, maxZoom: 16 });

            this.map.on("locationfound", (e) => {
                this.usuarioUbicacion = e.latlng;
                L.marker(e.latlng).addTo(this.map).bindPopup("📍 Tu estás aquí").openPopup();
                L.circle(e.latlng, { radius: e.accuracy }).addTo(this.map);
                this.buscarBusMasCercano();
                this.buscarParadaMasCercana();
            });

            this.map.on("locationerror", () => {
                alert("No se pudo obtener tu ubicación. Activa el GPS");
            });
        },

        mostrarBusesActivos() {
            this.$router.push("/busesActivos")
        },

        irAReportes() {
            this.$router.push("/reportes")
        },

        verRutasDisponibles() {
            this.$router.push("/administrarRutas")
        },

        irAMiUbicacion() {
            if (!this.usuarioUbicacion) return;
            this.map.setView(this.usuarioUbicacion, 16, { animate: true });
        },

        mostrarRuta(ruta) {
            const coordenadas = ruta.puntos.map(p => L.latLng(p[0], p[1]));

            if (this.rutaActiva) {
                this.rutaActiva.remove();
                this.rutaActiva = null;
            }

            if (!this.map) return;

            this.rutaActiva = L.Routing.control({
                waypoints: coordenadas,
                router: L.Routing.osrmv1({
                    serviceUrl: "https://router.project-osrm.org/route/v1"
                }),
                addWaypoints: false,
                draggableWaypoints: false,
                show: false,
                createMarker: () => null,
                lineOptions: {
                    styles: [{ color: "#1387d4", weight: 6, opacity: 0.95 }]
                }
            }).addTo(this.map);

            this.rutaActiva.on('routingerror', () => { /* ignorar error de ruta*/ });
        },

        buscarBusMasCercano() {
            if (!this.usuarioUbicacion) return;

            let busMasCercano = null;
            let distanciaMinima = Infinity;

            this.busesMarkers.forEach(b => {
                const distancia = this.map.distance(this.usuarioUbicacion, b.marker.getLatLng());
                if (distancia < distanciaMinima) {
                    distanciaMinima = distancia;
                    busMasCercano = b;
                }
            });

            if (!busMasCercano) return;

            const distanciaKm = (distanciaMinima / 1000).toFixed(2);
            busMasCercano.marker.bindPopup(
                `🚍 Bus ${busMasCercano.bus.nombre_ruta}<br>📏 ${distanciaKm} km`
            ).openPopup();
        },

        buscarParadaMasCercana() {
            if (!this.usuarioUbicacion) return;

            let paradaMasCercana = null;
            let distanciaMinima = Infinity;

            this.paradas.forEach(parada => {
                const distancia = this.map.distance(
                    this.usuarioUbicacion,
                    [parada.latitud, parada.longitud]
                );
                if (distancia < distanciaMinima) {
                    distanciaMinima = distancia;
                    paradaMasCercana = parada;
                }
            });

            if (!paradaMasCercana) return;

            if (this.paradaCercanaMarker) {
                this.map.removeLayer(this.paradaCercanaMarker);
            }

            const icono = L.icon({
                iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
                iconSize: [40, 40]
            });

            this.paradaCercanaMarker = L.marker(
                [paradaMasCercana.latitud, paradaMasCercana.longitud],
                { icon: icono }
            ).addTo(this.map);

            this.paradaCercanaMarker.bindPopup(
                `🛑 <b>Parada más cercana</b><br>${paradaMasCercana.nombre}<br>📏 ${distanciaMinima.toFixed(0)} metros`
            ).openPopup();
        },

        animarBus(marker, ruta, bus) {
            const puntos = ruta.puntos.map(p => L.latLng(p[0], p[1]));
            let i = 0;

            const moverAlSiguiente = () => {
                if (!this.map || !this.mapaActivo) return;

                const actual = puntos[i];
                const siguiente = puntos[(i + 1) % puntos.length];

                const cercaDeParada = this.paradas.some(p => {
                    const distancia = this.map.distance(actual, L.latLng(p.latitud, p.longitud));
                    return distancia < 80;
                });

                bus.estado = cercaDeParada ? "En parada 🛑" : "En movimiento 🚌";

                if (this.busSeleccionado && this.busSeleccionado.id === bus.id) {
                    this.estadoDeLosBuses = bus.estado;
                }

                const angulo = Math.atan2(
                    siguiente.lng - actual.lng,
                    siguiente.lat - actual.lat
                ) * (180 / Math.PI);

                marker.setLatLng(siguiente);

                if (marker.setRotationAngle) {
                    marker.setRotationAngle(angulo);
                }

                i = (i + 1) % puntos.length;
            };

            const intervalo = setInterval(moverAlSiguiente, 1500);
            this.intervalosBuses.push(intervalo);
        },

        buscarRuta() {
            if (!this.filtroRuta) return;

            const texto = this.filtroRuta.toUpperCase();
            const busEncontrado = this.busesMarkers.find(b =>
                b.bus.nombre_ruta.toUpperCase().includes(texto)
            );

            if (!busEncontrado) return;

            this.map.setView(busEncontrado.marker.getLatLng(), 16, { animate: true });
            busEncontrado.marker.openPopup();
            this.busSeleccionado = busEncontrado.bus;
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
            if (!nombreRuta || nombreRuta.trim() === "") return;

            const rutasGuardadas = JSON.parse(localStorage.getItem('rutasMasUsadas')) || [];

            const nuevaRuta = {
                id: Date.now(),
                nombreRuta: nombreRuta.trim(),
                rutaBus: this.busSeleccionado.nombre_ruta,
                placa: this.busSeleccionado.placa,
                conductor: this.busSeleccionado.conductor,
                capacidad: this.busSeleccionado.capacidad
            };

            rutasGuardadas.push(nuevaRuta);
            localStorage.setItem('rutasMasUsadas', JSON.stringify(rutasGuardadas));
            alert("✅ Ruta guardada como: " + nuevaRuta.nombreRuta);
        }
    },

    beforeUnmount() {
        this.mapaActivo = false;
        this.intervalosBuses.forEach(i => clearInterval(i));
        this.intervalosBuses = [];

        if (this.map) {
            this.map.stop();

            if (this.rutaActiva) {
                this.rutaActiva.off();
                try { this.rutaActiva.remove(); } catch (e) { /* ignorar */ }
                this.rutaActiva = null;
            }

            this.busesMarkers.forEach(b => {
                b.marker.off();
                this.map.removeLayer(b.marker);
            });
            this.busesMarkers = [];

            if (this.paradaCercanaMarker) {
                this.map.removeLayer(this.paradaCercanaMarker);
                this.paradaCercanaMarker = null;
            }

            this.map.off();
            this.map.remove();
            this.map = null;
        }
    }
}
</script>

<style scoped>
.contenedor {
  background-color: #0b1120; 
  min-height: 100vh; 
  margin: 0;
  padding: 30px; 
  background-attachment: fixed;
  font-family: 'Inter', sans-serif;
}

.contenedor-titulo {
  display: flex;
  justify-content: center; 
  width: 100%;
  margin-bottom: 45px; /* Espaciado con el buscador */
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
  width: 340px;
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
</style>