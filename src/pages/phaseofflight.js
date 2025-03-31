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
    { name: "Take-off Run", incidents: 30245, highlight: false },
    { name: "Approach", incidents: 75220, highlight: false },
    { name: "Climb", incidents: 26956, highlight: false },
    { name: "Landing Roll", incidents: 32157, highlight: false },
    { name: "En Route", incidents: 5306, highlight: false },
    { name: "Descent", incidents: 2331, highlight: false },
];

const phaseWidth = (width - margin.left - margin.right) / phases.length;

// Créer le chemin de vol
const flightPathData = [
    { x: margin.left + phaseWidth * 0.5, y: height - margin.bottom },
    { x: margin.left + phaseWidth * 1.5, y: height - margin.bottom - 50 },
    { x: margin.left + phaseWidth * 2.5, y: height - margin.bottom - 150 },
    { x: margin.left + phaseWidth * 3.5, y: height - margin.bottom - 200 },
    { x: margin.left + phaseWidth * 4.5, y: height - margin.bottom - 150 },
    { x: margin.left + phaseWidth * 5.5, y: height - margin.bottom - 50 },
    { x: margin.left + phaseWidth * 6.5, y: height - margin.bottom }
];

// Créer un générateur de ligne
const lineGenerator = d3.line()
    .x(d => d.x)
    .y(d => d.y)
    .curve(d3.curveCatmullRom.alpha(0.5));

// Dessiner le chemin de vol avec un arrondi
svg.append("path")
    .attr("d", lineGenerator(flightPathData))
    .attr("fill", "none")
    .attr("stroke", "#333")
    .attr("stroke-width", 1.5)
    .attr("stroke-linecap", "round");

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
            .attr("y1", 150)
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

phases.forEach((phase, phaseIndex) => {
    const baseX = margin.left + phaseWidth * phaseIndex + phaseWidth / 2 - (squareSize * squaresPerRow + squarePadding * (squaresPerRow - 1)) / 2;
    const baseY = 150;
    
    // Calculer le nombre de carrés basé sur le pourcentage
    const totalIncidents = phases.reduce((acc, phase) => acc + phase.incidents, 0);
    const percentage = (phase.incidents / totalIncidents) * 100;
    const numSquares = Math.round(percentage * (squareSize * squaresPerRow + squarePadding * (squaresPerRow - 1)) / 100);

    // Créer un groupe pour chaque phase
    const phaseGroup = svg.append("g")
        .attr("class", "phase-group")
        .attr("data-total", phase.incidents);

    // Ajouter les rectangles au groupe
    for (let i = 0; i < numSquares; i++) {
        const row = Math.floor(i / squaresPerRow);
        const col = i % squaresPerRow;
        
        phaseGroup.append("rect")
            .attr("x", baseX + col * (squareSize + squarePadding))
            .attr("y", baseY + row * (squareSize + squarePadding))
            .attr("width", squareSize)
            .attr("height", squareSize)
            .attr("class", "grid-square")
            .attr("fill", phase.highlight ? "#00bcd4" : "#d3d3d3")
            .attr("rx", 2)
            .attr("ry", 2);
    }

    // Ajouter une zone invisible pour la détection de la souris
    phaseGroup.append("rect")
        .attr("x", margin.left + phaseWidth * phaseIndex)
        .attr("y", baseY - 20)
        .attr("width", phaseWidth)
        .attr("height", height - baseY - margin.bottom + 20)
        .attr("fill", "transparent")
        .attr("class", "hover-zone");

    // Ajouter le texte pour afficher le total (initialement caché)
    phaseGroup.append("text")
        .attr("class", "total-label")
        .attr("x", margin.left + phaseWidth * phaseIndex + phaseWidth / 2)
        .attr("y", baseY - 5)
        .attr("text-anchor", "middle")
        .attr("fill", "#00bcd4")
        .attr("opacity", 0)
        .text(`${phase.incidents}`);

    // Ajouter le texte pour afficher le pourcentage (initialement caché)
    phaseGroup.append("text")
        .attr("class", "percentage-label")
        .attr("x", margin.left + phaseWidth * phaseIndex + phaseWidth / 2)
        .attr("y", baseY - 25)
        .attr("text-anchor", "middle")
        .attr("fill", "#00bcd4")
        .attr("opacity", 0)

    // Ajouter les interactions
    phaseGroup.selectAll(".hover-zone")
        .on("mouseover", function() {
            // Mettre en surbrillance tous les carrés de la phase
            phaseGroup.selectAll(".grid-square")
                .transition()
                .duration(200)
                .attr("fill", "#00bcd4");
            
            // Afficher le total et le pourcentage
            phaseGroup.select(".total-label")
                .transition()
                .duration(200)
                .attr("opacity", 1);
            phaseGroup.select(".percentage-label")
                .transition()
                .duration(200)
                .attr("opacity", 1);
        })
        .on("mouseout", function() {
            // Remettre les couleurs d'origine
            phaseGroup.selectAll(".grid-square")
                .transition()
                .duration(200)
                .attr("fill", phase.highlight ? "#00bcd4" : "#d3d3d3");
            
            // Cacher le total et le pourcentage
            phaseGroup.select(".total-label")
                .transition()
                .duration(200)
                .attr("opacity", 0);
            phaseGroup.select(".percentage-label")
                .transition()
                .duration(200)
                .attr("opacity", 0);
        });
});

// Ajouter l'icône de l'avion à la position du décollage
const planeX = margin.left + phaseWidth * 1.2;
const planeY = height - margin.bottom - 80;
const baseY = 150;


// Ajouter les cercles pour avancer et reculer
svg.append("circle")
    .attr("cx", margin.left + phaseWidth * 1.2 - 30)
    .attr("cy", height - margin.bottom - 5)
    .attr("r", 15)
    .attr("fill", "#00bcd4")
    .on("click", function() {
        // Fonctionnalité pour reculer
    });