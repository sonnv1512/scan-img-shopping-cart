export const planetChartData = {
  type: 'pie',
  data: {
    labels: [
      'Chờ duyệt',
      'Từ chối',
      'Đã cấp'
    ],
    datasets: [
      {
        label: 'dsfsdfsd',
        // type: 'pie',
        data: [100, 150, 200],
        backgroundColor: [
          '#F39B13',
          '#FF4868',
          '#49D193'
        ],
        borderColor: '#36495d',
        borderWidth: 1
      }
      //   {
      //     label: 'Planetary Mass (relative to the Sun x 10^-6)',
      //     // type: 'bar',
      //     data: [0.166, 2.081, 3.003, 0.323, 954.792, 285.886, 43.662, 51.514],
      //     backgroundColor: 'rgba(71, 183,132,.5)',
      //     borderColor: '#47b784',
      //     borderWidth: 3
      //   }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Chart.js Pie Chart'
      },
      tooltip: {
        enabled: false
      },
      subtitle: {
        display: false,
        text: 'Custom Chart Subtitle'
      }
    }
  }
}

export default planetChartData
