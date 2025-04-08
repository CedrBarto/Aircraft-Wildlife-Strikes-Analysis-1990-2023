// Dimensions SVG
const width = 1000;
const height = 600;
const margin = { top: 20, right: 40, bottom: 100, left: 40 };

// Créer SVG
const svg = d3.select("#visualization")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height]);

// Définir les phases de vol
const phases = [
    { name: "Décollage", incidents: 30245, highlight: false },
    { name: "Ascension", incidents: 26956, highlight: false },
    { name: "En Route", incidents: 5306, highlight: false },
    { name: "Descente", incidents: 2331, highlight: false },
    { name: "Approche", incidents: 75220, highlight: false },
    { name: "Atterrissage", incidents: 32157, highlight: false }
];

const phaseWidth = (width - margin.left - margin.right) / phases.length;

// Créer le chemin de vol
const flightPathData = [
    { x: margin.left, y: height - margin.bottom },
    { x: margin.left + phaseWidth, y: height - margin.bottom - 80 },
    { x: margin.left + phaseWidth * 2, y: height - margin.bottom - 180 },
    { x: margin.left + phaseWidth * 3, y: height - margin.bottom - 220 },
    { x: margin.left + phaseWidth * 4, y: height - margin.bottom - 180 },
    { x: margin.left + phaseWidth * 5, y: height - margin.bottom - 80 },
    { x: width - margin.right, y: height - margin.bottom }
];

// Créer un générateur de ligne avec une courbe plus douce
const lineGenerator = d3.line()
    .x(d => d.x)
    .y(d => d.y)
    .curve(d3.curveBasis);


// Dessiner la ligne de sol
svg.append("line")
    .attr("x1", margin.left)
    .attr("y1", height - margin.bottom)
    .attr("x2", width - margin.right)
    .attr("y2", height - margin.bottom)
    .attr("stroke", "#333")
    .attr("stroke-width", 1.5);

// Dessiner les séparateurs verticaux des phases
phases.forEach((phase, i) => {
    if (i > 0) {
        svg.append("line")
            .attr("x1", margin.left + phaseWidth * i)
            .attr("y1", 80)
            .attr("x2", margin.left + phaseWidth * i)
            .attr("y2", height - margin.bottom)
            .attr("stroke", "#333")
            .attr("stroke-width", 0.5);
    }
});

// Dessiner les étiquettes des phases
phases.forEach((phase, i) => {
    svg.append("text")
        .attr("x", margin.left + phaseWidth * i + phaseWidth / 2)
        .attr("y", height - margin.bottom + 30)
        .attr("text-anchor", "middle")
        .attr("class", "phase-label")
        .text(phase.name);
});

// Créer des graphiques en mosaïque pour chaque phase
const squareSize = 20;
const squaresPerRow = 3;
const squarePadding = 2;

// Définir le SVG de l'avion
const PLANE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 469.77 179.08">
  <path d="M438.79,145.3c-5.18-.1-11.26.5-16.2-1.3-4.67-1.7-8.58-8.65-13.26-8.75-7.53-.15-19.82,3.24-28.05,4.05-25.97,2.53-56,4.63-81.98,2.99-11.98-.76-22.47-1.06-34.1-1.66-9.62-.5-12.1-.14-22.88-.29-10.16-.14-21.44-.15-31.53-1.03-.28,1.89,8.35,2.62,6,4.98l-16.8,3.21-1.2,4.79c1.25,1.11,11.09-3.17,9.98.49l-14.47,25.53c-2.17,1.95-19.67-.19-22.09-1.94-2.7-1.96-7.78-16.25-10.1-16.97-1.22-.38-6.24.72-7.29,1.44-3.42,2.34-.05,5.7-9.5,6.5-5.21.44-15.53-.47-20.91-1.16-3.75-.48-16.45-2.77-18.92-4.81-3.9-3.22-2.95-19.45-1.19-24.05,4.57-11.94,15.78-4.85,24.99-6.81l22.5,3.79c-.71-1.14-.83-3.1-1.54-3.96-1.01-1.23-26.85-9.14-30.22-9.78-25.69-4.83-53.51-4.49-79.45-10.55-7.99-1.87-35.07-10.38-39.01-16.98-6.44-10.77,8.65-14.21,14.58-17.87,3.87-2.39,6.21-6.07,11.29-8.71,12.1-6.29,31.28-5.78,44.9-5.18,47.05,2.06,95.54,12.96,142.74,14.81l101.08-50.91c7.12-5.95,13.39-18.36,20.08-23.92,2.1-1.74,1.54-1.37,4.88-.5l1.71.46c.27.07.39.38.25.62-7.06,11.65-11.38,24.27-21.8,33.45-3.8,3.35-25.63,17.86-26.46,19.54-1.28,2.57,9.04,3,7.99,6.49h-16.5c-1.54,0-15.82,11.76-18.49,13.51-.41,2.01.47,1.22,1.27,1.7,2.22,1.33,5.08,2.67,7.72,2.79-1.06,2.84-5.75,2.12-8.54,2.03-2.49-.09-10.11-3.16-9.45.96,13.81.84,27.64,2.43,41.37,4.13,17.31,2.14,37.34,6.64,54.14,7.86,13.59.99,18.63-1.98,28.5-10.47,19.17-16.5,35.65-38.4,55.41-54.59,3.47-1.49,20.81-.31,23.6,1.58s-16.6,55.38-17.01,62.49c7.92-2.6,16.58-9.53,24.97-4.49l-22.97,21.01c-.45,2.29,1,1.24,2.35,1.61,3.64.99,18.52,3.57,19.49,6.54.57,1.74.14,5.75-1.12,7.08-3.68,3.91-22.93,4.47-28.74,6.25v14Z" fill="#00bcd4"/>
