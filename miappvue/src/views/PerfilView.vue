<template>
    <ToastComponent />
    <div class="perfil-view">
        <div class="header-decorativo">
            <div class="avatar-circulo">
                <i class='bx bxs-user'></i>
            </div>
            <h2 class="saludo">Mi Perfil</h2>
            <p class="subtexto">Gestiona tu cuenta</p>
        </div>

        <div class="Datos personales">
            <div class="info-grupo">
                <label><i class='bx bx-user'></i> Usuario</label>
                <div class="contenedor-correo">
                    <h3 class="correo-ver">{{ correoVer }}</h3>
                </div>
            </div>

            <div class="info-grupo">
                <label><i class='bx bx-map-pin'></i> Ubicación</label>
                <h3 class="dato-falso">Santa Marta, Colombia</h3>
            </div>
        </div>

        <!-- Botón cambiar contraseña -->
        <div class="contenedor-acciones">
            <button class="btn-cambiar-pass" v-on:click="abrirCambiarPass">
                <i class='bx bx-lock-alt'></i> Cambiar contraseña
            </button>
        </div>

        <!-- Formulario cambiar contraseña -->
        <div class="form-cambiar-pass" v-if="mostrarCambiarPass">
            <h3>🔑 Nueva contraseña</h3>
            <input type="password" placeholder="Nueva contraseña" class="input-pass" v-model="nuevaPass">
            <input type="password" placeholder="Confirmar contraseña" class="input-pass" v-model="confirmarPass">
            <div class="botones-confirmar">
                <button class="boton-aceptar" v-on:click="cambiarContrasena">Guardar</button>
                <button class="boton-cancelar" v-on:click="mostrarCambiarPass = false">Cancelar</button>
            </div>
        </div>

        <!-- Cerrar sesión -->
        <div class="contenedor-acciones">
            <div class="boton-cs" v-if="!salirCuenta" v-on:click="ConfirmacionCuenta">
                <button class="cerrar_sesion">
                    <i class='bx bx-log-out'></i> Cerrar sesión
                </button>
            </div>

            <div class="alertaCerrarSesion" v-else>
                <div class="TextoConfirmacion">
                    <i class='bx bx-error-circle'></i>
                    <h3>¿Estás seguro de realizar esta acción?</h3>
                </div>
                <div class="botones-confirmar">
                    <button class="boton-aceptar" v-on:click="accionAceptar">Aceptar</button>
                    <button class="boton-cancelar" v-on:click="accionCancelar">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            salirCuenta: false,
            correoVer: localStorage.getItem("UsuarioLogueado"),
            mostrarCambiarPass: false,
            nuevaPass: "",
            confirmarPass: ""
        }
    },
    methods: {
        abrirCambiarPass: function () {
            this.nuevaPass = ""
            this.confirmarPass = ""
            this.mostrarCambiarPass = true
        },

        async cambiarContrasena() {
            if (!this.nuevaPass || !this.confirmarPass) {
                this.$toast.add({ severity: 'warn', summary: 'Campos vacíos', detail: 'Rellena ambos campos', life: 3000 })
                return
            }
            if (this.nuevaPass !== this.confirmarPass) {
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Las contraseñas no coinciden', life: 3000 })
                return
            }
            try {
                const baseUrl = process.env.VUE_APP_API_URL || 'http://localhost:3000'
                const respuesta = await fetch(`${baseUrl}/auth/recuperar`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        usuario: this.correoVer,
                        nuevaContrasena: this.nuevaPass
                    })
                })
                const datos = await respuesta.json()
                if (!respuesta.ok) {
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: datos.error, life: 3000 })
                    return
                }
                this.$toast.add({ severity: 'success', summary: '¡Listo!', detail: 'Contraseña actualizada correctamente', life: 3000 })
                this.mostrarCambiarPass = false
            } catch {
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo conectar con el servidor', life: 3000 })
            }
        },

        ConfirmacionCuenta: function () {
            this.salirCuenta = true
        },

        accionAceptar: function () {
            localStorage.removeItem('UsuarioLogueado')
            localStorage.setItem('SesionActiva', 'false')
            this.$toast.add({
                severity: 'info',
                summary: 'Mensaje de información',
                detail: 'Usted ha cerrado sesión',
                life: 2000
            })
            setTimeout(() => {
                this.$router.push("/")
            }, 2000)
        },

        accionCancelar: function () {
            this.salirCuenta = false
        }
    }
}
</script>

