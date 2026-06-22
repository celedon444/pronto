<template>
  <div class="noticias-container">
    <header class="noticias-header">
      <div class="fila-encabezado">
        <div class="banner-titulo">
          <h1>Noticias</h1>
          <div class="decoracion-diagonal"></div>
        </div>

        <div class="consola-noticias">
          <div class="mini-escena-bus">
            <div class="carretera-infinita"></div>
            <img src="../assets/bus-loading.png" class="bus-animado-noticias" alt="Bus Pronto">
          </div>

          <div class="contenedor-typing">
            <span class="texto-animado">¡Hey Samario! Conoce las últimas noticias de <span class="resaltado">tu sistema de transporte</span></span>
          </div>
        </div>
      </div>
    </header>

    <main class="grid-noticias">
      <article
        v-for="noticia in listaNoticias" :key="noticia.id" class="tarjeta-noticia">

        <div class="contenedor-imagen">
          <img :src="noticia.imagen" :alt="noticia.titulo" />
        </div>

        <div class="contenido-noticia">
          <h2 class="titulo-noticia">{{ noticia.titulo }}</h2>
          <p class="extracto-noticia">{{ noticia.resumen }}</p>

          <div class="footer-noticia">
            <div class="fecha">
              <i class="bx bx-calendar"></i>
              <span>{{ noticia.fecha }}</span>
            </div>
            <button class="btn-leer-mas" @click="abrirNoticia(noticia)">Leer más</button>
          </div>

        </div>
      </article>
    </main>

    <div
      v-if="noticiaSeleccionada"
      class="modal-overlay"
      @click.self="cerrarNoticia"
    >
      <div class="modal-contenido animate-pop">
        <button class="btn-cerrar" @click="cerrarNoticia">
          <i class="bx bx-x"></i>
        </button>

        <img :src="noticiaSeleccionada.imagen" class="modal-img" />

        <div class="modal-texto">
          <span class="modal-tag">BOLETÍN OFICIAL - SETP</span>
          <h2>{{ noticiaSeleccionada.titulo }}</h2>
          <div class="modal-meta">
            <i class="bx bx-calendar"></i> {{ noticiaSeleccionada.fecha }} |
            Santa Marta, Colombia
          </div>
          <hr class="separador" />
          <p class="cuerpo-noticia">
            {{ noticiaSeleccionada.contenidoCompleto }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      noticiaSeleccionada: null,
      listaNoticias: [
        {
          id: 1,
          titulo: "Prueba piloto de bus eléctrico en Santa Marta finaliza con éxito",
          resumen: "La administración distrital culminó la evaluación de alternativas de movilidad eléctrica para mejorar el transporte público...",
          contenidoCompleto: "Tras 30 días de pruebas intensas por las principales avenidas de Santa Marta, el bus eléctrico piloto ha demostrado una eficiencia del 95% en comparación con los motores diesel tradicionales. La Alcaldía y el SETP confirmaron que el vehículo soportó las condiciones climáticas de la ciudad y las pendientes de sectores como Gaira y El Rodadero, marcando la ruta para la renovación de la flota hacia una movilidad 100% sostenible.",
          fecha: "27 abril, 2026",
          imagen: require("@/assets/prueba-bus.png"),
        },
        {
          id: 2,
          titulo: "Certificación a 22 conductores en competencias laborales",
          resumen: "Gracias a la alianza entre el SENA y el SETP, conductores de la ciudad fortalecen sus capacidades de servicio...",
          contenidoCompleto: "Un total de 22 operadores del sistema de transporte recibieron su certificado de competencias laborales tras completar un riguroso ciclo de formación. Los módulos incluyeron atención al usuario, seguridad vial, primeros auxilios y manejo de tecnologías de rastreo. Esta iniciativa busca elevar el estándar de calidad en el trato humano hacia el samario y garantizar un viaje más seguro para todos.",
          fecha: "20 abril, 2026",
          imagen: require("@/assets/certificacion-conduc.png"),
        },
        {
          id: 3,
          titulo: "Refuerzo de controles al transporte público en temporada alta",
          resumen: "La Alcaldía de Santa Marta intensifica operativos para garantizar seguridad y tarifas justas a los samarios...",
          contenidoCompleto: "Ante la alta afluencia de pasajeros, la Secretaría de Movilidad ha desplegado operativos en puntos estratégicos como la Terminal de Transportes, el Aeropuerto y el Centro Histórico. El objetivo es verificar que los conductores porten su documentación al día, respeten las tarifas oficiales y cumplan con las rutas establecidas, evitando cobros excesivos durante los días festivos.",
          fecha: "15 abril, 2026",
          imagen: require("@/assets/refuerzo-controles.png"),
        },
        {
          id: 4,
          titulo: "Nueva ruta S-54 conectará el sector de Pozos Colorados con el Centro",
          resumen: "A partir del próximo lunes, la comunidad contará con una frecuencia de 12 minutos en esta nueva ruta...",
          contenidoCompleto: "La nueva ruta S-54 es una respuesta a la creciente demanda de transporte en el corredor turístico de Pozos Colorados. Con un total de 12 buses despachados cada 12 minutos, esta ruta conectará de manera directa el sector hotelero con la Calle 22 en el centro, reduciendo la necesidad de transbordos en la congestionada Troncal del Caribe.",
          fecha: "05 mayo, 2026",
          imagen: require("@/assets/nueva-ruta.png"),
        },
        {
          id: 5,
          titulo: "Instalación de nuevos paraderos inteligentes con paneles solares",
          resumen: "Inicia la primera fase del proyecto de modernización de mobiliario urbano, equipando 10 paradas principales...",
          contenidoCompleto: "Santa Marta se pone a la vanguardia tecnológica con la instalación de los primeros paraderos inteligentes. Estas estructuras funcionan con energía solar y cuentan con iluminación LED nocturna, pantallas informativas sobre la llegada de buses y puertos USB para carga de dispositivos móviles, brindando mayor seguridad y confort mientras el usuario espera su ruta.",
          fecha: "02 mayo, 2026",
          imagen: require("@/assets/nuevos-paraderos.png"),
        },
        {
          id: 6,
          titulo: "Ajuste tarifario: Se mantiene el beneficio para estudiantes universitarios",
          resumen: "El SETP confirmó que el subsidio al transporte para estudiantes de la Unimagdalena y CUN seguirá vigente...",
          contenidoCompleto: "Tras una mesa de concertación liderada por la administración distrital y los representantes estudiantiles, se ratificó la permanencia del subsidio al pasaje. Los estudiantes carnetizados de instituciones como la Unimagdalena podrán seguir disfrutando de la tarifa diferencial, facilitando el acceso a la educación y apoyando la economía de las familias samarias.",
          fecha: "30 abril, 2026",
          imagen: require("@/assets/ajuste-tarifa.png"),
        },
        {
          id: 7,
          titulo: "Avanza la construcción de la Terminal de Transferencia de Mamatoco",
          resumen: "Esta obra clave del SETP permitirá la integración de rutas urbanas y rurales, mejorando la conexión del sector oriente...",
          contenidoCompleto: "La Terminal de Transferencia de Mamatoco alcanza un 80% de ejecución técnica. Esta infraestructura será el nodo central donde convergerán las rutas que vienen de Bonda y el sector rural con las rutas urbanas hacia el Rodadero y el Centro. Incluirá zonas de locales comerciales, baños públicos y una estación de monitoreo permanente.",
          fecha: "09 mayo, 2026",
          imagen: require("@/assets/construccion.png"),
        },
        {
          id: 8,
          titulo: "SETP intensifica socialización de la Tarjeta Ciudadana en universidades",
          resumen: "El equipo del Sistema Estratégico visitó la Unimagdalena para explicar los beneficios del pago electrónico...",
          contenidoCompleto: "Con el fin de eliminar gradualmente el uso de efectivo en los buses, el SETP inició jornadas de pedagogía sobre la Tarjeta Ciudadana. Los estudiantes conocieron cómo recargar sus tarjetas a través de la app y los puntos físicos, además de experimentar la rapidez del abordaje al usar el sensor electrónico instalado en los buses azules.",
          fecha: "07 mayo, 2026",
          imagen: require("@/assets/universidades.png"),
        },
        {
          id: 9,
          titulo: "Finaliza pavimentación de tramos viales en la Carrera 19",
          resumen: "La rehabilitación de esta vía principal garantiza un tránsito más fluido para los buses, reduciendo el desgaste...",
          contenidoCompleto: "La entrega de los tramos rehabilitados en la Carrera 19 representa un alivio para los transportadores. Con una capa asfáltica renovada y señalización horizontal de alta visibilidad, los buses del SETP podrán circular con mayor agilidad, disminuyendo los tiempos de viaje en un promedio de 8 minutos durante las horas pico.",
          fecha: "05 mayo, 2026",
          imagen: require("@/assets/pavimentacion.png"),
        },
      ],
    };
  },

  methods: {
    abrirNoticia(noticia) {
      this.noticiaSeleccionada = noticia;
      document.body.style.overflow = "hidden";  /* al abrir la venta emergente bloquea el scroll del fondo */
    },
    cerrarNoticia() {
      this.noticiaSeleccionada = null;
      document.body.style.overflow = "auto";    /* al cerrar la ventana emergente devuelve el scroll */
    }, 
  },
};
</script>


