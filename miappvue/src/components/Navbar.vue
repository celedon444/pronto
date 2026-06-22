<template>
  <header class="header-principal">
    <div class="seccion-izquierda">
      <menu-hamburguesa-componente />

      <div class="logo" v-on:click="volverInicio">
        <img class="logo-icono" src="../assets/logo-bus.png" alt="Logo bus" />
        <img
          class="logo-texto"
          src="../assets/tipografia-pronto.png"
          alt="Tipografia"
        />
      </div>
    </div>

  <nav class="contenedor-menu">
  <div class="buses-activos">
    <span class="indicador-online"></span>
    {{ BusesActivos }} Buses en línea
  </div>

  <template v-if="!logueado">
    <router-link to="/login">
      <button class="boton-sesion">Iniciar sesion</button>
    </router-link>
    <router-link to="/registro" class="router-registro">
      <button class="boton-registro">Registrarse</button>
    </router-link>
  </template>

  <div v-else class="perfil-usuario-autenticado">
    <div class="avatar-circular">
      {{ obtenerInicial(nombreUsuario) }}
    </div>
    <span class="nombre-usuario-nav">{{ nombreUsuario }}</span>
  </div>

  <section class="menu-rayitas"></section>
</nav>
  </header>

  <div class="texto-rodante">
    <span>
      ¡Pronto llegó a Santa Marta, consulta la ubicación de tus bus en tiempo
      real!ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ La información que
      necesitas para moverte está ahora en un solo
      lugarㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ La movilidad en
      Santa Marta ahora es más
      inteligenteㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ Optimiza tu
      tiempo y reduce la espera en las
      paradasㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ
    </span>
  </div>
</template>

<script>
import { buses } from "@/data/buses";
import MenuHamburguesaComponente from "./MenuHamburguesaComponente.vue";

export default {
  name: "AppNavbar",
  components: {
    MenuHamburguesaComponente,
  },

  data() {
    return {
      logueado: false,
      contenidoMenu: false,
      buses: buses,
      nombreUsuario: "",   /* aqui almacenamos el nombre del usuario logueado (celedon) */
    };
  },

  computed: {
    BusesActivos() {
      return this.buses.length;
    },
  },

  mounted() {      //aca se revisa si hay una sesion activa cuando se recargue la pagina
    this.verificarSesion();
  },
  watch: {    //ejecuta cada vez que cambia de pestaña (ME tenia loco esta parte)
    $route() {
      this.verificarSesion();
      this.contenidoMenu = false;
    },
  },
  methods: {
    volverInicio: function () {  
      this.$router.push("/");
    },
    //funcion para el mounted y watch
    verificarSesion() {
      const mostrador = localStorage.getItem("SesionActiva");
      if (mostrador === "true") {
        this.logueado = true;
        this.nombreUsuario = localStorage.getItem("UsuarioLogueado") || "Usuario";
      } else {
        this.logueado = false;
        this.nombreUsuario = "";
      }
    },
    obtenerInicial(nombre) {   /* extrae la primera letra del nombre usuario y la muestra en el avatar circular (celedon) */
      if (!nombre) return "U";
      return nombre.trim().charAt(0).toUpperCase();
    }
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.header-principal {
  display: flex;
  align-items: center;
  justify-content: space-between; /* mantiene el contenido de la izquierda y derecha en sus extremos (celedon)*/
  background: #1e3a8a;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  padding: 3px 140px;
  position: relative;
  z-index: 99999;
}

.seccion-izquierda {
  display: flex;
  align-items: center;
  gap: 30px; /* espacio entre el menú hamburguesa y el logo (celedon)*/
}

.logo {
  display: flex;
  align-items: center;
}

.logo-icono {
  height: 65px; /* tamaño logo (celedon)*/
  cursor: pointer;
}

.logo-texto {
  height: 48px; /* tamaño tipografia logo (celedon)*/
  cursor: pointer;
}

.buses-activos {
  color: white;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  align-items: center;
  margin-right: 60px;
  gap: 10px;  /* espacio entre el punto verde y el texto (celedon) */
}

.texto-rodante {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  color: white;
  background-color: #1387d4;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  padding: 5px 0;
}

.texto-rodante span {
  display: inline-block;
  padding-left: 100%;
  animation: mover 45s linear infinite; /* velocidad en la que se mueve el texto rodante  (celedon)*/
}

@keyframes mover {
  100% {
    transform: translateX(-100%);
  }
}

.contenedor-menu {
  display: flex;
  align-items: center;
  gap: 25px; /* espaciado entre botones "iniciar sesion" y "registrarse"  (celedon)*/
}

.boton-sesion,
.boton-registro {
  padding: 8px 12px;
  border-radius: 15px;
  background-color: #ffd500;
  color: black;
  cursor: pointer;
  border: none;
}

.boton-sesion:hover,
.boton-registro:hover {
  background: rgba(224, 195, 30, 0.973);
}

.indicador-online {  /* el punto verde estático principal */
  width: 10px;
  height: 10px;
  background-color: #0be73b; 
  border-radius: 50%;
  position: relative;
  display: inline-block;
}

.indicador-online::after {  /* la onda de radar que titila y se expande por detras */
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: #0be73b;
  border-radius: 50%;
  animation: pulsoVerde 1.3s cubic-bezier(0.24, 0, 0.38, 1) infinite;  /* tiempo de animacion */
}

@keyframes pulsoVerde {   /* animacion de la ondas */
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    opacity: 0.5; 
  }
  100% {
    transform: scale(2.3); /* que tanto se expande el circulo exterior */
    opacity: 0;            /* se desvanece por completo al terminar */
  }
}

.perfil-usuario-autenticado {
  display: flex;
  align-items: center;
  gap: 12px;  /* espacio entre el circulo y el texto */
  padding: 5px 15px 5px 6px;
  background: rgba(255, 255, 255, 0.05);  /* fondo translúcido para contenedor */
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}

.avatar-circular {
  width: 34px;
  height: 34px;
  background-color: #ffd500;
  color: #1e3a8a;            
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 17px;
}

.nombre-usuario-nav {
  color: white;
  font-size: 14px;
  font-weight: 600;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

/* Responsividad */
@media (max-width: 1024px) {
  .header-principal {
    padding: 10px 40px;
  }
}

@media (max-width: 768px) {
  .header-principal {
    padding: 10px 15px;
  }
  .seccion-izquierda {
    gap: 10px;
  }
  .logo-texto {
    display: none; /* Ocultar texto del logo en celular para ahorrar espacio */
  }
  .logo-icono {
    height: 45px; /* Logo más pequeño */
  }
  .buses-activos {
    margin-right: 0;
    font-size: 11px;
    gap: 5px;
  }
  .contenedor-menu {
    gap: 8px;
  }
  .boton-sesion, .boton-registro {
    padding: 6px 10px;
    font-size: 12px;
  }
  .texto-rodante {
    display: none; /* Ocultar texto rodante en móviles para diseño más limpio */
  }
  .nombre-usuario-nav {
    display: none; /* Mostrar solo el avatar en pantallas pequeñas */
  }
  .perfil-usuario-autenticado {
    padding: 3px;
    border: none;
    background: transparent;
  }
}
</style>
