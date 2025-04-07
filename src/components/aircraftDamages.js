import * as d3 from "d3";

// Définir les chemins des fichiers SVG pour chaque partie de l'avion
const svgPaths = {
    nose: new URL('../../public/assets/svg/nez_avion.svg', import.meta.url).href,
    body: new URL('../../public/assets/svg/corps_avion.svg', import.meta.url).href,
    engines: new URL('../../public/assets/svg/moteurs_avion.svg', import.meta.url).href,
    wings: new URL('../../public/assets/svg/ailes_avion.svg', import.meta.url).href,
    tailAilerons: new URL('../../public/assets/svg/queue_ailerons_avion.svg', import.meta.url).href
};

// Charger les données JSON
d3.json('/assets/data/Damage.json')
    .then(data => {
        if (!data || data.length === 0) {
            console.error("Les données sont vides ou mal formatées.");
            return;
        }
        initVisualization(data[1]); // Utiliser le deuxième objet du JSON pour les pourcentages
    })
    .catch(error => console.error("Erreur lors du chargement des données :", error));

// Fonction pour initialiser la visualisation
function initVisualization(data) {
    const svg = d3.select("#aircraft-visualization")
        .append("svg")
        .attr("width", 800)
        .attr("height", 600);

    // Ajouter les parties de l'avion

    // Nez de l'avion
    svg.append("image")
        .attr("href", svgPaths.nose)
        .attr("class", "nose")
        .attr("x", 300)
        .attr("y", 50)
        .attr("width", 200)
        .attr("height", 100)
        .on("click", () => handlePartClick("nose", data));

    // Corps de l'avion
    svg.append("image")
        .attr("href", svgPaths.body)
        .attr("class", "body")
        .attr("x", 250)
        .attr("y", 150)
        .attr("width", 300)
        .attr("height", 200)
        .on("click", () => handlePartClick("body", data));

    // Moteurs
    svg.append("image")
        .attr("href", svgPaths.engines)
        .attr("class", "engines")
        .attr("x", 200)
        .attr("y", 200)
        .attr("width", 400)
        .attr("height", 100)
        .on("click", () => handlePartClick("engines", data));

    // Ailes
    svg.append("image")
        .attr("href", svgPaths.wings)
        .attr("class", "wings")
        .attr("x", 100)
        .attr("y", 250)
        .attr("width", 600)
        .attr("height", 150)
        .on("click", () => handlePartClick("wings", data));

    // Queue et ailerons
    svg.append("image")
        .attr("href", svgPaths.tailAilerons)
        .attr("class", "tail-ailerons")
        .attr("x", 350)
        .attr("y", 400)
        .attr("width", 100)
        .attr("height", 150)
        .on("click", () => handlePartClick("tail-ailerons", data));
}

// Fonction pour gérer les clics sur les parties de l'avion
function handlePartClick(part, data) {
    // Réinitialiser les couleurs
    d3.selectAll("image").attr("opacity", 1);

    // Mettre en surbrillance la partie cliquée
    d3.select(`.${part}`).attr("opacity", 0.7);

    // Mettre à jour la boîte d'informations
    let partData;
    switch (part) {
        case "nose":
            partData = { name: "Nez", percentage: data.STR_NOSE };
            break;
        case "body":
            partData = { name: "Corps", percentage: data.STR_FUSE };
            break;
        case "engines":
            partData = { name: "Moteurs", percentage: data.STR_ENG };
            break;
        case "wings":
            partData = { name: "Ailes", percentage: data.STR_WING_ROT };
            break;
        case "tail-ailerons":
            partData = { name: "Queue et Ailerons", percentage: data.STR_TAIL };
            break;
        default:
            partData = { name: "Inconnu", percentage: "0%" };
    }

    d3.select("#info-box")
        .html(`
            <h3>${partData.name}</h3>
            <p>${partData.percentage} des impacts</p>
        `);
}