<style scoped>

.noticias-container {
  background: #f8fafc;
  min-height: 100vh;
  padding-bottom: 50px;
  font-family: "Segoe UI", sans-serif;
}

.noticias-header {
  background: white;
  padding: 20px 10%;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 20px;
}

.banner-titulo {
  display: flex;
  align-items: center;
  background: #004a87;
  width: fit-content;
  padding-right: 40px;
  position: relative;
  overflow: hidden;
}

.banner-titulo h1 {
  color: white;
  margin: 0;
  padding: 10px 25px;
  font-size: 24px;
  text-transform: uppercase;
  z-index: 2;
}

.decoracion-diagonal {
  position: absolute;
  right: -20px;
  top: 0;
  width: 50px;
  height: 100%;
  background: #00c8fa;
  transform: skewX(-25deg);
}

.grid-noticias {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  padding: 20px 10%;
}

.tarjeta-noticia {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.tarjeta-noticia:hover {
  transform: translateY(-5px);
}

.contenedor-imagen img {
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.contenido-noticia {
  padding: 25px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.titulo-noticia {
  font-size: 18px;
  color: #1e3a8a;
  line-height: 1.4;
  margin-bottom: 15px;
  font-weight: 700;
  min-height: 50px;
}

.extracto-noticia {
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 25px;
  overflow: hidden;
}

.footer-noticia {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f1f5f9;
  padding-top: 15px;
}

.fecha {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
  font-size: 13px;
}

.btn-leer-mas {
  background: none;
  border: none;
  color: #2563eb;
  font-weight: 600;
  cursor: pointer;
  border-left: 1px solid #e2e8f0;
  padding-left: 15px;
  transition: 0.2s;
}

.btn-leer-mas:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

.modal-overlay {     /* modal (ventana emergente encima del contenido)*/
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);      /* efecto para que el fondo se vea desenfocado/borroso */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
  padding: 20px;
}

.modal-contenido {
  background: white;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  border-radius: 12px;
  position: relative;
  overflow-y: auto;
}

.btn-cerrar {
  position: absolute;
  top: 15px;
  right: 15px;
  background: white;
  border: none;
  font-size: 32px;
  color: #1e3a8a;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  cursor: pointer;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-img {
  width: 100%;
  height: 380px;
  object-fit: cover;
}

.modal-texto {
  padding: 40px;
}

.modal-tag {
  color: #00c8fa;
  font-weight: 800;
  font-size: 12px;
  letter-spacing: 1.5px;
}

.modal-texto h2 {
  font-size: 30px;
  color: #1e3a8a;
  margin: 15px 0;
  line-height: 1.3;
  font-weight: 800;
}

.modal-meta {
  color: #64748b;
  font-size: 15px;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.separador {
  border: 0;
  height: 1px;
  background: #e2e8f0;
  margin-bottom: 25px;
}

.cuerpo-noticia {
  font-size: 18px;
  line-height: 1.8;
  color: #334155;
  white-space: pre-line;
}

.animate-pop {
  animation: pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);     /* animaciones */
}

@media (max-width: 768px) {
  .grid-noticias {
    grid-template-columns: 1fr;
    padding: 20px 5%;
  }
  .modal-img {
    height: 250px;
  }
  .modal-texto {
    padding: 25px;
  }
  .modal-texto h2 {
    font-size: 22px;
  }
  .noticias-header {
    padding: 15px 5%;
  }
  .fila-encabezado {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  .banner-titulo {
    align-self: center;
  }
  .consola-noticias {
    flex-direction: column;
    height: auto;
    padding: 15px;
    border-radius: 20px;
    align-items: center;
  }
  .mini-escena-bus {
    margin-right: 0;
    margin-bottom: 10px;
  }
  .contenedor-typing {
    font-size: 1.2rem;
    text-align: center;
  }
}

.fila-encabezado {       /* alinea el encabezado "NOTICIAS" con contenedor del bus y efecto typing */
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
  margin-bottom: 30px;
}

.consola-noticias {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 50px;
  padding: 5px 20px;
  flex-grow: 1; 
  max-width: 1100px;
  height: 55px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.mini-escena-bus {       /* escena del bus (lado Izquierdo de la capsula) */
  position: relative;
  width: 130px; 
  height: 50px;
  background: transparent; 
  border-radius: 10px; 
  overflow: hidden;
  margin-right: 15px;
  flex-shrink: 0;
  display: flex;
  align-items: center;      /* centramos el bus verticalmente */
  justify-content: center; /* centramos el bus horizontalmente */
}

.carretera-infinita {
  position: absolute;
  bottom: 5px; 
  width: 100%;
  height: 2px;
  background-image: linear-gradient(to right, #cbd5e1 50%, transparent 50%);
  background-size: 20px 100%;
  animation: moverVia 0.4s linear infinite; /* duracion corta rapida para dar sensación de velocidad con el bus */
  z-index: 1;
}

.bus-animado-noticias {
  position: relative; 
  bottom: 0;
  left: 0;
  transform: none; 
  width: 100%; 
  height: auto; 
  z-index: 2;
  object-fit: contain;     /* asegura que no se deforme ni se corte */
  animation: vibrarBus 0.2s infinite alternate;
}

.contenedor-typing {     /* efecto de escritura en las noticias */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 1.6rem;
  color: #64748b;
  display: flex;
  overflow: hidden;
}

.texto-animado {
 white-space: nowrap;
  border-right: 3px solid #00c8fa;
  width: 0;
  overflow: hidden;
  animation: 
    typing-lento 12s steps(30, end) infinite,    /* velocidad de la escritura  */
    blink-caret 0.75s step-end infinite;
}

.texto-animado .resaltado {
  color: #004a87;
  font-weight: bold;
}

@keyframes moverVia {
  from { transform: translateX(0); }
  to { transform: translateX(-15px); }
}

@keyframes vibrarBus {
  from { transform: translate(-50%, 0); }
  to { transform: translate(-50%, -1px); }
}

@keyframes typing-lento {
  0% { width: 0; }
  20% { width: 100%; } 
  90% { width: 100%; } 
  100% { width: 0; }
}

@keyframes blink-caret {     /* hace que el seleccionador de texto tenga efecto dinamico*/
  from, to { border-color: transparent; }
  50% { border-color: #00c8fa; }
}
</style>