</svg>`;

// Convertir le SVG en URI data
const planeSvgUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(PLANE_SVG);

// Créer un groupe pour l'avion
const planeGroup = svg.append("g");

// Ajouter l'avion qui suivra la courbe
const planeImage = planeGroup.append("image")
    .attr("href", planeSvgUrl)
    .attr("width", 60)
    .attr("height", 30)
    .attr("x", -30)
    .attr("y", -15)
    .attr("transform", "scale(-1, 1)"); // Miroir horizontal de l'avion

// Position initiale de l'avion et du cercle
let currentPhase = 0;
updatePositions(currentPhase);

// Modifier le conteneur du curseur
const rangeContainer = d3.select(".container")
    .append("div")
    .style("margin-top", "-50px")
    .style("clear", "both")
    .style("width", width + "px");

// Ne conserver que cette partie qui crée le slider et lui attache les événements
const flightProgress = rangeContainer.append("input")
    .attr("type", "range")
    .attr("min", "0")
    .attr("max", "100")
    .attr("value", "0")
    .attr("id", "flightProgress")
    .style("width", "100%")
    .style("display", "block")
    .style("cursor", "pointer");

// Fonction pour mettre à jour la couleur du slider
function updateSliderColor(value) {
    const percentage = value;
    document.getElementById("flightProgress").style.background = 
        `linear-gradient(to right, #00C2CB 0%, #00C2CB ${percentage}%, #d3d3d3 ${percentage}%)`;
}

// Ajouter ces événements pour mettre à jour la visualisation du slider
flightProgress.on("input", function() {
    const value = this.value;
    updateSliderColor(value);
    updatePositions(value);
});

// Initialiser la couleur du slider
updateSliderColor(0);

// S'assurer que la couleur est mise à jour correctement si d'autres scripts modifient la valeur
flightProgress.on("change", function() {
    updateSliderColor(this.value);
});

// Modifier la fonction updatePositions pour supprimer les références au cercle bleu
function updatePositions(t) {
    const normalizedT = t / 100;
    
    const point = getPointAtT(normalizedT);
    const angle = getAngleAtT(normalizedT);
    
    planeGroup
        .attr("transform", `translate(${point.x}, ${point.y}) rotate(${angle})`);
    
    const phaseIndex = Math.floor(normalizedT * (phases.length - 0.01));
    
    phases.forEach((phase, i) => {
        d3.selectAll(`.phase-${i} .grid-square`)
            .attr("fill", i === phaseIndex ? "#00bcd4" : "#d3d3d3");
        
        d3.select(`.phase-${i} .incidents-count`)
            .attr("opacity", i === phaseIndex ? 1 : 0);
        d3.select(`.phase-${i} .incidents-percentage`)
            .attr("opacity", i === phaseIndex ? 1 : 0);
    });
}

// Fonction pour calculer l'angle de rotation de l'avion
function getAngleAtT(t) {
    const delta = 0.01;
    const p1 = getPointAtT(t);
    const p2 = getPointAtT(Math.min(1, t + delta));
    
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    
    return Math.atan2(dy, dx) * (180 / Math.PI);
}

