const MenteQuest = {
  actividades: [
    "actividad01",
    "actividad02",
    "actividad03",
    "actividad04",
    "actividad05",
    "actividad06",
    "actividad07",
    "actividad08",
    "actividad09",
    "actividad10"
  ],

  obtenerXP() {
    return Number(localStorage.getItem("menteQuestXP")) || 0;
  },

  obtenerCompletadas() {
    try {
      const datos = JSON.parse(
        localStorage.getItem("menteQuestCompletadas")
      );

      return Array.isArray(datos) ? datos : [];
    } catch {
      return [];
    }
  },

  obtenerRango(xp) {
    if (xp >= 800) {
      return {
        nombre: "LEYENDA",
        siguiente: null,
        color: "#39ff88"
      };
    }

    if (xp >= 500) {
      return {
        nombre: "ÉLITE",
        siguiente: 800,
        color: "#39ff88"
      };
    }

    if (xp >= 200) {
      return {
        nombre: "EXPLORADOR",
        siguiente: 500,
        color: "#39ff88"
      };
    }

    return {
      nombre: "RECLUTA",
      siguiente: 200,
      color: "#39ff88"
    };
  },

  actualizarPantalla() {
    const xp = this.obtenerXP();
    const completadas = this.obtenerCompletadas();
    const rango = this.obtenerRango(xp);

    const elementoXP = document.getElementById("xp");

    if (elementoXP) {
      elementoXP.textContent = xp;
    }

    const elementoRango = document.getElementById("rango-jugador");

    if (elementoRango) {
      elementoRango.textContent = rango.nombre;
      elementoRango.style.color = rango.color;
    }

    const elementoSiguiente = document.getElementById("siguiente-rango");

    if (elementoSiguiente) {
      elementoSiguiente.textContent = rango.siguiente === null
        ? "Rango máximo alcanzado"
        : `Siguiente rango: ${rango.siguiente} XP`;
    }

    const barra = document.querySelector(".barra-progreso div");

    if (barra) {
      const progreso = (completadas.length / this.actividades.length) * 100;
      barra.style.width = `${progreso}%`;
    }

    const contador = document.getElementById("misiones-completadas");

    if (contador) {
      contador.textContent = `${completadas.length}/10`;
    }
  },

  completarActividad(id, puntos = 100) {
    if (!this.actividades.includes(id)) {
      console.warn("Actividad no reconocida:", id);
      return false;
    }

    const completadas = this.obtenerCompletadas();

    if (completadas.includes(id)) {
      return false;
    }

    completadas.push(id);

    const xpAnterior = this.obtenerXP();
    const xpNuevo = xpAnterior + Math.max(0, Number(puntos) || 0);

    localStorage.setItem(
      "menteQuestCompletadas",
      JSON.stringify(completadas)
    );

    localStorage.setItem("menteQuestXP", xpNuevo);

    this.actualizarPantalla();

    const rangoAnterior = this.obtenerRango(xpAnterior).nombre;
    const rangoNuevo = this.obtenerRango(xpNuevo).nombre;

    if (rangoNuevo !== rangoAnterior) {
      alert(`¡SUBISTE DE RANGO!\n\nAhora eres ${rangoNuevo}.\n¡Sigue completando misiones, explorador!`);
    }

    return true;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  MenteQuest.actualizarPantalla();
});

window.MenteQuest = MenteQuest; 
