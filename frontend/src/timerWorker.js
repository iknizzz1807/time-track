let time = 0;
let intervalId;

onmessage = (e) => {
  const { action, payload } = e.data;

  if (action === "start") {
    time = payload.time || 0; // Khởi tạo với thời gian hiện tại nếu có.
    intervalId = setInterval(() => {
      time += 1;
      postMessage(time); // Gửi thời gian cập nhật về component chính.
    }, 1000);
  } else if (action === "pause" || action === "stop") {
    clearInterval(intervalId);
    if (action === "stop") time = 0; // Reset khi dừng.
  }
};
