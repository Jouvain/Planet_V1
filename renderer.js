/*
#####################################################################################################
# !!! Work in Progress !!!                                                                          
# TODO :                                                                                            
# ?? correction fonctions de rendu pour modification fluide des items (nombre, positions) ??        
# ?? formulaire pour entrer les données plutôt que dans le JSON ??                                  
#                                                                                                   
# ?? bouton pour gestion tolltips                                                                   
# ?? bouton pour gestion animation                                                                  
# ?? V2 roue du temps                                                                                
#####################################################################################################
*/

// ###### Changer le type de flèche utilisé :
const imgArrow = "./img/arrowLarge.svg"

async function init() {
    createTimeline(data);
    renderCycle(2025, data);
}

const cycleContainer = document.getElementById("cycle__container");

let tooltipsDisplayed = false;

// ################### gestio du bouton pour tooltips
const tooltipBtn = document.getElementById("tooltipBtn");
tooltipBtn.addEventListener("click", ()=> {
    switchTooltipsOpacity(tooltipsDisplayed);
    tooltipsDisplayed === true ? tooltipsDisplayed = false : tooltipsDisplayed = true;
}) 



function switchTooltipsOpacity(tooltipsDisplayed) {
    const tooltips = document.querySelectorAll(".tooltip");
    tooltips.forEach(tooltip=>{
        if(tooltipsDisplayed) {
            tooltip.style.opacity = 0;
        } else {
            if(tooltip.classList.contains("F") | tooltip.classList.contains("E")) {
                if(document.querySelector(".arrowF").style.opacity > 0 & tooltip.classList.contains("F")) {
                    tooltip.style.opacity = 1;
                } else if (document.querySelector(".arrowE").style.opacity > 0 & tooltip.classList.contains("E")) {
                    tooltip.style.opacity = 1;
                } 
            } else {
                tooltip.style.opacity = 1;
            }
        }
    })
}

// ################### Module de disposition dynamique des éléments :
// let mod = 200;
// function positionInLine(data) {
//     let initial = 200;
//     let mod = 200;
//     let positionAligned = [];
//     for (let node of  data.years[0].nodes) {
//         const obj = new Object();
//         obj.id = node.id;
//         obj.x = 
//         positionAligned.push(node.id)

//     }
//     console.log(positionAligned)
// }
// positionInLine(data);

// ################## Positionnement des éléments en ligne + surplomb vis-à-vis du premier élément :
const positionA = {
    x:5, y:60
}
const incrementation = 20;
const positions = {
    "A": {x:positionA.x , y:positionA.y},
    "B": {x:positionA.x + incrementation, y:positionA.y},
    "C": {x:positionA.x + 2*incrementation, y:positionA.y},
    "D": {x:positionA.x + 3*incrementation, y:positionA.y},
    "E": {x:positionA.x + 4*incrementation, y:positionA.y},
    "F": {x:positionA.x + 2.2*incrementation, y:positionA.y - 50},
}


// ###################################################### Moteur de rendu de la vue :
// ################## éléments, flèches et tooltips :
function renderCycle(chosenYear, data) {
    const annee = data.years.find((element)=> element.year == chosenYear);
    cycleContainer.innerHTML = "";
    // ############ création des images
    annee.nodes.forEach(node => {
        const img = document.createElement("img");
        img.src = node.img;
        img.classList.add("node");
        if (node.id === "F") {img.classList.add("node--large")};
        img.classList.add(`${node.id}`)
        img.style.left = `${positions[node.id].x}%`;
        img.style.top = `${positions[node.id].y}%`;
        cycleContainer.appendChild(img);
    });
    
    // ########## création des flèches
    annee.arrows.forEach(arrow => {
        const from = positions[arrow.from];
        const to = positions[arrow.to];
        const arrowImg =  document.createElement("img");
        const fromNode = document.querySelector(`.${arrow.from}`);
        const toNode = document.querySelector(`.${arrow.to}`);
        arrowImg.src = imgArrow;
        arrowImg.classList.add("arrow");
        arrowImg.classList.add(`arrow${arrow.from}`)
        // appel fonction de création des flèches animées :
        createAnimatedArrow(fromNode, toNode, arrow.fleche, arrow.from);
        arrowImg.style.left = `${(fromNode.getBoundingClientRect().left + toNode.getBoundingClientRect().left) / 2}px`;
        arrowImg.style.top = `${(fromNode.getBoundingClientRect().top - 90)}px`;
        let angle = Math.atan2(toNode.getBoundingClientRect().top - fromNode.getBoundingClientRect().top, toNode.getBoundingClientRect().left - fromNode.getBoundingClientRect().left) * (180 / Math.PI);
        arrowImg.style.transform = `rotate(${angle}deg) scale(0)`;
        if(arrow.from === "F") {
            arrowImg.style.opacity = 0;
            arrowImg.style.top = `${(fromNode.getBoundingClientRect().top + 20)}px`;
            const correction = -30;
            let angle = Math.atan2(toNode.getBoundingClientRect().top - fromNode.getBoundingClientRect().top, toNode.getBoundingClientRect().left - fromNode.getBoundingClientRect().left) * (180 / Math.PI) + correction;
        } else if(arrow.from === "E") {
            arrowImg.style.opacity = 0;
            arrowImg.style.top = `${(toNode.getBoundingClientRect().top + 20)}px`;
            const correction = -30;
            let angle = Math.atan2(toNode.getBoundingClientRect().top - fromNode.getBoundingClientRect().top, toNode.getBoundingClientRect().left - fromNode.getBoundingClientRect().left) * (180 / Math.PI) + correction;
        }
        cycleContainer.appendChild(arrowImg);
        setTimeout(()=> {
            if(arrow.fleche > 0) {arrowImg.style.opacity = 1};
            arrowImg.style.transform = `rotate(${angle}deg) scaleY(${arrow.fleche/100})`;
            if (arrow.from == "A" & arrow.fleche/100 < 0.2) { arrowImg.style.transform = `rotate(${angle}deg) scaleY(${0.2})`; }
        }, 50);

        // #########  ajout tooltip pour chaque flèche
        const tooltip = document.createElement("div");
        tooltip.classList.add("tooltip");
        tooltip.innerText = `${arrow.fleche}`;
        tooltip.style.left = arrowImg.style.left;
        tooltip.style.top = `${ (fromNode.getBoundingClientRect().top + 20) }px `;
        tooltip.classList.add(`${arrow.from}`)
        if(arrow.from === "E") {
            tooltip.style.left = arrowImg.style.left;
            tooltip.style.top = `${ (toNode.getBoundingClientRect().top) }px `;
        } else if (arrow.from === "F") {
            tooltip.style.left = arrowImg.style.left;
            tooltip.style.top = `${ (fromNode.getBoundingClientRect().top) }px `;
        }
        if(tooltipsDisplayed) {
            tooltip.style.opacity = 1;
            if (arrow.fleche == 0) {
                tooltip.style.opacity = 0;
            } 
        }


        cycleContainer.appendChild(tooltip);
        // ############# MODULE AU CHOIX affichage initial des tooltips (si pas envie du survol)
        // if(arrow.fleche > 0) {
        //     tooltip.style.opacity = 1;
        // } else {
        //     tooltip.style.opacity = 0;
        // }
        // ############ affichage tooltip au survol
        arrowImg.addEventListener("mouseover", (event)=> {
            if(!tooltipsDisplayed) {
                tooltip.style.opacity = 1;
            }
        });
        arrowImg.addEventListener("mouseout", ()=> {
            if(!tooltipsDisplayed) {
                tooltip.style.opacity = 0;
            } 
        });
    })
    
}

