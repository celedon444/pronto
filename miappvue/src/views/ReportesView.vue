<template>
<div class="reportes-view">

  <header class="reportes-header">
    <button class="boton-volver" v-on:click="VolverBoton">
      <i class='bx bx-left-arrow-alt'></i>
    </button>
    <h1>Reportes</h1>
  </header>

  <main class="reportes-lista">
    <TarjetaReporte
      v-for="reporte in listaReportes"
      :key="reporte.id"
      :reporte="reporte"
    />

    <div v-if="listaReportes.length === 0" class="sin-reportes">
      <p>No hay reportes aún. ¡Sé el primero!</p>
    </div>
  </main>

  <section class="reportes-input-contenedor">
    <div class="input-reporte">
      <input type="text" placeholder="Envía tus reportes aquí..." v-model="almacenarReporte">
      <button class="boton-enviar" v-on:click="guardarReporte">
        <i class='bx bx-send'></i>
      </button>
    </div>
  </section>

</div>
</template>

<script>
import TarjetaReporte from '../components/TarjetaReporte.vue'

export default {
    components: {
        TarjetaReporte
    },

    data() {
        return {
            almacenarReporte: "",
            listaReportes: [],
            usuarioMostrar: localStorage.getItem("UsuarioLogueado")
        }
    },

    async mounted() {
        await this.cargarReportes()
    },

    methods: {
        VolverBoton: function () {
            this.$router.push("/mapa")
        },

        async cargarReportes() {
            try {
                const token = localStorage.getItem('token')
                const baseUrl = process.env.VUE_APP_API_URL || 'http://localhost:3000'
                const respuesta = await fetch(`${baseUrl}/reportes`, {
                    headers: { 'Authorization': `Bearer ${token}` }}
                )
                const datos = await respuesta.json()
                this.listaReportes = Array.isArray(datos) ? datos : []
            } catch {
                console.log("Error al cargar los reportes")
            }
        },

        async guardarReporte() {
            if (this.almacenarReporte === "") {
                alert("Llene el reporte correctamente")
                return
            }
            try {
                const token = localStorage.getItem('token')
                const baseUrl = process.env.VUE_APP_API_URL || 'http://localhost:3000'
                await fetch(`${baseUrl}/reportes`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        usuario: this.usuarioMostrar,
                        mensaje: this.almacenarReporte
                    })
                })
                this.almacenarReporte = ""
                await this.cargarReportes()
            } catch {
                console.log("Error al enviar el reporte")
            }
        }
    }
}

</script>

<style scoped>
.reportes-view {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #f1f5f9;
    font-family: "Segoe UI", sans-serif;
}

.reportes-header {
    display: flex;
    align-items: center;
    gap: 15px;
    background: #1e3a8a;
    color: white;
    padding: 15px 25px;
}

.reportes-header h1 {
    font-size: 22px;
    font-weight: 700;
}

.boton-volver {
    background: rgba(255, 255, 255, 0.15);
    border: none;
    color: white;
    font-size: 24px;
    border-radius: 8px;
    cursor: pointer;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    transition: 0.2s;
}

.boton-volver:hover {
    background: rgba(255, 255, 255, 0.25);
}

.reportes-lista {
    flex: 1;
    overflow-y: auto;
    padding: 20px 25px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.sin-reportes {
    text-align: center;
    color: #94a3b8;
    margin-top: 40px;
    font-size: 15px;
}

.reportes-input-contenedor {
    padding: 15px 25px;
    background: white;
    border-top: 1px solid #e2e8f0;
}

.input-reporte {
    display: flex;
    gap: 10px;
    align-items: center;
}

.input-reporte input {
    flex: 1;
    padding: 12px 15px;
    border: 1px solid #cbd5e1;
    border-radius: 10px;
    font-size: 15px;
    outline: none;
    transition: 0.2s;
    background-color: white;
    border-color: #2563eb;
    color: black;
}

.input-reporte input:focus {
    border: 2px solid #00c8fa;
}

.boton-enviar {
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 10px;
    padding: 12px 16px;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: 0.2s;
}

.boton-enviar:hover {
    background: #1e40af;
}

/* Responsividad */
@media (max-width: 768px) {
  .reportes-header {
    padding: 15px;
  }
  .reportes-lista {
    padding: 15px;
  }
  .reportes-input-contenedor {
    padding: 15px;
  }
}
</style>