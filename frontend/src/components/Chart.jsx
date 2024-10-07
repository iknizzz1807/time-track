import { onMount, onCleanup } from "solid-js";
import Chart from "chart.js/auto";

const LineChart = (props) => {
  let canvasRef;
  onMount(() => {
    const chart = new Chart(canvasRef, {
      type: "line", // Loại biểu đồ
      data: {
        labels: props.labels, // Nhãn trên trục X (ví dụ: ngày tháng)
        datasets: [
          {
            label: "Session Time",
            data: props.sessionData, // Dữ liệu từng phiên track
            borderColor: "rgba(75, 192, 192, 1)", // Màu của đường biểu đồ
            fill: false,
          },
          {
            label: "Cumulative Time",
            data: props.cumulativeData, // Dữ liệu tổng thời gian track
            borderColor: "rgba(153, 102, 255, 1)", // Màu khác cho đường thứ hai
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            type: props.useLogScale ? "logarithmic" : "linear", // Use scale log or not
          },
        },
      },
    });
    onCleanup(() => {
      chart.destroy();
    });
  });
  return <canvas ref={canvasRef}></canvas>; // Canvas để chứa biểu đồ
};

export default LineChart;
