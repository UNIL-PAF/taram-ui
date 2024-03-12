function renderDataPoints(api, color) {
  const xValue = api.value(0)

  const barLayout = api.barLayout({
    barGap: "30%",
    barCategoryGap: "100%",
    count: 1,
  });

  console.log(barLayout)

  const point = api.coord([xValue, api.value(1)]);

  const jitterOffset = api.value(2) * barLayout[0].bandWidth / 1.5;

  point[0] -= jitterOffset

  return {
    type: "circle",
    shape: {
      cx: point[0],
      cy: point[1],
      r: 1.5,
    },
    style: {
      fill: color,
      opacity: 0.2,
    },
    styleEmphasis: {
      fill: color,
      opacity: 0.9,
    },
  };
}

export default renderDataPoints;
