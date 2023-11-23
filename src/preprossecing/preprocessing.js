import { informesTrimestrales } from "../data";

// Paso 1. Calcular el porcentaje de la poblacion con servicios medicos con diabetes

const porcentajePoblacionDiabetes = informesTrimestrales.map((informe) => {
  return (informe.casosDeDiabetes / informe.afiliados) * 100;
});

// Paso 2. Calcular el porcentaje de la poblacion con servicios medicos con diabetes

const porcentajePoblacionObesidad = informesTrimestrales.map((informe) => {
  return (informe.casosDeObesidad / informe.afiliados) * 100;
});

// Paso 3. Calcular la proyeccion de afiliados con diabetes

const proyeccionAfiliadosDiabetes = porcentajePoblacionDiabetes.map(
  (porcentaje, index) => {
    return (porcentaje * informesTrimestrales[index].total) / 100;
  }
);

// Paso 4. Calcular la proyeccion de afiliados con obesidad

const proyeccionAfiliadosObesidad = porcentajePoblacionObesidad.map(
  (porcentaje, index) => {
    return (porcentaje * informesTrimestrales[index].total) / 100;
  }
);

// Paso 5. Calcular la incidencia de diabetes en la poblacion

const incidenciaDiabetes = proyeccionAfiliadosDiabetes.map(
  (proyeccion, index) => {
    return (proyeccion / proyeccionAfiliadosObesidad[index]) * 1000;
  }
);

// Graficamos (x: trimestre, y: incidencia diabetes)

/**
 * Represents a dataset with x and y values.
 * @typedef {Object} DataPoint
 * @property {number} x - The x-coordinate value.
 * @property {number} y - The y-coordinate value.
 */

/**
 * Represents a collection of data points for a chart.
 * @type {DataPoint[]}
 */
const cleanData = informesTrimestrales.map((informe, index) => {
  return {
    x: index + 1,
    y: incidenciaDiabetes[index],
  };
});

export default cleanData;
