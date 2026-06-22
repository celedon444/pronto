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
    <p>Inicio</p>
    <p>Explorar mapa</p>
    <p>Administrar rutas</p>
    <p>Política de Privacidad</p>
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

</footer>
</template>

<script>
    export default {
        name: "AppFooter"
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
</style>