// ########### timeline :
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
        const percentage = ((year - minYear) / (maxYear - minYear)) * 100;
        point.style.left = `calc(${percentage}% - 7.5px)`;
        const label = document.createElement("div");
        label.classList.add("year-label");
        label.innerText = year;
        label.style.left = `calc(${percentage}%)`;
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


// ######################### Gestion de l'animation :
function createAnimatedArrow(fromNode, toNode, arrowFleche, arrowFrom) {
    const animatedArrow = document.createElement("img");
    animatedArrow.src = imgArrow;
    animatedArrow.classList.add("animated-arrow");
    if(arrowFleche === 0) {
        animatedArrow.style.opacity = 0;
    }    
    animatedArrow.style.left = `${(fromNode.getBoundingClientRect().left + toNode.getBoundingClientRect().left) / 2 + fromNode.width / 4}px`;
    animatedArrow.style.top = `${(fromNode.getBoundingClientRect().top + toNode.getBoundingClientRect().top) / 2.7 + fromNode.height / 4 - 200}px`;
    let angle = Math.atan2(toNode.getBoundingClientRect().top - fromNode.getBoundingClientRect().top, toNode.getBoundingClientRect().left - fromNode.getBoundingClientRect().left) * (180 / Math.PI);
    animatedArrow.style.transform = `rotate(${angle}deg) scale(1)`;
    if(arrowFrom === "F" || arrowFrom === "E") {
        animatedArrow.style.top = `${(fromNode.getBoundingClientRect().top + toNode.getBoundingClientRect().top) / 2.7 + fromNode.height / 64}px`;
        const correction = 0;
        let angle = Math.atan2(toNode.getBoundingClientRect().top - fromNode.getBoundingClientRect().top, toNode.getBoundingClientRect().left - fromNode.getBoundingClientRect().left) * (180 / Math.PI) + correction;
        animatedArrow.style.transform = `rotate(${angle}deg)`;
    }
    cycleContainer.appendChild(animatedArrow);
    requestAnimationFrame(() => animateArrow(animatedArrow, fromNode, toNode, arrowFrom));
}
function animateArrow(arrow, fromNode, toNode, arrowFrom) {
    const duration = 10000; 
    const delay = 2000;
    let startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        let progress = (timestamp - startTime) / duration;
        if(progress > 1) {
            startTime = timestamp;
            progress = 0;
        }
        const currentX = fromNode.getBoundingClientRect().left + (toNode.getBoundingClientRect().left - fromNode.getBoundingClientRect().left) * progress;
        const currentY = fromNode.getBoundingClientRect().top + (toNode.getBoundingClientRect().top - fromNode.getBoundingClientRect().top) * progress - 66;
        arrow.style.left = `${currentX}px`;
        arrow.style.top = `${currentY}px`;
        if(arrowFrom === "E") {
            arrow.style.top = `${currentY - 20}px`;
        } else if (arrowFrom === "F") {
            arrow.style.top = `${currentY + 0}px`;
        }
        requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}




init();

