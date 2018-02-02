function createUsageChart(context, data) {
  const chartData = _.transform(
    data.data,
    (result, data) => {
      // remove peak from used so it displays a total
      result.datasets[0].data.push(data.attributes.used - data.attributes.peak);
      result.datasets[1].data.push(data.attributes.peak);

      // const [year, month, day] = data.attributes.closing.split("-");
      // result.labels.push(new Date(year, month, day));
      result.labels.push(data.attributes.closing);
      return result;
    },
    {
      labels: [],
      datasets: [
        {
          label: "Used",
          data: []
        },
        {
          label: "Peak",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          data: []
        }
      ]
    }
  );

  return new Chart(context, {
    type: "bar",
    data: chartData,
    options: {
      title: {
        display: true,
        text: 'Energy Usage',
        fontSize: '18'
      },
      scales: {
        xAxes: [
          {
            stacked: true,
            // type: 'time',
            // time: {
            //   displayFormats: {
            //     unit: 'day',
	          //     day: 'll'
            //   }
            // }
          }
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  });
}

function createCostChart(context, data) {
  const chartData = _.transform(
    data.data,
    (result, data) => {
      result.labels.push(data.attributes.closing);
      // const [year, month, day] = data.attributes.closing.split("-");
      result.datasets[0].data.push({
        // x: new Date(year, month, day),
        x: data.attributes.closing,
        y: data.attributes.cost
      });
      return result;
    },
    {
      labels: [],
      datasets: [
        {
          // label: "Cost",
          backgroundColor: 'rgba(54, 162, 235, .3)',
          data: []
        }
      ]
    }
  );

  console.log(chartData);

  return new Chart(context, {
    type: "line",
    data: chartData,
    options: {
      title: {
        display: true,
        text: 'Cost',
        fontSize: '18'
      },
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          // type: 'time',
          // time: {
          //   displayFormats: {
          //     unit: 'month',
	        //     month: 'll'
          //   }
          // }
        }],
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", function(event) {
  fetch("/data.json")
    .then(resp => resp.json())
    .then(rawData => {

      // create the usage chart
      var usageChartContext = document
        .getElementById("usage-chart")
        .getContext("2d");
      createUsageChart(usageChartContext, rawData);

      // create the cost/billing chart
      var costChartContext = document
        .getElementById("cost-chart")
        .getContext("2d");
      createCostChart(costChartContext, rawData);
    })
    .catch(err => console.error(err));
});
