const text = document.getElementById('data');
const title = document.querySelector(".title");

Chart.defaults.animation.easing = 'easeOutExpo';
Chart.defaults.animation.duration = 0;

function render() {
    window.recoil?.destroy();
    let data = converters.toPoints(pattern);
    var options = {
        type: 'scatter',
        data: {
            datasets: [{
                data: data,
                backgroundColor: gradient,
                borderColor: gradient,
                lineTension: 0.3,
                borderWidth: 2.5,
                pointRadius: 3,
                pointHitRadius: 10,
                showLine: true,
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                x: {
                    min: -150,
                    max: 150,
                    ticks: { stepSize: 5, },
                },
                y: {
                    // min: -170,
                    max: 0,
                    ticks: { stepSize: 5, },
                    offset: true,
    
                }
            },
            plugins: {
                legend: { display: false },
                dragData: {
                    round: 1,
                    dragX: true,
                    showTooltip: true,
                    onDragEnd: () => update(converters.toPattern(recoil.data.datasets[0].data)),
                }
            }
        }
    }
    var ctx = document.getElementById('chart').getContext('2d');
    window.recoil = new Chart(ctx, options);
}

function update(data) {
    text.value = data;
    pattern = `${data}`;
}

function gradient(context) {
    const chart = context.chart;
    const { ctx, chartArea } = chart;
    if (!chartArea) { return; }

    let gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, 'rgb(255, 99, 132)');
    gradient.addColorStop(0.5, 'rgb(255, 205, 86)');
    gradient.addColorStop(1, 'rgb(54, 162, 235)');

    return gradient;
}

let converters = {
    toPoints: (pattern) => pattern
        .split("\n")
        .filter(row => row.length > 0)
        .map(row => row.split(",").slice(0, 2).map(el => +el))
        .reduce((acc, offset) => {
            let last = acc.at(-1) || [0, 0];
            let next = [last[0] + offset[0], last[1] + offset[1]]
            acc.push(next);
            return acc;
        }, [])
        .map(([x, y]) => { return { x, y } })
        .map(p => { return { x: p.x, y: -p.y }; }),
    toPattern: (points) => {
        let timings = pattern.split("\n").filter(row => row.length > 0).map(row => row.split(",").at(-1)).map(el => +el);
        let offsets = points.map(p => { return { x: p.x, y: -p.y }; })
        let out = [];
        for (let i = 1; i < offsets.length; i++) {
            const prev = offsets[i - 1];
            const current = offsets[i];
            out.push({
                x: current.x - prev.x,
                y: current.y - prev.y,
                t: timings[i]
            });   
        }

        out =  [{x: 0, y: 0, t: 0}].concat(out);
            
        return out
            .map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)},${p.t.toFixed(0)}`)
            .join("\n");
    }
}

const dropArea = document.querySelector('.drop-area');

dropArea.addEventListener('dragover', (event) => {
  event.stopPropagation();
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
});

dropArea.addEventListener('drop', (event) => {
  event.stopPropagation();
  event.preventDefault();
  const files = event.dataTransfer.files;
  readPattern(files[0]);
});

function readPattern(file) {
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        title.innerText = "apx: " + file.name;
        update("0,0,0\n" + event.target.result);
        render();
    });
    reader.readAsText(file);
}

text.addEventListener('keyup', () => {
    update(text.value);
    render();
})

document.querySelector('#submit').addEventListener('click', () => {
    update(text.value);
    render();
});

update(pattern);
render();