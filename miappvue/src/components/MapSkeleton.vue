<template>
  <div class="skeleton-wrapper">
    <div class="skeleton-titulo"></div>

    <div class="skeleton-buscador"></div>

    <div class="skeleton-stats">
      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>
    </div>

    <div class="skeleton-map"></div>
  </div>
</template>

<style scoped>
.skeleton-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.skeleton-titulo, .skeleton-card, .skeleton-map, .skeleton-buscador {
  background: linear-gradient(90deg, #161f31 25%, #1e293b 50%, #161f31 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite linear;
}

.skeleton-titulo {
  width: 250px;
  height: 40px;
  border-radius: 100px;
  margin-top: 10px;
  margin-bottom: 25px;
}

.skeleton-buscador {
  width: 450px;
  height: 45px;
  border-radius: 18px;
  margin-bottom: 20px;
}

.skeleton-stats {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
}

.skeleton-card {
  width: 240px;
  height: 130px;
  border-radius: 16px;
}

.skeleton-map {
  width: 90%;
  height: 520px;
  border-radius: 20px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>