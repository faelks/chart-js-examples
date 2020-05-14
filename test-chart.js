import boralProfitabilityData from "./boralProfitabilityData.js";
import boralLiquiditiyData from "./boralLiquidityData.js";
import boralAssetTurnoverData from "./boralAssetTurnoverData.js";

var profitabilityChartCtx = document
  .getElementById("profitability-chart")
  .getContext("2d");
var liquidityChartCtx = document
  .getElementById("liquidity-chart")
  .getContext("2d");
var assetTurnoverChartCtx = document
  .getElementById("asset-turnover-chart")
  .getContext("2d");
var profitabilityChartTitle = "Borals' Drivers of Profitability";
var liquidityChartTitle = "Borals' Liquidity Ratios";
var assetTurnoverChartTitle = "Borals' Asset Turnover";
var fillOpacity = 0.9;
var boralYellow = [253, 222, 8]; //rgba(253, 222, 8)
var boralGreen = [28, 169, 78]; //rgba(28, 169, 78)
var boralBlack = [15, 15, 15]; //rgba(15, 15, 15)
var boralGray = [100, 100, 100]; //rgba(100,100,100)

// Process data sources
var {
  year: years,
  revenue,
  otherIncome,
  interestIncome,
  costOfSales,
  sellingAndDistributionExpenses,
  administrativeExpenses,
  otherExpenses,
  netOperatingProfitBeforeTax,
} = processData(boralProfitabilityData);
var {
  currentRatio,
  quickRatio,
  cashRatio,
  operatingCashFlowRatio,
} = processData(boralLiquiditiyData);
var {
  assetTurnover,
  inventories,
  employeeBenefitLiabilities,
  netOperatingAssets,
} = processData(boralAssetTurnoverData);

// Data transformation / apply formulas
let sales = revenue.map((r, i) => r + otherIncome[i] + interestIncome[i]);
let operatingExpenses = costOfSales.map(
  (c, i) =>
    c +
    sellingAndDistributionExpenses[i] +
    administrativeExpenses[i] +
    otherExpenses[i]
);
let grossProfit = revenue.map((r, i) => r - costOfSales[i]);
let grossProfitMargin = grossProfit.map((g, i) => g / revenue[i]);
let operatingExpensesOverSales = operatingExpenses.map((o, i) => o / sales[i]);

// Define graph datasets
var profitabilityDatasets = [
  {
    type: "line",
    label: "Gross Profit Margin",
    data: grossProfitMargin,
    borderColor: `rgba(${boralYellow.join(",")})`,
    fill: false,
    borderWidth: 2,
    yAxisID: "percentageValueAxis",
  },
  {
    type: "line",
    label: "Operating Expenses Over Sales",
    data: operatingExpensesOverSales,
    borderColor: `rgba(${boralGreen.join(",")})`,
    fill: false,
    borderWidth: 2,
    yAxisID: "percentageValueAxis",
  },
  {
    type: "bar",
    label: "Sales",
    data: sales,
    backgroundColor: `rgba(${boralGray.join(",")}, ${fillOpacity})`,
    borderColor: `rgba(${boralGray.join(",")})`,
    borderWidth: 1,
    yAxisID: "dollarValueAxis",
  },
  {
    type: "bar",
    label: "Operating Expenses",
    data: operatingExpenses,
    backgroundColor: `rgba(${boralGreen.join(",")}, ${fillOpacity})`,
    borderColor: `rgba(${boralGreen.join(",")})`,
    borderWidth: 1,
    yAxisID: "dollarValueAxis",
  },
  {
    type: "bar",
    label: "Gross Profit",
    data: grossProfit,
    backgroundColor: `rgba(${boralYellow.join(",")}, ${fillOpacity})`,
    borderColor: `rgba(${boralYellow.join(",")})`,
    borderWidth: 1,
    yAxisID: "dollarValueAxis",
  },

  {
    type: "bar",
    label: "Net Operating Profit before Tax",
    data: netOperatingProfitBeforeTax,
    backgroundColor: `rgba(${boralBlack.join(",")}, ${fillOpacity})`,
    borderColor: `rgba(${boralBlack.join(",")})`,
    borderWidth: 1,
    yAxisID: "dollarValueAxis",
  },
];

var liquidityDatasets = [
  {
    type: "line",
    pointStyle: "circle",
    label: "Current Ratio",
    data: currentRatio,
    fill: false,
    borderColor: `rgba(${boralGreen.join(",")})`,
    backgroundColor: `rgba(${boralGreen.join(",")})`,
    radius: 6,
    yAxisID: "pointValueAxis",
  },
  {
    type: "line",
    pointStyle: "triangle",
    label: "Quick Ratio",
    data: quickRatio,
    borderColor: `rgba(${boralYellow.join(",")})`,
    backgroundColor: `rgba(${boralYellow.join(",")})`,
    fill: false,
    radius: 6,
    yAxisID: "pointValueAxis",
  },
  {
    type: "line",
    pointStyle: "crossRot",
    label: "Cash Ratio",
    data: cashRatio,
    borderColor: `rgba(${boralBlack.join(",")})`,
    backgroundColor: `rgba(${boralBlack.join(",")})`,
    fill: false,
    radius: 6,
    yAxisID: "pointValueAxis",
  },
  {
    type: "line",
    pointStyle: "star",
    label: "Operating Cash Flow Ratio",
    data: operatingCashFlowRatio,
    fill: false,
    borderColor: `rgba(${boralGray.join(",")})`,
    backgroundColor: `rgba(${boralGray.join(",")})`,
    radius: 6,
    yAxisID: "pointValueAxis",
  },
  {
    type: "bar",
    label: "Sales",
    barThickness: 75,
    data: sales,
    backgroundColor: `rgba(${boralGray.join(",")}, 0.3)`,
    borderColor: `rgba(${boralGray.join(",")})`,
    borderWidth: 1,
    yAxisID: "dollarValueAxis",
  },
];