// Fonction pour obtenir un point sur la courbe avec interpolation
function getPointAtT(t) {
    const index = Math.floor(t * (flightPathData.length - 1));
    const nextIndex = Math.min(index + 1, flightPathData.length - 1);
    const segmentT = t * (flightPathData.length - 1) - index;
    
    const p0 = index > 0 ? flightPathData[index - 1] : flightPathData[index];
    const p1 = flightPathData[index];
    const p2 = flightPathData[nextIndex];
    const p3 = nextIndex < flightPathData.length - 1 ? flightPathData[nextIndex + 1] : p2;
    
    // Interpolation de Catmull-Rom
    const t2 = segmentT * segmentT;
    const t3 = t2 * segmentT;
    
    const x = 0.5 * (
        (2 * p1.x) +
        (-p0.x + p2.x) * segmentT +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
    );
    
    const y = 0.5 * (
        (2 * p1.y) +
        (-p0.y + p2.y) * segmentT +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
    );
    
    return { x, y };
}

// Modifier les événements de clic sur les zones de phase
phases.forEach((phase, i) => {
    svg.append("rect")
        .attr("x", margin.left + phaseWidth * i)
        .attr("y", 0)
        .attr("width", phaseWidth)
        .attr("height", height)
        .attr("fill", "transparent")
        .style("cursor", "pointer")
        .on("click", () => {
            currentPhase = i;
            // Afficher les données de la phase cliquée
            d3.select(`.phase-${i} .incidents-count`)
                .transition()
                .duration(200)
                .attr("opacity", 1);
            d3.select(`.phase-${i} .incidents-percentage`)
                .transition()
                .duration(200)
                .attr("opacity", 1);
            updatePositions(i);
        });
});

// Modifier la création des groupes de phase
phases.forEach((phase, phaseIndex) => {
    // Calculer la position de base avec un décalage supplémentaire pour les phases spécifiques
    let offset = 0;
    if (phaseIndex === 2) { // En Route
        offset = 8; // Déplacer vers la droite
    } else if (phaseIndex === 3) { // Descent
        offset = 12; // Déplacer plus vers la droite
    } else if (phaseIndex === 4 || phaseIndex === 5) { // Approach et Landing Roll
        offset = -5; // Déplacer vers la gauche
    }
    const baseX = margin.left + phaseWidth * phaseIndex + phaseWidth / 2 - (squareSize * squaresPerRow + squarePadding * (squaresPerRow - 1)) / 2 + offset;
    const baseY = 80;
    
    // Calculer le nombre de carrés basé sur le pourcentage
    const totalIncidents = phases.reduce((acc, phase) => acc + phase.incidents, 0);
    const percentage = (phase.incidents / totalIncidents) * 100;
    const numSquares = Math.round(percentage * (squareSize * squaresPerRow + squarePadding * (squaresPerRow - 1)) / 100);

    // Créer un groupe pour chaque phase avec une classe unique
    const phaseGroup = svg.append("g")
        .attr("class", `phase-group phase-${phaseIndex}`)
        .attr("data-total", phase.incidents);

    // Ajouter le nombre d'incidents au-dessus des carrés (initialement caché)
    const textOffset = phaseIndex === phases.length - 1 ? -15 : 
                      (phaseIndex >= phases.length - 2 ? -10 : 
                      (phaseIndex === 2 || phaseIndex === 3) ? -10 : 0); // Décalage pour En Route et Descent
    phaseGroup.append("text")
        .attr("x", baseX + (squareSize * squaresPerRow + squarePadding * (squaresPerRow - 1)) / 2 + textOffset)
        .attr("y", baseY - 30)
        .attr("text-anchor", "middle")
        .attr("fill", "#333")
        .attr("class", "incidents-count")
        .attr("opacity", 0)
        .text(phase.incidents.toLocaleString());

    // Ajouter le pourcentage en dessous du nombre d'incidents (initialement caché)
    phaseGroup.append("text")
        .attr("x", baseX + (squareSize * squaresPerRow + squarePadding * (squaresPerRow - 1)) / 2 + textOffset)
        .attr("y", baseY - 10)
        .attr("text-anchor", "middle")
        .attr("fill", "#666")
        .attr("class", "incidents-percentage")
        .attr("opacity", 0)
        .text(`${percentage.toFixed(1)}%`);

    // Ajouter les rectangles au groupe avec interaction
    const squares = phaseGroup.selectAll(".grid-square")
        .data(Array(numSquares).fill())
        .enter()
        .append("rect")
        .attr("x", (d, i) => baseX + (i % squaresPerRow) * (squareSize + squarePadding))
        .attr("y", (d, i) => baseY + Math.floor(i / squaresPerRow) * (squareSize + squarePadding))
        .attr("width", squareSize)
        .attr("height", squareSize)
        .attr("class", "grid-square")
        .attr("fill", "#d3d3d3")
        .attr("color", "white")
        .attr("rx", 2)
        .attr("ry", 2)
        .style("cursor", "pointer");

    // Ajouter les interactions sur les carrés
    squares
        .on("mouseover", function() {
            // Afficher les données
            phaseGroup.select(".incidents-count")
                .transition()
                .duration(200)
                .attr("opacity", 1);
            phaseGroup.select(".incidents-percentage")
                .transition()
                .duration(200)
                .attr("opacity", 1);
            // Changer la couleur de tous les carrés de la phase en bleu
            phaseGroup.selectAll(".grid-square")
                .transition()
                .duration(200)
                .attr("fill", "#00bcd4");
        })
        .on("mouseout", function() {
            // Ne pas cacher les données si c'est la phase active
            if (currentPhase !== phaseIndex) {
                phaseGroup.select(".incidents-count")
                    .transition()
                    .duration(200)
                    .attr("opacity", 0);
                phaseGroup.select(".incidents-percentage")
                    .transition()
                    .duration(200)
                    .attr("opacity", 0);
            }
            // Revenir à la couleur grise pour tous les carrés si ce n'est pas la phase active
            if (currentPhase !== phaseIndex) {
                phaseGroup.selectAll(".grid-square")
                    .transition()
                    .duration(200)
                    .attr("fill", "#d3d3d3");
            }
        })
        .on("click", () => {
            currentPhase = phaseIndex;
            // Afficher les données de la phase cliquée
            d3.select(`.phase-${phaseIndex} .incidents-count`)
                .transition()
                .duration(200)
                .attr("opacity", 1);
            d3.select(`.phase-${phaseIndex} .incidents-percentage`)
                .transition()
                .duration(200)
                .attr("opacity", 1);
            updatePositions(phaseIndex);
        });
});

