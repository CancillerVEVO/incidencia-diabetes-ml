import * as tf from "@tensorflow/tfjs";
import { cleanData } from "../preprossecing";

const xs = cleanData.forEach((item) => item.x);
const ys = cleanData.forEach((item) => item.y);

const a = tf.variable(tf.scalar(Math.random()));
const b = tf.variable(tf.scalar(Math.random()));
const c = tf.variable(tf.scalar(Math.random()));

const f = (x) => {
  a.mul(x.square()).add(b.mul(x)).add(c);
};

const loss = (pred, label) => pred.sub(label).square().mean();

const learningRate = 0.01;
const optimizer = tf.train.sgd(learningRate);

// Train the model
for (let i = 0; i < 100; i++) {
  optimizer.minimize(() => loss(f(xs), ys));
}

// make the prediction
console.log(`a: ${a.dataSync()}, b: ${b.dataSync()}, c: ${c.dataSync()}`);
const preds = f(xs).dataSync;

const polynomial = preds.map((pred, index) => {
  return { x: xs[index], y: pred };
});

export default polynomial;