var assetTurnoverDatasets = [
  {
    type: "line",
    label: "Asset Turnover",
    data: assetTurnover,
    backgroundColor: `rgba(${boralGreen.join(",")}, 0.8)`,
    borderColor: `rgba(${boralGreen.join(",")})`,
    fill: false,
    borderWidth: 3,
    order: 1,
    yAxisID: "pointValueAxis",
  },
  {
    type: "bar",
    label: "Sales",
    data: sales,
    barThickness: 50,
    backgroundColor: `rgba(${boralYellow.join(",")}, 0.55)`,
    borderColor: `rgba(${boralYellow.join(",")}, 1)`,
    borderWidth: 1,
    order: 2,
    yAxisID: "dollarValueAxis",
  },
  {
    type: "bar",
    label: "Net Operating Assets",
    data: netOperatingAssets,
    barThickness: 50,
    backgroundColor: `rgba(${boralGray.join(",")}, 0.55)`,
    borderColor: `rgba(${boralGray.join(",")}, 1)`,
    borderWidth: 1,
    order: 2,
    yAxisID: "dollarValueAxis",
  },
];

// Define graphs
var profitabilityChart = new Chart(profitabilityChartCtx, {
  chartTitle: profitabilityChartTitle,
  type: "bar",
  data: {
    labels: years,
    datasets: profitabilityDatasets,
  },
  options: {
    title: {
      display: true,
      text: profitabilityChartTitle,
      fontSize: 14,
    },
    legend: {
      display: true,
      position: "bottom",
      labels: {
        fontColor: "rgb(40, 40, 40)",
      },
    },
    scales: {
      yAxes: [
        {
          id: "dollarValueAxis",
          scaleLabel: {
            labelString: "Amount in mil. $AUD",
            display: true,
          },
          position: "left",
          ticks: {
            beginAtZero: true,
            suggestedMax: 8000,
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return "$" + value;
            },
          },
        },
        {
          id: "percentageValueAxis",
          position: "right",
          scaleLabel: {
            labelString: "Percentage Value",
            display: true,
          },
          ticks: {
            suggestedMax: 1,
            suggestedMin: 0,
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return value * 100 + "%";
            },
          },
        },
      ],
    },
  },
});

var liquidityChart = new Chart(liquidityChartCtx, {
  chartTitle: liquidityChartTitle,
  type: "line",
  data: {
    labels: years,
    datasets: liquidityDatasets,
  },
  options: {
    title: {
      display: true,
      text: liquidityChartTitle,
      fontSize: 14,
    },
    legend: {
      display: true,
      position: "bottom",
      labels: {
        usePointStyle: true,
        fontColor: "rgb(40, 40, 40)",
      },
    },
    scales: {
      yAxes: [
        {
          id: "dollarValueAxis",
          scaleLabel: {
            labelString: "Amount in mil. $AUD",
            display: true,
          },
          position: "right",
          ticks: {
            beginAtZero: true,
            suggestedMax: 8000,
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return "$" + value;
            },
          },
        },
        {
          id: "pointValueAxis",
          position: "left",
          scaleLabel: {
            labelString: "Ratio Value",
            display: true,
          },
          ticks: {
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return value + "x";
            },
          },
        },
      ],
    },
  },
});

var assetTurnoverChart = new Chart(assetTurnoverChartCtx, {
  chartTitle: assetTurnoverChartTitle,
  type: "bar",
  data: {
    labels: years,
    datasets: assetTurnoverDatasets,
  },
  options: {
    title: {
      display: true,
      text: assetTurnoverChartTitle,
      fontSize: 14,
    },
    legend: {
      display: true,
      position: "bottom",
      labels: {
        usePointStyle: true,
        fontColor: "rgb(40, 40, 40)",
      },
    },
    scales: {
      yAxes: [
        {
          id: "dollarValueAxis",
          scaleLabel: {
            labelString: "Amount in mil. $AUD",
            display: true,
          },
          position: "right",
          ticks: {
            beginAtZero: true,
            suggestedMax: 8000,
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return "$" + value;
            },
          },
        },
        {
          id: "pointValueAxis",
          position: "left",
          scaleLabel: {
            labelString: "Ratio Value",
            display: true,
          },
          ticks: {
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return value + "x";
            },
          },
        },
      ],
    },
  },
});

function processProfitabilityData(yearData) {
  var result = {
    years: [],
    sales: [],
    operatingExpenses: [],
    netOperatingProfitBeforeTax: [],
    grossProfit: [],
    grossProfitMargin: [],
    operatingExpensesOverSales: [],
  };
  for (let data of yearData) {
    let {
      year,
      revenue,
      otherIncome,
      interestIncome,
      costOfSales,
      sellingAndDistributionExpenses,
      administrativeExpenses,
      otherExpenses,
      netOperatingProfitBeforeTax,
    } = data;

    result.years.push(year);
    result.sales.push(sales);
    result.operatingExpenses.push(operatingExpenses);
    result.netOperatingProfitBeforeTax.push(netOperatingProfitBeforeTax);
    result.grossProfit.push(grossProfit);
    result.grossProfitMargin.push(grossProfitMargin);
    result.operatingExpensesOverSales.push(operatingExpensesOverSales);
  }

  return result;
}

// Util
function processData(yearsData) {
  let result = {};
  for (let yearData of yearsData) {
    for (let [dataName, value] of Object.entries(yearData)) {
      if (!result[dataName]) {
        result[dataName] = [];
      }
      result[dataName].push(value);
    }
  }
  return result;
}