<style scoped>
.perfil-view {
    min-height: 100vh;
    background: #0f172a;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px;
    font-family: 'Segoe UI', sans-serif;
    color: white;
}

.header-decorativo {
    text-align: center;
    margin-bottom: 30px;
}

.avatar-circulo {
    width: 80px;
    height: 80px;
    background: #ffd500;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 45px;
    color: #0f172a;
    margin: 0 auto 15px;
    box-shadow: 0 0 20px rgba(255, 213, 0, 0.3);
}

.saludo {
    font-size: 24px;
    margin: 0;
}

.subtexto {
    color: #94a3b8;
    font-size: 14px;
}

.Datos.personales {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 25px;
    border-radius: 20px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    margin-bottom: 20px;
}

.info-grupo {
    margin-bottom: 20px;
    text-align: left;
}

.info-grupo label {
    font-size: 12px;
    text-transform: uppercase;
    color: #ffd500;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 5px;
}

.correo-ver,
.dato-falso {
    font-size: 16px;
    margin: 0;
    color: #f1f5f9;
    word-wrap: break-word;
}

.contenedor-acciones {
    margin-bottom: 16px;
}

.btn-cambiar-pass {
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid #4f96fa;
    color: #4f96fa;
    padding: 12px 40px;
    border-radius: 12px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.3s;
    display: flex;
    align-items: center;
    gap: 10px;
}

.btn-cambiar-pass:hover {
    background: #4f96fa;
    color: white;
}

.form-cambiar-pass {
    background: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 25px;
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
}

.form-cambiar-pass h3 {
    font-size: 1.1rem;
    font-weight: 700;
    text-align: center;
}

.input-pass {
    background: white;
    border: none;
    padding: 14px 18px;
    border-radius: 12px;
    color: black;
    font-size: 1rem;
    width: 100%;
}

.cerrar_sesion {
    background: transparent;
    border: 2px solid #ef4444;
    color: #ef4444;
    padding: 12px 40px;
    border-radius: 12px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.3s;
    display: flex;
    align-items: center;
    gap: 10px;
}

.cerrar_sesion:hover {
    background: #ef4444;
    color: white;
}

.alertaCerrarSesion {
    background: #1e293b;
    padding: 25px;
    border-radius: 20px;
    border: 1px solid rgba(239, 68, 68, 0.5);
    max-width: 350px;
}

.TextoConfirmacion i {
    font-size: 40px;
    color: #ef4444;
    margin-bottom: 10px;
}

.botones-confirmar {
    display: flex;
    gap: 10px;
    margin-top: 10px;
}

.boton-aceptar,
.boton-cancelar {
    flex: 1;
    padding: 10px;
    border-radius: 8px;
    border: none;
    font-weight: bold;
    cursor: pointer;
}

.boton-aceptar {
    background: #475569;
    color: white;
}

.boton-cancelar {
    background: #475569;
    color: white;
}

/* Responsividad */
@media (max-width: 768px) {
  .perfil-view {
    padding: 20px 15px;
  }
  .Datos.personales {
    padding: 20px 15px;
    max-width: 100%;
  }
  .btn-cambiar-pass, .cerrar_sesion {
    width: 100%;
    justify-content: center;
  }
  .form-cambiar-pass, .alertaCerrarSesion {
    max-width: 100%;
  }
}
</style>