// Remplacer les écouteurs de clic sur les carrés et les phases

// Ajouter une fonction pour animer le mouvement de l'avion
function animateToPhase(targetPhase) {
    // Obtenir la valeur actuelle du slider
    const currentValue = parseFloat(document.getElementById("flightProgress").value);
    
    // Calculer la valeur cible en fonction de la phase (milieu de la phase)
    const targetValue = (targetPhase + 0.5) * (100 / phases.length);
    
    // Durée de l'animation en ms
    const duration = 1000;
    const fps = 60;
    const frames = duration / 1000 * fps;
    
    // Calculer l'incrément par frame
    const increment = (targetValue - currentValue) / frames;
    
    let frame = 0;
    
    // Fonction d'animation
    function animate() {
        frame++;
        
        // Calculer la nouvelle valeur avec une fonction d'easing
        const progress = frame / frames;
        const easedProgress = 1 - Math.pow(1 - progress, 3); // Easing cubic out
        const newValue = currentValue + (targetValue - currentValue) * easedProgress;
        
        // Mettre à jour le slider et la position de l'avion
        document.getElementById("flightProgress").value = newValue;
        updateSliderColor(newValue);
        updatePositions(newValue);
        
        // Continuer l'animation si nous n'avons pas terminé
        if (frame < frames) {
            requestAnimationFrame(animate);
        }
    }
    
    // Démarrer l'animation
    animate();
}

// Modifier les événements de clic sur les zones de phase
phases.forEach((phase, i) => {
    svg.append("rect")
        .attr("x", margin.left + phaseWidth * i)
        .attr("y", 0)
        .attr("width", phaseWidth)
        .attr("height", height)
        .attr("fill", "transparent")
        .style("cursor", "pointer")
        .on("click", () => {
            currentPhase = i;
            // Afficher les données de la phase cliquée
            d3.select(`.phase-${i} .incidents-count`)
                .transition()
                .duration(200)
                .attr("opacity", 1);
            d3.select(`.phase-${i} .incidents-percentage`)
                .transition()
                .duration(200)
                .attr("opacity", 1);
                
            // Animer l'avion vers cette phase
            animateToPhase(i);
        });
});