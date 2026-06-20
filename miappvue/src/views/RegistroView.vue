<template>
  <main class="pantalla-completa">
    <ToastComponent/>

    <div class="Tarjeta-Login">
      <div class="encabezado-login">
        <img src="../assets/logo+tipografia-pronto.png" alt="Logo Pronto" class="logo-img">
        <span class="badge-login">Nuevo Usuario</span>
        <h1>Crea tu cuenta</h1>
        <p>Regístrate para comenzar a usar el sistema</p>
      </div>

      <div class="formulario-vertical">
        <div class="campo">
          <label for="nuevo_usuario">Usuario</label>
          <input type="text" placeholder="Crea tu nombre de usuario" class="input-moderno" id="nuevo_usuario" v-model="nuevo_usuario">
        </div>

        <div class="campo">
          <label for="nueva_contrasena">Contraseña</label>
          <input type="password" placeholder="Crea tu contraseña" class="input-moderno" id="nueva_contrasena" v-model="nueva_contrasena">
        </div>

        <div class="contenedor-terminos">
          <CheckBox v-model="aceptaTerminos" :binary="true" id="checkTerminos" />
          <label for="checkTerminos" class="label-terminos">
            Acepto los <a href="#" @click.prevent="mostrarModal = true">términos y condiciones</a>
          </label>
        </div>
      </div>

      <div class="footer-acciones">
        <button class="btn-login-principal" @click="RegistrarUsuario" :disabled="!aceptaTerminos">
          Registrarme ahora
        </button>
        
        <div class="divisor">o también</div>

        <button class="btn-secundario-glass" @click="VolverAlLogin">
          ¿Ya tienes cuenta? Inicia sesión
        </button>
      </div>
    </div>

<DialogComponent 
  v-model:visible="mostrarModal" 
  modal 
  header="Términos y Condiciones" 
  :style="{ width: '85vw', maxWidth: '500px' }"
  class="modal-dark"
>
  <div class="cuerpo-legal">
    <section>
      <h3>1. Uso del Servicio</h3>
      <p>Pronto es una plataforma de información en tiempo real para el transporte público de Santa Marta. El usuario acepta que la precisión de los datos depende de los sistemas GPS de terceros.</p>
    </section>

    <section>
      <h3>2. Privacidad de Datos</h3>
      <p>Su nombre de usuario y contraseña se almacenan de forma local. No recopilamos información personal sensible ni compartimos sus datos con entidades externas.</p>
    </section>

    <section>
      <h3>3. Responsabilidad Limitada</h3>
      <p>El sistema Pronto no se hace responsable por retrasos en las rutas, cambios de itinerario de los buses o fallas en la conexión de red del dispositivo del usuario.</p>
    </section>

    <section>
      <h3>4. Propiedad Intelectual</h3>
      <p>El diseño de la interfaz, logotipos y el nombre "Pronto" son propiedad intelectual del proyecto. Queda prohibida su reproducción sin autorización.</p>
    </section>

    <section>
      <h3>5. Modificaciones</h3>
      <p>Nos reservamos el derecho de actualizar estos términos para mejorar la seguridad y la experiencia del ciudadano samario.</p>
    </section>
  </div>

  <template #footer>
    <button class="btn-entendido" @click="mostrarModal = false">Entendido</button>
  </template>
</DialogComponent>
  </main>
</template>

<script>
export default {
  data() {
    return {
      nuevo_usuario: "",
      nueva_contrasena: "",
      aceptaTerminos: false,
      mostrarModal: false
    }
  },
  methods: {
    async RegistrarUsuario() {
      this.$toast.removeAllGroups()

      if (!this.aceptaTerminos) {
        this.$toast.add({ severity: 'warn', summary: 'Atención', detail: 'Debes aceptar los términos para registrarte.', life: 3000 })
        return
      }

      if (!this.nuevo_usuario || !this.nueva_contrasena) {
        this.$toast.add({ severity: 'warn', summary: 'Campos incompletos', detail: 'Por favor, ingresa un usuario y una contraseña.', life: 3000 })
        return
      }

      if (this.nueva_contrasena.length < 4) {
        this.$toast.add({ severity: 'error', summary: 'Contraseña débil', detail: 'La contraseña debe tener al menos 4 caracteres.', life: 3000 })
        return
      }

      try {
        const baseUrl = process.env.VUE_APP_API_URL || 'http://localhost:3000'
        const respuesta = await fetch(`${baseUrl}/auth/registro`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usuario: this.nuevo_usuario,
            contrasena: this.nueva_contrasena
          })
        })

        const datos = await respuesta.json()

        if (!respuesta.ok) {
          this.$toast.add({ severity: 'error', summary: 'Error', detail: datos.error, life: 3000 })
          return
        }

        this.$toast.add({ severity: 'success', summary: '¡Éxito!', detail: 'Usuario creado correctamente. Redirigiendo...', life: 4000 })
        setTimeout(() => {
          this.$router.push('/login')
        }, 4000)

      } catch (error) {
        this.$toast.removeAllGroups();
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo conectar con el servidor.', life: 3000 })
      }
    },

    VolverAlLogin() {
      this.$router.push('/login')
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
  background: #0b1120;
  min-height: calc(100vh - 70px);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 17px;
  background-image: url('../assets/fondo-login.png');  
  background-size: cover;   /* se asegura que la imagen cubra todo el contenedor */
  background-position: left 11%;
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
  outline: none;
  box-shadow: 0 0 0 4px rgba(30, 122, 241, 0.671);
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

.contenedor-terminos {         /* estilo para el checkbox / casilla aceptar terminos*/
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
  padding: 0 5px;
}

.label-terminos {
  color: #d1d1d1;
  font-size: 0.85rem;
}

.label-terminos a {
  color: #ffd500;
  font-weight: bold;
  text-decoration: none;
}

.btn-login-principal:disabled {     /* el boton permanece desabilitado mientras no se acepten los terminos*/
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-entendido {
  background: #ffd500;
  color: #0a0f18;
  border: none;
  padding: 8px 20px;
  border-radius: 16px;
  font-weight: bold;
  cursor: pointer;
}

.cuerpo-legal {
  max-height: 400px;      /* permite scroll si el texto es muy largo */
  overflow-y: auto;
  padding-right: 10px;
}

.cuerpo-legal section {
  margin-bottom: 20px;
}

.cuerpo-legal h3 {
  color: #ffd500;               /* titulos en amarillo*/
   font-size: 13px;
  margin-bottom: 8px;
  text-transform: uppercase;
  font-family: Verdana, Geneva, Tahoma, sans-serif;

}

.cuerpo-legal p {
  color: #e2e8f0;
  font-size: 0.9rem;
  line-height: 1.6;
  text-align: justify;
  font-size: 14px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;

}
</style>