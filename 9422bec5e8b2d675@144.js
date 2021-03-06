// https://observablehq.com/@d3/streamgraph-transitions@144
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Streamgraph Transitions

See also a more practical [static streamgraph](/@d3/streamgraph).`
)});
  main.variable(observer("viewof offset")).define("viewof offset", ["d3","html"], function(d3,html)
{
  const options = [
    {name: "d3.stackOffsetExpand", value: d3.stackOffsetExpand},
    {name: "d3.stackOffsetNone", value: d3.stackOffsetNone},
    {name: "d3.stackOffsetSilhouette", value: d3.stackOffsetSilhouette},
    {name: "d3.stackOffsetWiggle", value: d3.stackOffsetWiggle, selected: true}
  ];
  const form = html`<form style="display: flex; align-items: center; min-height: 33px;"><select name=i>${options.map(o => Object.assign(html`<option>`, {textContent: o.name, selected: o.selected}))}`;
  form.i.onchange = () => form.dispatchEvent(new CustomEvent("input"));
  form.oninput = () => form.value = options[form.i.selectedIndex].value;
  form.oninput();
  return form;
}
);
  main.variable(observer("offset")).define("offset", ["Generators", "viewof offset"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["d3","width","height","randomize","area","z"], async function*(d3,width,height,randomize,area,z)
{
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  const path = svg.selectAll("path")
    .data(randomize)
    .join("path")
      .attr("d", area)
      .attr("fill", () => z(Math.random()));

  while (true) {
    yield svg.node();

    await path
      .data(randomize)
      .transition()
        .delay(1000)
        .duration(1500)
        .attr("d", area)
      .end();
  }
}
);
  main.variable(observer("x")).define("x", ["d3","m","width"], function(d3,m,width){return(
d3.scaleLinear([0, m - 1], [0, width])
)});
  main.variable(observer("y")).define("y", ["d3","height"], function(d3,height){return(
d3.scaleLinear([0, 1], [height, 0])
)});
  main.variable(observer("z")).define("z", ["d3"], function(d3){return(
d3.interpolateCool
)});
  main.variable(observer("area")).define("area", ["d3","x","y"], function(d3,x,y){return(
d3.area()
    .x((d, i) => x(i))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]))
)});
  main.variable(observer("stack")).define("stack", ["d3","n","offset"], function(d3,n,offset){return(
d3.stack()
    .keys(d3.range(n))
    .offset(offset)
    .order(d3.stackOrderNone)
)});
  main.variable(observer("height")).define("height", function(){return(
500
)});
  main.variable(observer("n")).define("n", function(){return(
20
)});
  main.variable(observer("m")).define("m", function(){return(
200
)});
  main.variable(observer("k")).define("k", function(){return(
10
)});
  main.variable(observer("randomize")).define("randomize", ["stack","d3","n","bumps","m","k","y"], function(stack,d3,n,bumps,m,k,y){return(
function randomize() {
  const layers = stack(d3.transpose(Array.from({length: n}, () => bumps(m, k))));
  y.domain([
    d3.min(layers, l => d3.min(l, d => d[0])),
    d3.max(layers, l => d3.max(l, d => d[1]))
  ]);
  return layers;
}
)});
  main.variable(observer("bumps")).define("bumps", function()
{
  // Inspired by Lee Byron’s test data generator.
  function bump(a, n) {
    const x = 1 / (0.1 + Math.random());
    const y = 2 * Math.random() - 0.5;
    const z = 10 / (0.1 + Math.random());
    for (let i = 0; i < n; ++i) {
      const w = (i / n - y) * z;
      a[i] += x * Math.exp(-w * w);
    }
  }
  return function bumps(n, m) {
    const a = [];
    for (let i = 0; i < n; ++i) a[i] = 0;
    for (let i = 0; i < m; ++i) bump(a, n);
    return a;
  };
}
);
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6")
)});
  return main;
}
