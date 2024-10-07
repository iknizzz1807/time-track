import { onCleanup, onMount } from "solid-js";
import Chart from "chart.js/auto";
import { createSignal } from "solid-js";

const LineChart = () => {
  let canvasRef;
  const [datasets, setDatasets] = createSignal([]); // Dữ liệu cho các đường biểu đồ

  // Hàm format lại ngày giờ (từ timestamp) thành định dạng ngắn gọn
  const formatDateTime = (rawDate) => {
    const date = new Date(rawDate);
    return date.toLocaleDateString("vi-VN"); // Format thành 'ngày/tháng/năm'
  };

  onMount(async () => {
    try {
      // Fetch API từ Go Fiber
      const response = await fetch("http://localhost:8080/tracks");
      const tracks = await response.json();

      // Nhóm dữ liệu theo ngày và loại activity
      const groupedData = {};
      tracks.forEach((track) => {
        const date = formatDateTime(track.date);
        const timeInMinutes = (track.time / 60).toFixed(2); // Chuyển đổi thời gian từ giây sang phút và làm tròn đến 2 chữ số thập phân
        const activityName = track.name;

        // Nếu chưa có ngày trong groupedData, khởi tạo
        if (!groupedData[date]) {
          groupedData[date] = {};
        }

        // Nếu chưa có activity trong ngày, khởi tạo
        if (!groupedData[date][activityName]) {
          groupedData[date][activityName] = 0; // Khởi tạo tổng thời gian
        }

        // Cộng dồn thời gian cho activity trong ngày
        groupedData[date][activityName] += parseFloat(timeInMinutes); // Cộng dồn với giá trị đã được làm tròn
      });

      // Chuyển đổi dữ liệu thành dạng phù hợp cho biểu đồ
      const datasetsArray = [];
      const labels = Object.keys(groupedData); // Nhãn trục X (ngày)

      // Tạo dataset cho từng activity
      for (const date in groupedData) {
        for (const activity in groupedData[date]) {
          // Kiểm tra xem dataset đã tồn tại chưa
          let dataset = datasetsArray.find((d) => d.label === activity);
          if (!dataset) {
            dataset = {
              label: activity,
              data: [],
              borderColor: getRandomColor(), // Chỉ định màu cho đường biểu đồ
              borderWidth: 2, // Độ dày của đường biểu đồ
            };
            datasetsArray.push(dataset);
          }
          // Thêm dữ liệu cho activity
          dataset.data.push({ x: date, y: groupedData[date][activity] });
        }
      }

      setDatasets(datasetsArray);

      // Tạo biểu đồ
      const chart = new Chart(canvasRef, {
        type: "line",
        data: {
          datasets: datasetsArray.map((dataset) => ({
            label: dataset.label,
            data: dataset.data,
            borderColor: dataset.borderColor,
            borderWidth: dataset.borderWidth,
            fill: false, // Không có màu nền
            pointRadius: 5, // Kích thước điểm
          })),
        },
        options: {
          scales: {
            x: {
              type: "category", // Sử dụng loại category cho trục X
              ticks: {
                autoSkip: true,
                maxTicksLimit: 5, // Chỉ hiển thị 5 mốc thời gian
              },
            },
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  const time = tooltipItem.raw.y.toFixed(2); // Lấy dữ liệu thô (thời gian) và làm tròn đến 2 chữ số thập phân
                  const date = tooltipItem.raw.x; // Lấy ngày tương ứng
                  const activity = tooltipItem.dataset.label; // Lấy tên activity
                  return `${activity} - ${date}: ${time} phút`; // Hiển thị hoạt động, ngày và thời gian khi hover
                },
              },
            },
          },
        },
      });

      // Dọn dẹp biểu đồ khi component bị unmount
      onCleanup(() => {
        chart.destroy();
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });

  // Hàm để lấy màu sắc ngẫu nhiên cho đường biểu đồ
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return <canvas ref={canvasRef}></canvas>; // Canvas chứa biểu đồ
};

export default LineChart;
