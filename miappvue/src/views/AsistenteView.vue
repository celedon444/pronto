<template>
  <div class="asistente-page">
    <section class="asistente-card">
      <header class="asistente-header">
        <h1>Asistente Pronto</h1>
        <p>
          Estoy aquí para ayudarte con rutas, paradas, buses, reportes y el uso de la
          aplicación.
        </p>
      </header>

      <div class="historial-chat">
        <div
          v-for="(mensaje, index) in mensajes"
          :key="index"
          :class="['mensaje', mensaje.role]"
        >
          <div class="mensaje-contenido">{{ mensaje.text }}</div>
        </div>
      </div>

      <form class="entrada-chat" @submit.prevent="enviarMensaje">
        <textarea
          v-model="inputMensaje"
          placeholder="Escribe tu pregunta aquí..."
          rows="3"
          autofocus
        ></textarea>
        <button type="submit" :disabled="!inputMensaje.trim() || cargando">
          {{ cargando ? 'Enviando...' : 'Enviar' }}
        </button>
      </form>
    </section>
  </div>
</template>

<script>
export default {
  name: 'AsistenteView',
  data() {
    return {
      inputMensaje: '',
      mensajes: [
        {
          role: 'assistant',
          text: 'Hola! Soy el asistente Pronto. Pregúntame sobre rutas, paradas, buses, reportes o cómo usar la app.'
        }
      ],
      cargando: false
    }
  },
  methods: {
    async enviarMensaje() {
      const texto = this.inputMensaje.trim()
      if (!texto) return

      this.mensajes.push({ role: 'user', text: texto })
      this.inputMensaje = ''
      this.cargando = true

      try {
        const baseUrl = process.env.VUE_APP_API_URL || 'http://localhost:3000'
        const response = await this.axios.post(`${baseUrl}/assistant`, {
          message: texto
        })
        const reply = response?.data?.reply || 'Lo siento, no obtuve una respuesta del asistente.'
        this.mensajes.push({ role: 'assistant', text: reply })
      } catch (error) {
        console.error(error)
        this.mensajes.push({
          role: 'assistant',
          text: 'Ocurrió un error al conectar con el servidor. Intenta nuevamente más tarde.'
        })
      } finally {
        this.cargando = false
      }
    }
  }
}
</script>

<style scoped>
.asistente-page {
  display: flex;
  justify-content: center;
  padding: 30px 20px;
}

.asistente-card {
  width: min(980px, 100%);
  background: white;
  border-radius: 24px;
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.12);
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.asistente-header h1 {
  margin: 0 0 8px;
  font-size: 2rem;
  color: #1e3a8a;
}

.asistente-header p {
  margin: 0;
  color: #334155;
  line-height: 1.6;
}

.historial-chat {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 520px;
  overflow-y: auto;
  padding-right: 8px;
}

.mensaje {
  display: flex;
}

.mensaje.user {
  justify-content: flex-end;
}

.mensaje.assistant {
  justify-content: flex-start;
}

.mensaje-contenido {
  max-width: 74%;
  background: #f1f5f9;
  color: #0f172a;
  padding: 14px 18px;
  border-radius: 22px;
  line-height: 1.6;
  word-break: break-word;
}

.mensaje.user .mensaje-contenido {
  background: #1e3a8a;
  color: white;
}

.entrada-chat {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: stretch;
  gap: 14px;
}

textarea {
  width: 100%;
  min-height: 80px;
  resize: vertical;
  border: 1px solid #cbd5e1;
  border-radius: 16px;
  padding: 16px;
  font-size: 1rem;
  line-height: 1.6;
  color: #0f172a;
  font-family: inherit;
}

button {
  width: 140px;
  border: none;
  border-radius: 16px;
  background: #1e3a8a;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

button:not(:disabled):hover {
  background: #0f2970;
}
</style>
