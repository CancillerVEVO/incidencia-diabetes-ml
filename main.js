import { Chart } from "chart.js/auto";
import regression from "regression";
import csv from "csvtojson";
import { processJson } from "./src/preprossecing";
import { generateChart } from "./src/graphs";
const fileInput = document.getElementById("file-input");
const fileButton = document.getElementById("file-button");
const plotContainer = document.getElementById("plot-container");
const predictionContainer = document.getElementById("prediction-container");

let cache = null;

fileButton.addEventListener("click", (event) => {
  event.preventDefault();

  // Aqui se lee el archivo
  if (fileInput.files.length === 0) {
    return;
  }

  const file = fileInput.files[0];

  const reader = new FileReader();

  reader.readAsText(file);

  reader.onload = async function (e) {
    const csvString = e.target.result;

    const json = await csv({
      colParser: {
        trimestre: "number",
        año: "number",
        casosDeObesidad: "number",
        casosDeDiabetes: "number",
        afiliados: "number",
        total: "number",
      },
    }).fromString(csvString);

    console.log(json);

    const datosPreparadosParaGraficar = processJson(json);

    console.log(datosPreparadosParaGraficar);

    const graficaOriginal = generateChart(
      [
        {
          label: "Incidencia de diabetes",
          data: datosPreparadosParaGraficar,
          color: "rgba(255, 99, 132, 1)",
        },
      ],
      -1000,
      3000
    );

    if (plotContainer.hasChildNodes()) {
      plotContainer.removeChild(plotContainer.firstChild);
      const canvas = document.createElement("canvas");
      canvas.id = "actual-plot";
      plotContainer.appendChild(canvas);
    }

    new Chart(document.getElementById("actual-plot"), graficaOriginal);

    // Tienes que preparar los datos para meterlos en la funcion de regresion
    const datosPreparadosParaRegresion = datosPreparadosParaGraficar.map(
      (item) => [item.x, item.y]
    );

    // Se llama la funcion de regresion
    const resultadoRegresion = regression.polynomial(
      datosPreparadosParaRegresion,
      {
        order: 4,
        precision: 5,
      }
    );

    console.log(`Resultado: `, resultadoRegresion);

    const modelo = resultadoRegresion;

    console.log(`El modelo es: `, modelo);

    const a = modelo.equation[0];
    const b = modelo.equation[1];
    const c = modelo.equation[2];
    const d = modelo.equation[3];
    const f = modelo.equation[4];

    const predict = (x) => {
      return a * x ** 4 + b * x ** 3 + c * x ** 2 + d * x + f;
    };

    console.log(
      `La incidencia del siguiente trimestre es: ${predict(
        datosPreparadosParaGraficar.length + 1
      )}`
    );

    // Formateas los datos para graficar
    const datosDelAlgoritmoFormateadosParaGraficar = modelo.points.map(
      (item) => {
        return { x: item[0], y: item[1] };
      }
    );

    const prediccion200 = Array.from(
      { length: datosPreparadosParaGraficar.length + 2 },
      (_, i) => {
        return { x: i + 1, y: predict(i + 1) };
      }
    );

    const mse = datosPreparadosParaRegresion.reduce((acc, item) => {
      return acc + (item[1] - predict(item[0])) ** 2;
    }, 0);

    const rmse = Math.sqrt(mse / datosPreparadosParaRegresion.length);

    console.log(`La raiz del error cuadratico medio es: ${rmse}`);

    const predictChart = generateChart([
      {
        label: "Prediccion de diabetes",
        data: datosDelAlgoritmoFormateadosParaGraficar,
        color: "rgba(54, 162, 235, 1)",
      },
      {
        label: "Incidencia de diabetes",
        data: datosPreparadosParaGraficar,
        color: "rgba(255, 99, 132, 1)",
      },
      {
        label: "Prediccion de diabetes 200 trimestres",
        data: prediccion200,
        color: "rgba(75, 192, 192, 1)",
      },
    ]);

    if (predictionContainer.hasChildNodes()) {
      predictionContainer.removeChild(predictionContainer.firstChild);
      const canvas = document.createElement("canvas");
      canvas.id = "prediction-plot";
      predictionContainer.appendChild(canvas);
    }

    new Chart(document.getElementById("prediction-plot"), predictChart);

    console.log(`La incidencia del siguiente trimestre es ${predict(36)}`);

    console.log(`La funcion de regresion es: ${modelo.string}`);
  };
});
