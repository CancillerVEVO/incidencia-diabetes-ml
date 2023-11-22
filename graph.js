import { Chart } from "chart.js/auto";

const renderChart = (chartId, chartConfig) => {
  new Chart(document.getElementById(chartId), chartConfig);
};

export { renderChart };
