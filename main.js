import * as tf from "@tensorflow/tfjs";
import { cleanData } from "./src/preprossecing";
import { generateChart } from "./src/graphs";
import { Chart } from "chart.js/auto";

/**
 * Mapa de colores para las gráficas.
 * @type {Map<string, string>}
 */
const colors = new Map();

// Agregar colores al Map
colors.set("rojo", "rgb(255, 0, 0)");
colors.set("verde", "rgb(0, 255, 0)");
colors.set("azul", "rgb(0, 0, 255)");
colors.set("amarillo", "rgb(255, 255, 0)");
colors.set("rosa", "rgb(255, 192, 203)");

const main = async () => {
  const xRaw = cleanData.map((item) => item.x);
  const yRaw = cleanData.map((item) => item.y);

  // Normalizar los datos
  const xMin = Math.min(...xRaw);
  const xMax = Math.max(...xRaw);
  const yMin = Math.min(...yRaw);
  const yMax = Math.max(...yRaw);

  const normalizedX = xRaw.map((x) => (x - xMin) / (xMax - xMin));
  const normalizedY = yRaw.map((y) => (y - yMin) / (yMax - yMin));

  const actualX = tf.tensor2d(xRaw, [xRaw.length, 1]);
  const actualY = tf.tensor2d(yRaw, [yRaw.length, 1]);

  // Convertir los datos normalizados a tensores
  const xs = tf.tensor2d(normalizedX, [normalizedX.length, 1]);
  const ys = tf.tensor2d(normalizedY, [normalizedY.length, 1]);

  const a = tf.variable(tf.scalar(Math.random()));
  const b = tf.variable(tf.scalar(Math.random()));
  const c = tf.variable(tf.scalar(Math.random()));
  const d = tf.variable(tf.scalar(Math.random()));
  const e = tf.variable(tf.scalar(Math.random()));

  const loss = (pred, label) => pred.sub(label).square().mean();
  const learningRate = 0.01;
  const optimizer = tf.train.sgd(learningRate);

  const predict = (x) => {
    return tf.tidy(() => {
      return a.mul(x.square()).add(b.mul(x)).add(c);
    });
  };

  // Entrenamiento del modelo
  const numEpochs = 200; // Número de iteraciones de entrenamiento
  for (let epoch = 0; epoch < numEpochs; epoch++) {
    optimizer.minimize(() => loss(predict(xs), ys));
  }

  // Predecir valores
  const xPredict = tf.tensor2d(
    Array.from(Array(100).keys()).map((x) => x / 100),
    [100, 1]
  );

  const yPredict = predict(xPredict);

  const normalizedData = [];
  normalizedX.forEach((value, index) => {
    normalizedData.push({ x: normalizedX[index], y: normalizedY[index] });
  });

  const predictionData = [];
  xPredict.dataSync().forEach((value, index) => {
    predictionData.push({
      x: xPredict.dataSync()[index],
      y: yPredict.dataSync()[index],
    });
  });
  const config = generateChart(
    [
      {
        color: colors.get("rojo"),
        label: "Datos de entrenamiento",
        data: normalizedData,
      },
      {
        color: colors.get("azul"),
        label: "Predicción",
        data: predictionData,
      },
    ],
    -1,
    1
  );

  const actualConfig = generateChart([
    {
      color: colors.get("rojo"),
      label: "Datos de entrenamiento",
      data: cleanData,
    },
    {
      color: colors.get("azul"),
      label: "Predicción",
      data: Array.from(yPredict.dataSync()).map((value, index) => {
        return { x: xRaw[index], y: value * (yMax - yMin) + yMin };
      }),
    },
  ]);

  new Chart(document.getElementById("normalized-plot"), config);
  new Chart(document.getElementById("actual-plot"), actualConfig);
};

main();
