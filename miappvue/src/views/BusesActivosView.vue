<template>
    <div class="contenedor">
        <div class="lista-buses">
            <div class="intro-seccion">
                <h1>Panel de Buses Activos</h1>
                <p>Monitoreo de los buses que se encuentran operando actualmente en el sistema.</p>
                <div class="contador-buses" v-if="almacenarBusesActivos.length > 0">
                    <span>{{ almacenarBusesActivos.length }} Buses en línea</span>
                </div>
                <div v-else class="contador-buses">
                    <span>Cargando buses...</span>
                </div>
            </div>

            <TarjetaBus
                v-for="bus in almacenarBusesActivos"
                :key="bus.id"
                :bus="bus"
            />
        </div>
    </div>
</template>

<script>
import TarjetaBus from '../components/TarjetaBus.vue'

export default {
    components: {
        TarjetaBus
    },

    data() {
        return {
            almacenarBusesActivos: []
        }
    },

    async mounted() {
        try {
            const token = localStorage.getItem('token')
            const baseUrl = process.env.VUE_APP_API_URL || 'http://localhost:3000'
            const respuesta = await fetch(`${baseUrl}/buses`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (respuesta.status === 401 || respuesta.status === 403) {
               console.error("sesion invalida o expirada. Redirigiendo al login.")
               this.$router.push('/login')
                return;
            }   

            const datos = await respuesta.json();

            if (respuesta.ok) {
                this.almacenarBusesActivos = datos;
            }else{
                console.error("Error del servidor:", datos.error)   
            }
        } catch (error) {
            console.error("Error al obtener los buses activos:", error);
        }
    }
}
</script>

<style scoped>
.contenedor {
    background: linear-gradient(180deg, #c8d5ef 0%, #f4f7f6 100%);
    min-height: 100vh;
    width: 100%;
    margin: 0;
    padding: 40px 0;
}

.lista-buses {
    width: 70%;
    margin: auto;
}

.intro-seccion {
    margin-top: 30px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.intro-seccion h1 {
    font-size: 40px;
    margin-bottom: 5px;
    color: #333;
}

.intro-seccion p {
    font-size: 20px;
    color: #302e2e;
    margin-bottom: 10px;
}

.contador-buses {
    font-size: 20px;
    font-weight: bold;
    color: #1e3a8a;
}
</style>