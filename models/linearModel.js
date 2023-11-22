import * as tf from "@tensorflow/tfjs";
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

/**
 * Creates a simple linear regression model.
 * @returns {tf.Sequential} - The linear regression model.
 * @see {@link https://js.tensorflow.org/api/latest/#sequential}
 * @see {@link https://js.tensorflow.org/api/latest/#layers.dense}
 * @see {@link https://js.tensorflow.org/api/latest/#compile}
 * @see {@link https://js.tensorflow.org/api/latest/#losses}
 * @see {@link https://js.tensorflow.org/api/latest/#optimizers}
 */
const createModel = () => {
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
  model.compile({ loss: "meanSquaredError", optimizer: "sgd" });
  return model;
};

/**
 * Generates training data from an array of data points.
 * @param {DataPoint[]} data - The array of data points.
 * @returns {{ xs: tf.Tensor2D, ys: tf.Tensor2D }} - The training data with input tensor (xs) and output tensor (ys).
 */
const generateTrainingData = (data) => {
  const xs = tf.tensor2d(
    data.map((item) => item.x),
    [data.length, 1]
  );
  const ys = tf.tensor2d(
    data.map((item) => item.y),
    [data.length, 1]
  );
  return { xs, ys };
};

/**
 * Trains a model using the provided training data.
 * @param {tf.Sequential} model - The model to train.
 * @param {tf.Tensor2D} xs - The input tensor.
 * @param {tf.Tensor2D} ys - The output tensor.
 */
const trainModel = async (model, xs, ys) => {
  await model.fit(xs, ys, { epochs: 250 });
};

/**
 * Predicts y values using a trained model.
 * @param {tf.Sequential} model - The trained model.
 * @param {number[]} xValues - The x values to predict.
 * @returns {DataPoint[]} - The predicted data points.
 */
const predict = (model, xValues) => {
  const predictionData = [];
  const xPredict = tf.tensor2d(xValues, [xValues.length, 1]);
  const yPredict = model.predict(xPredict);
  const values = Array.from(yPredict.dataSync());

  values.forEach((value, index) => {
    predictionData.push({ x: xValues[index], y: value });
  });

  return predictionData;
};

export { createModel, generateTrainingData, trainModel, predict };
