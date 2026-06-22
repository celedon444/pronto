<template>

    <footer id="Contacto" class="footer">
    <div class="footer-contenido">
        <div class="footer-secciones">
          <img src="../assets/logo+tipografia-pronto.png" alt="" class="footer-logo">
        <p>
          <br>Sistema de Transporte Público 
        </p>
    </div>

<div class="footer-secciones">
    <h4>Menú</h4>
    <p><router-link to="/" class="footer-link">Inicio</router-link></p>
    <p><router-link to="/mapa" class="footer-link">Explorar mapa</router-link></p>
    <p><router-link to="/administrarRutas" class="footer-link">Administrar rutas</router-link></p>
    <p><a href="#" class="footer-link" @click.prevent="mostrarModalTerminos = true">Términos y condiciones</a></p>
</div>

<div class="footer-secciones">
    <h4>Redes sociales</h4>
    <div class="icono-redesSociales">
        <i class="bx bxl-facebook-circle"></i>
        <p class="texto-iconos">Facebook</p>
    </div>
    <div class="icono-redesSociales">
        <i class="bx bxl-instagram"></i>
        <p class="texto-iconos">Instagram</p>
    </div>
    <div class="icono-redesSociales">
        <i class="bx bxl-whatsapp"></i>
        <p class="texto-iconos">WhatsApp</p>
    </div>
   
</div>

<div class="footer-contactar">
    <h4>Contacto</h4>
    <div class="icono-redesSociales">
        <i class="bx bx-map"></i>
        <p>Calle 5 #45-67 Santa Marta</p>
    </div>
    <div class="icono-redesSociales">
        <i class="bx bxl-gmail"></i>
        <p> pronto@gmail.com</p>
    </div>
    <div class="icono-redesSociales">
        <i class="bx bx-phone"></i>
        <p> +57 3017657878</p>
    </div>
</div>

</div>
    <div class="footer-derechos">
    <p>© 2026 Pronto | Todos los derechos reservados</p>
</div>

<DialogComponent 
  v-model:visible="mostrarModalTerminos" 
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
    <button class="btn-entendido" @click="mostrarModalTerminos = false">Entendido</button>
  </template>
</DialogComponent>

</footer>
</template>

<script>
    export default {
        name: "AppFooter",
        data() {
            return {
                mostrarModalTerminos: false
            }
        }
    }
</script>

<style scoped>



.footer {
    background-color: #1e3a8a;
    color: #bbb;
    font-family: Arial, Helvetica, sans-serif;
    padding: 20px 20px;
   
}

.footer-contenido {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    max-width: 1200px;
    margin: auto;
    gap: 60px;
}

.footer-secciones {
    flex: 1;
    min-width: 180px;
}

.footer-contactar {
    flex: 1;
    min-width: 180px;
}

.footer-logo{
    width: 190px;
    margin-bottom: 12px;
}

.footer-secciones h4,
.footer-contactar h4 {
    color:#1387d4;
    margin-bottom: 10px;
    font-size: 16px;
}

.footer-secciones p,
.footer-contactar p,
.footer-ubicaciones p {
    margin: 6px 0;
    font-size: 14px;
    color: white;
}

.footer-link {
    text-decoration: none;
    color: white;
    transition: color 0.3s ease;
}

.footer-link:hover {
    color: #ffd500;
}

.footer-derechos{
    text-align: center;
    border-top: 1px solid #444;
    margin-top: 20px;
    padding-top: 15px;
    font-size: 12px;
    color: white;
}

.icono-redesSociales {
    font-size: 21px;
    display: flex;
    align-items: center; 
    gap: 8px;
}

/* Responsividad */
@media (max-width: 768px) {
    .footer {
        padding: 30px 15px;
    }
    .footer-contenido {
        flex-direction: column;
        gap: 35px;
        text-align: center;
        align-items: center;
    }
    .footer-secciones, .footer-contactar {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .icono-redesSociales {
        justify-content: center;
    }
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
  max-height: 400px;
  overflow-y: auto;
  padding-right: 10px;
}

.cuerpo-legal section {
  margin-bottom: 20px;
}

.cuerpo-legal h3 {
  color: #ffd500;
  font-size: 13px;
  margin-bottom: 8px;
  text-transform: uppercase;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.cuerpo-legal p {
  color: #e2e8f0;
  font-size: 14px;
  line-height: 1.6;
  text-align: justify;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

::v-deep .modal-dark .p-dialog-header {
  background: #0f172a;
  color: white;
}
::v-deep .modal-dark .p-dialog-content {
  background: #0f172a;
  color: white;
}
::v-deep .modal-dark .p-dialog-footer {
  background: #0f172a;
}
</style>