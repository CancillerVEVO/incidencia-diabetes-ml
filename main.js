import { renderChart } from "./graph";
import {
  createModel,
  generateTrainingData,
  predict,
  trainModel,
} from "./models/linearModel";
import {
  createPolynomialModel,
  generateTrainingDataPolynomial,
  predictPolynomial,
  trainModelPolynomial,
} from "./models/polynomialModel";

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
const data = [
  { x: 1, y: 5.58250205911961 },
  { x: 2, y: 8.552583895049647 },
  { x: 3, y: 24.260197280725137 },
  { x: 4, y: 45.80152671755726 },
  { x: 5, y: 13.089272931792618 },
  { x: 6, y: 20.326784672242756 },
  { x: 7, y: 26.65615141955836 },
];

const main = async () => {
  // Linear Regression model
  const model = createModel();
  const { xs, ys } = generateTrainingData(data);

  await trainModel(model, xs, ys);

  const xValues = Array.from(Array(30).keys());
  const prediction = predict(model, xValues);

  // Polynomial Regression model
  const polynomialModel = createPolynomialModel();
  const { xs: xsPoly, ys: ysPoly } = generateTrainingDataPolynomial(data);

  await trainModelPolynomial(polynomialModel, xsPoly, ysPoly);

  const xValuesPoly = Array.from(Array(30).keys());

  const predictionPoly = predictPolynomial(polynomialModel, xValuesPoly);

  // Render the scatter plot

  const polynomialDataSet = {
    datasets: [
      {
        label: "Data",
        data,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Polynomial Regression",
        data: predictionPoly,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  const polynomialConfig = {
    type: "scatter",
    data: polynomialDataSet,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Con un polinomio de grado 2",
        },
      },
    },
  };

  const linearDataSet = {
    datasets: [
      {
        label: "Data",
        data,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Linear Regression",
        data: prediction,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  const linearConfig = {
    type: "scatter",
    data: linearDataSet,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Con una recta",
        },
      },
    },
  };

  renderChart("polynomial-plot", polynomialConfig);
  renderChart("linear-plot", linearConfig);
};

main();
