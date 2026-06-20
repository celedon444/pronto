<template>
    <div class="menu-hamburguesa">

        <i class='bx bx-menu' v-on:click="mostrarMenuHmburguesa"></i>
        
        <div class="menuDesplegable" v-show="contenidoMenu">
            <div v-on:click="ejecuarValidacionPerfil">
                <ul class="txt-dentro-menuHamburguesa">
                    <i class='bx bxs-user-circle' style="margin-right: 10px; font-size: 20px;"></i>
                    Perfil
                </ul>
            </div>
            
            <div class="divisor-menu"></div>
            
            <div v-on:click="llevaralMapa">
                <ul class="txt-dentro-menuHamburguesa">Mapa</ul>
            </div>
            
            <div v-on:click="ejecuarValidacion" v-show="contenidoMenu">
                <ul class="txt-dentro-menuHamburguesa">Administrar rutas</ul>
            </div>
            
            <div v-on:click="ejecuarValidacionReporte" v-show="contenidoMenu">
                <ul class="txt-dentro-menuHamburguesa">Reportes</ul>
            </div>

            <div v-on:click="abrirAsistente" v-show="contenidoMenu">
                <ul class="txt-dentro-menuHamburguesa">Asistente</ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "MenuHamburguesa",
  data() {
    return {
      contenidoMenu: false
    }
  },
  methods: {
    mostrarMenuHmburguesa() {
      this.contenidoMenu = !this.contenidoMenu;
    },
    llevaralMapa() {
      this.$router.push("/mapa");
      this.contenidoMenu = false;
    },
    ejecuarValidacionPerfil() {
      // Aquí revisamos el localStorage justo al hacer clic
      const sesion = localStorage.getItem('SesionActiva');
      if (sesion === 'true') {
        this.$router.push("/perfil");
      } else {
        this.$router.push("/login");
      }
      this.contenidoMenu = false;
    },
    ejecuarValidacion() {
      const sesion = localStorage.getItem('SesionActiva');
      if (sesion === 'true') {
        this.$router.push("/administrarRutas");
      } else {
        this.$router.push("/login");
      }
      this.contenidoMenu = false;
    },
    ejecuarValidacionReporte() {
      const sesion = localStorage.getItem('SesionActiva');
      if (sesion === 'true') {
        this.$router.push("/reportes");
      } else {
        this.$router.push("/login");
      }
      this.contenidoMenu = false;
    },
    abrirAsistente() {
      this.$router.push("/asistente")
      this.contenidoMenu = false;
    }

  }
}
</script>

<style scoped>
.menu-hamburguesa {
  position: relative;
  display: flex;
  align-items: center;
}

.bx-menu {
  font-size: 35px;
  color: white;
  cursor: pointer;
  padding: 5px;
  border-radius: 8px;
}

.bx-menu:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffd500; 
}

.menuDesplegable {
  position: absolute;
  top: 55px;
  left: 0;
  background: #0f172a; 
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  width: 220px;
  box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.5);
  padding: 8px 0;
  z-index: 10000;
  overflow: hidden;
}

.divisor-menu {
  height: 3px;
  background-color: rgba(255, 213, 0, 0.527);
  margin: 5px 15px;
  border-radius: 4px;
}

.txt-dentro-menuHamburguesa {
  color: #e2e8f0;
  list-style: none;
  padding: 14px 20px;
  margin: 0;
  cursor: pointer;
  font-family: 'Segoe UI', Roboto, sans-serif;
  font-size: 15px;
  font-weight: 500;
  display: flex; /* Esto hace que el icono y el texto se alineen horizontalmente */
  align-items: center;
}

.txt-dentro-menuHamburguesa:hover {
  background: rgba(255, 213, 0, 0.1);
  color: #ffd500; 
  padding-left: 22px; 
}
</style>