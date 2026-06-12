<template>
  <main class="pantalla-completa"> 
    <ToastComponent/>

    <div class="Tarjeta-Login">
      <div class="encabezado-login">
        <img src="../assets/logo+tipografia-pronto.png" alt="Logo Pronto" class="logo-img">
        <span class="badge-login">Acceso Seguro</span>
        <h1>Bienvenido</h1>
        <p>Inicia sesión para continuar en el sistema</p>
      </div>

      <div class="formulario-vertical">
        <div class="campo">
          <label for="usuario">Usuario</label>
          <input 
            type="text" 
            placeholder="Ingrese el usuario" 
            class="input-moderno" 
            id="usuario" 
            v-model="validar_usuario"
          >
        </div>

        <div class="campo">
          <label for="contrasena">Contraseña</label>
          <input 
            type="password" 
            placeholder="Ingrese la contraseña" 
            class="input-moderno" 
            id="contrasena" 
            v-model="validar_contrasena"
          >
          <a class="olvido-pass" @click="abrirRecuperar">¿Olvidaste la contraseña?</a>
        </div>
      </div>

      <div class="footer-acciones">
        <button class="btn-login-principal" @click="ValidarLogin">
          Iniciar sesión
        </button>
        
        <div class="divisor">o también</div>

        <button class="btn-secundario-glass" @click="ResgistrarLogin">
          Crear una cuenta nueva
        </button>
      </div>
    </div>

    <!-- Modal recuperar contraseña -->
    <div v-if="mostrarRecuperar" class="modal-fondo">
      <div class="modal-caja">
        <h3>🔑 Recuperar contraseña</h3>
        <p class="modal-desc">Ingresa tu usuario y tu nueva contraseña</p>
        <input type="text" placeholder="Tu usuario" class="input-moderno" v-model="rec_usuario">
        <input type="password" placeholder="Nueva contraseña" class="input-moderno" v-model="rec_nueva">
        <input type="password" placeholder="Confirmar contraseña" class="input-moderno" v-model="rec_confirmar">
        <button class="btn-login-principal" @click="recuperarContrasena">Cambiar contraseña</button>
        <button class="btn-secundario-glass" @click="mostrarRecuperar = false">Cancelar</button>
      </div>
    </div>

  </main>
</template>

<script>
export default {
  name: "LoginView",

  data() {
    return {
      validar_usuario: "",
      validar_contrasena: "",
      mostrarRecuperar: false,
      rec_usuario: "",
      rec_nueva: "",
      rec_confirmar: ""
    }
  },

  methods: {
    async ValidarLogin() {
      this.$toast.removeAllGroups()

      localStorage.removeItem('SesionActiva')
      localStorage.removeItem('UsuarioLogueado')
      localStorage.removeItem('token')

      if (!this.validar_usuario || !this.validar_contrasena) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Campos incompletos',
          detail: 'Por favor, ingrese su usuario y contraseña',
          life: 3000
        })
        return
      }

      try {
        const respuesta = await fetch(`${process.env.VUE_APP_API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usuario: this.validar_usuario,
            contrasena: this.validar_contrasena
          })
        })

        const datos = await respuesta.json()

        if (!respuesta.ok) {
          this.$toast.removeAllGroups();
          this.$toast.add({
            severity: 'error',
            summary: 'Error de Autenticación',
            detail: datos.error,
            life: 3000
          })
          return
        }

        if (datos.token) {
          localStorage.setItem('SesionActiva', 'true')
          localStorage.setItem('UsuarioLogueado', datos.usuario)
          localStorage.setItem('token', datos.token)
        }else {
          console.error("El servidor no proporcionó un token de autenticación.")
        }
        this.$toast.removeAllGroups();
        this.$toast.add({
          severity: 'success',
          summary: '¡Acceso Concedido!',
          detail: `Bienvenido de nuevo, ${datos.usuario}`,
          life: 3000
        })

        setTimeout(() => {
          this.$router.push('/')
        }, 3000)

      } catch (error) {
        this.$toast.removeAllGroups();
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo conectar con el servidor.',
          life: 3000
        })
      }
    },

    ResgistrarLogin() {
      this.$router.push('/registro')
    },

    abrirRecuperar() {
      this.rec_usuario = ""
      this.rec_nueva = ""
      this.rec_confirmar = ""
      this.mostrarRecuperar = true
    },

    async recuperarContrasena() {
      if (!this.rec_usuario || !this.rec_nueva || !this.rec_confirmar) {
        this.$toast.removeAllGroups();
        this.$toast.add({
          severity: 'warn',
          summary: 'Campos incompletos',
          detail: 'Rellena todos los campos',
          life: 3000
        })
        return
      }

      if (this.rec_nueva !== this.rec_confirmar) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Las contraseñas no coinciden',
          life: 3000
        })
        return
      }

      try {
        const respuesta = await fetch(`${process.env.VUE_APP_API_URL}/auth/recuperar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usuario: this.rec_usuario,
            nuevaContrasena: this.rec_nueva
          })
        })

        const datos = await respuesta.json()
        this.$toast.removeAllGroups();

        if (!respuesta.ok) {
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: datos.error,
            life: 3000
          })
          return
        }

        this.$toast.add({
          severity: 'success',
          summary: '¡Listo!',
          detail: 'Contraseña actualizada correctamente',
          life: 3000
        })
        this.mostrarRecuperar = false

      } catch {
        this.$toast.removeAllGroups();
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo conectar con el servidor',
          life: 3000
        })
      }
    }
  }
}
</script>


