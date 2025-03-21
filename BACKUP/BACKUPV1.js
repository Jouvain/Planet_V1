// on charge le JSON
async function loadData() {
    const response = await fetch("data.json");
    return await response.json();
}
// on ne peuple le page qu'avec le JSON chargé
async function init() {
    const data = await loadData();
    createTimeline(data);
    renderCycle(2029, data);
}

const cycleContainer = document.getElementById("cycle__container");
// positionnement des images
const positions = {
    "A": {x:100, y:500},
    "B": {x:300, y:500},
    "C": {x:500, y:500},
    "D": {x:700, y:500},
    "E": {x:900, y:500},
    "F": {x:600, y:250},
}

// rendu initial plus création des gestions d'évènements
function renderCycle(chosenYear, data) {
    const annee = data.years.find((element)=> element.year == chosenYear);
    cycleContainer.innerHTML = "";
    // création des images
    annee.nodes.forEach(node => {
        const img = document.createElement("img");
        img.src = node.img;
        img.classList.add("node");
        img.classList.add(`${node.id}`)
        img.style.left = `${positions[node.id].x}px`;
        img.style.top = `${positions[node.id].y}px`;
        cycleContainer.appendChild(img);
    });
    
    // création des flèches
    annee.arrows.forEach(arrow => {
        const from = positions[arrow.from];
        const to = positions[arrow.to];
        const arrowImg =  document.createElement("img");
        const fromNode = document.querySelector(`.${arrow.from}`);
        arrowImg.src = "./img/arrow.svg";
        arrowImg.classList.add("arrow");
        arrowImg.style.left = `${(from.x + to.x) / 2 + fromNode.width / 4}px`;
        arrowImg.style.top = `${(from.y + to.y) / 2 + fromNode.height / 4}px `;
        const angle = Math.atan2(to.y - from.y, to.x - from.x) * (180 / Math.PI);
        arrowImg.style.transform = `rotate(${angle}deg) scale(0)`;
        cycleContainer.appendChild(arrowImg);
        setTimeout(()=> {
            arrowImg.style.transform = `rotate(${angle}deg) scale(${arrow.fleche/100})`;
        }, 50);

        // ajout tooltip
        const tooltip = document.createElement("div");
        tooltip.classList.add("tooltip");
        tooltip.innerText = `${arrow.fleche}`;
        cycleContainer.appendChild(tooltip);
        // affichage tooltip au survol
        arrowImg.addEventListener("mouseover", (event)=> {
            tooltip.style.left = `${event.pageX + 10}px`;
            tooltip.style.top = `${event.pageY - 10}px`;
            tooltip.style.opacity = "1";
        });
        arrowImg.addEventListener("mouseout", ()=> {
            tooltip.style.opacity = "0";
        });
    })
}


function createTimeline(data) {
    const timeline = document.getElementById("timeline");
    const timelineBar = document.getElementById("timeline__bar");
    const timelineProgress = document.getElementById("timeline__progress");
    timeline.querySelectorAll(".year-point, .year-label").forEach(e => e.remove());

    const years = data.years.map(y => y.year);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);

    years.forEach((year, index) => {
        const point = document.createElement("div");
        point.classList.add("year-point");
        point.dataset.year = year;
        // Positionner chaque point de manière proportionnelle
        const percentage = ((year - minYear) / (maxYear - minYear)) * 100;
        point.style.left = `calc(${percentage}% - 7.5px)`;
        // création du label
        const label = document.createElement("div");
        label.classList.add("year-label");
        label.innerText = year;
        label.style.left = `calc(${percentage}%)`;
        // Gérer le clic pour afficher le cycle de l'année sélectionnée
        point.addEventListener("click", () => {
            document.querySelectorAll(".year-point").forEach(p => p.classList.remove("active"));
            point.classList.add("active");
            timelineProgress.style.width = `${percentage}%`;
            renderCycle(year, data);
        });
        timeline.appendChild(point);
        timeline.appendChild(label);
    });
    document.querySelector(`.year-point[data-year="2025"]`).classList.add("active");
    const defaultPercentage = ((years[0] - minYear) / (maxYear - minYear)) * 100;
    timelineProgress.style.width = `${defaultPercentage}%`;
}
init();

