<template>
  <div>
    <AppNavbar/>
    <router-view />
    <AppFooter/>
  </div>
</template>

<script>
import AppNavbar from './components/Navbar.vue'
import AppFooter from './components/AppFooter.vue'

export default {
  components: {
    AppNavbar,
    AppFooter
  }
}

</script>


<style>
.p-toast{
    top: 120px !important;  /*ajustar altura del alert*/
    font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.p-toast-detail {
    color:white !important;  /* color de la descripcion*/
}

.p-toast .p-toast-message.p-toast-message-warn {  /* alerta de advertencia  */
  background: #a8820565  !important; 
}

.p-toast .p-toast-message.p-toast-message-error {  /* alerta de error */
  background: #55040b67 !important; 
}

.p-toast .p-toast-message.p-toast-message-success {  /* alerta de exito */
  background: #04520471 !important;
}

.p-toast .p-toast-message.p-toast-message-info {  /* alerta de informacion */
  background: #052e867a !important; 
}

@media (max-width: 768px) {
  .p-toast {
    top: 20px !important;
    width: 90% !important;
    left: 5% !important;
    right: 5% !important;
  }
}
</style>