<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
}

.pantalla-completa {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  min-height: calc(100vh - 70px);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-image: url('../assets/fondo-login.png');  
  background-size: cover;   /* se asegura que la imagen cubra todo el contenedor */
  background-position: left 10%;
}

.Tarjeta-Login {
  position: relative;
  z-index: 1;
  background: rgb(3, 24, 53);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 40px; 
  width: 100%;
  max-width: 600px; 
  padding: 30px 60px; 
}

.encabezado-login {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 20px;
}

.logo-img {
  height: 64px;
  margin-bottom: 10px;
  filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.1));
}

.badge-login {
  background: rgba(3, 53, 119, 0.349);
  color: #4f96fa;
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  margin-bottom: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

h1 {
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -1px;
  margin-bottom: 5px;
}

.encabezado-login p {
  color: #64748b;
  font-size: 1rem;
}

.formulario-vertical {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 25px; 
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 0.9rem;
  color: white;
  font-weight: 500;
  margin-left: 4px;
}

.input-moderno {
  background: white;
  border: none;
  padding: 16px 20px;
  border-radius: 18px;
  color: black;
  font-size: 1rem;
}

.input-moderno:focus {
  box-shadow: 0 0 0 4px rgba(30, 122, 241, 0.671);
}

.olvido-pass {
  color: #4f96fa;
  font-size: 0.85rem;
  text-align: right;
  text-decoration: none;
  font-weight: 500;
  margin-top: 2px;
  cursor: pointer;
}

.olvido-pass:hover {
  text-decoration: underline;
}

.footer-acciones {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.btn-login-principal {
  background: #ffd500;
  color: #0f172a;
  border: none;
  padding: 16px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.btn-login-principal:hover {
  background-color: rgba(224, 195, 30, 0.973);
}

.divisor {
  display: flex;
  align-items: center;
  color: #475569;
  font-size: 0.75rem;
  text-transform: uppercase;
  margin: 5px 0;
}

.divisor::before,
.divisor::after {
  content: "";
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.05);
  margin: 0 15px;
}

.btn-secundario-glass {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #f1f5f9;
  padding: 14px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
}

.btn-secundario-glass:hover {
  background: rgba(255, 255, 255, 0.08);
}

/* Modal */
.modal-fondo {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-caja {
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 28px;
  padding: 40px;
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  color: white;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
}

.modal-caja h3 {
  font-size: 1.4rem;
  font-weight: 700;
  text-align: center;
}

.modal-desc {
  color: #64748b;
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 5px;
}
</style>