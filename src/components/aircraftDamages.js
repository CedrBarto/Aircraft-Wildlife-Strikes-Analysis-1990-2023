import * as d3 from "d3";

const svgUrls = {
  aileGauche: new URL(
    "../../public/assets/svg/aile_gauche_avion.svg",
    import.meta.url
  ).href,
  aileDroite: new URL(
    "../../public/assets/svg/aile_droite_avion.svg",
    import.meta.url
  ).href,
  corps: new URL("../../public/assets/svg/corps_avion.svg", import.meta.url)
    .href,
  nez: new URL("../../public/assets/svg/nez_avion.svg", import.meta.url).href,
  aileronsQueues: new URL(
    "../../public/assets/svg/aileronsQueues_avion.svg",
    import.meta.url
  ).href,
  moteurGauche: new URL(
    "../../public/assets/svg/moteurs_gauche.svg",
    import.meta.url
  ).href,
  moteurDroit: new URL(
    "../../public/assets/svg/moteurs_droit.svg",
    import.meta.url
  ).href,
};

class AircraftDamages {
  constructor(container) {
    this.container = container;
    this.selectedPart = null;

    // Données simulées sur les dommages par partie d'avion
    this.damageData = {
      aile_gauche: {
        name: "Aile gauche",
        strikes : `16'945`,
        percentage: "14%",
        description:
          "L'aile gauche est particulièrement vulnérable lors du décollage et de l'atterrissage.",
        color: "#00C2CB",
      },
      aile_droite: {
        name: "Aile droite",
        strikes: `16'945`,
        percentage: "14%",
        description:
          "L'aile droite subit des impacts similaires à l'aile gauche.",
        color: "#00C2CB",
      },
      corps: {
        name: "Corps de l'avion",
        strikes: `25'685`,
        percentage: "5%",
        description: "Le fuselage est souvent touché mais ses impacts sont rarement graves.",
        color: "#00C2CB",
      },
      nez: {
        name: "Nez",
        img: "../../public/assets/svg/nez_avion.svg",
        strikes: `33'237`,
        percentage: "8%",
        description:
          "Le nez de l'avion, y compris le radar et les capteurs, est vulnérable aux impacts directs.",
        color: "#00C2CB",
      },
      aileronsQueues: {
        name: "Ailerons et queue",
        strikes: `2'926`,
        percentage: "5%",
        description:
          "Les ailerons et la queue sont les parties les moins touchées par les impacts d'oiseaux.",
        color: "#00C2CB",
      },
      moteur_gauche: {
        name: "Réacteur gauche",
        strikes: `24'703`,
        percentage: "26%",
        description:
          "Le réacteur gauche est particulièrement exposé aux impacts notamment lors des phases d'approche et de décollage.",
        color: "#00C2CB",
      },
      moteur_droit: {
        name: "Réacteur droit", 
        strikes: `716`,
        percentage: "1%",
        description:
          "Le réacteur droit subit beaucoup moins d'impact que le réacteur gauche.",
        color: "#00C2CB",
      },
    };

    this.init();
  }

  init() {
    // Vider le conteneur
    this.container.innerHTML = "";

    // Utiliser D3 pour créer le titre et le sous-titre
    d3.select(this.container)
      .append("h2")
      .attr("class", "visualization-title")
      .text("Parties de l'avion touchées par les impacts");

    d3.select(this.container)
      .append("p")
      .attr("class", "visualization-subtitle")
      .text(
        "Dans cette visualisation, nous montrons les différentes parties de l'avion les plus souvent touchées par les impacts d'oiseaux."
      );

    // Créer un div pour la visualisation avec D3
    const visualizationDiv = d3
      .select(this.container)
      .append("div")
      .attr("class", "aircraft-visualization-container")
      .style("display", "flex")
      .style("justify-content", "space-between")
      .style("margin-top", "30px")
      .node();

    // Créer un conteneur pour l'avion avec D3
    const aircraftDiv = d3
      .select(visualizationDiv)
      .append("div")
      .attr("class", "aircraft-view")
      .style("width", "60%")
      .style("position", "relative")
      .style("height", "400px")
      .node();

    // Créer un panneau d'information avec D3
    const infoPanel = d3
      .select(visualizationDiv)
      .append("div")
      .attr("class", "info-panel")
      .style("width", "35%")
      .style("height", "10px")
      .style("border", "1px solid #ddd")
      .style("border-radius", "8px")
      .style("padding", "20px")
      .style("background-color", "#f9f9f9")
      .node();

    this.infoPanel = infoPanel;

    // Créer l'avion avec ses parties en SVG natif
    this.createAircraftWithSVGParts(aircraftDiv);

    // Initialiser l'info panel avec le message par défaut
    this.resetInfoPanel();
  }

  // Nouvelle méthode pour créer l'avion avec des SVG natifs
  createAircraftWithSVGParts(container) {
    // Créer un SVG conteneur principal
    const svgContainer = d3
      .select(container)
      .append("div")
      .style("width", "100%")
      .style("height", "120%")
      .style("position", "relative");

    // Créer le SVG principal
    const svg = svgContainer
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .style("position", "absolute")
      .style("top", "0")
      .style("left", "0");

    const self = this;

    // Définir les parties de l'avion avec leurs positions
    // Définir les parties de l'avion avec leurs positions
    const parts = [
      {
        id: "corps",
        name: "Corps de l'avion",
        src: svgUrls.corps,
        position: { x: 46, y: -105.5 },
        scale: 1,
        zIndex: 2,
      },
      {
        id: "aile_gauche",
        name: "Aile gauche",
        src: svgUrls.aileGauche,
        position: { x: -139.5, y: -30 },
        scale: 1,
        zIndex: 3,
      },
      {
        id: "aile_droite",
        name: "Aile droite",
        src: svgUrls.aileDroite,
        position: { x: 105, y: -30 },
        scale: 1,
        zIndex: 3,
      },
      {
        id: "moteur_gauche",
        name: "Moteur gauche",
        src: svgUrls.moteurGauche,
        position: { x: -52, y: -22 },
        scale: 0.8,
        zIndex: 4,
      },
      {
        id: "moteur_droit",
        name: "Moteur droit",
        src: svgUrls.moteurDroit,
        position: { x: 146, y: -21 },
        scale: 0.8,
        zIndex: 4,
      },
      {
        id: "nez",
        name: "Nez",
        src: svgUrls.nez,
        position: { x: 50, y:-159.8 },
        scale: 1,
        zIndex: 3,
      },
      {
        id: "aileronsQueues",
        name: "Ailerons et queue",
        src: svgUrls.aileronsQueues,
        position: { x: 8, y: 125.2 },
        scale: 1,
        zIndex: 3,
      },
    ];

    // Créer un groupe SVG pour centrer l'avion
    const aircraftGroup = svg
      .append("g")
      .attr("transform", "translate(250, 200)"); // Valeurs fixes au lieu de pourcentages

    // Charger tous les SVG et les ajouter au conteneur
    Promise.all(
      parts.map((part) => {
        return fetch(part.src)
          .then((response) => response.text())
          .then((svgText) => {
            // Parser le SVG
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgText, "image/svg+xml");

            // Extraire le viewBox pour le scaling
            const originalSvg = svgDoc.querySelector("svg");
            const viewBox =
              originalSvg.getAttribute("viewBox") || "0 0 100 100";

            // Créer un groupe pour cette partie
            const partGroup = aircraftGroup
              .append("g")
              .attr("id", `part-${part.id}`)
              .attr("class", "aircraft-part")
              .attr("data-part", part.id)
              .style("cursor", "pointer")
              .attr("fill", "rgba(228, 227, 227, 0.9)") // Couleur
              .attr("stroke", "rgba(0, 0, 0, 0.2)") // Couleur des bordures
              .attr(
                "transform",
                `translate(${part.position.x}, ${part.position.y}) scale(${part.scale})`
              )
              .style("transition", "all 0.3s ease");

            // Extraire tous les éléments du SVG (chemins, polygones, etc.)
            const elements = svgDoc.querySelectorAll(
              "path, polygon, rect, circle, ellipse, line, polyline"
            );

            // Ajouter chaque élément au groupe
            elements.forEach((el) => {
              // Cloner l'élément
              const clonedNode = document.importNode(el, true);

              // Ajouter au groupe SVG
              partGroup.node().appendChild(clonedNode);
            });

            // Ajouter les événements d'interaction
            partGroup
              .on("mouseenter", function () {
                const partId = d3.select(this).attr("data-part");

                if (!partId || !self.damageData[partId]) return;

                self.selectedPart = partId;
                self.updateInfoPanel(partId);

                // Mettre en évidence la partie survolée
                d3.selectAll(".aircraft-part").each(function () {
                  const thisPart = d3.select(this);
                  if (thisPart.attr("data-part") === partId) {
                    thisPart.style("opacity", 1);
                    thisPart.style(
                      "filter",
                      `drop-shadow(0 0 5px ${self.damageData[partId].color})`
                    );
                  } else {
                    thisPart.style("opacity", 0.3);
                  }
                });
              })
              .on("mouseleave", function () {
                const partId = d3.select(this).attr("data-part");

                self.selectedPart = null;
                self.resetInfoPanel();

                // Réinitialiser toutes les parties
                d3.selectAll(".aircraft-part")
                  .style("opacity", 0.7)
                  .style("filter", null);
              });

            return partGroup;
          })
          .catch((error) => {
            console.error(
              `Erreur lors du chargement du SVG ${part.id}:`,
              error
            );
          }); 
      })
    ).then(() => {
      // Ordonner les parties par z-index
      svg.selectAll(".aircraft-part").sort((a, b) => {
        const partA = parts.find(
          (p) => p.id === d3.select(a).attr("data-part")
        );
        const partB = parts.find(
          (p) => p.id === d3.select(b).attr("data-part")
        );
        return partA.zIndex - partB.zIndex;
      });
    });
  }

  updateInfoPanel(partId) {
    // Utiliser D3 pour mettre à jour le panneau d'information
    const data = this.damageData[partId];

    // Vider le panneau
    d3.select(this.infoPanel).html("");


    // Ajouter le titre
    d3.select(this.infoPanel)
      .append("h3")
      .text(data.name);

    // Ajouter les statistiques dans un conteneur dédié
    const stats = d3.select(this.infoPanel)
      .append("div")
      .attr("class", "stats-container");

    stats.append("p")
      .html(`<strong>Nombre d'impacts:</strong> ${data.strikes}`);

    stats.append("p")
      .html(`<strong>Pourcentage:</strong> ${data.percentage}`);

    // Ajouter la description dans un conteneur avec hauteur fixe
    d3.select(this.infoPanel)
      .append("div")
      .attr("class", "description-container")
      .append("p")
      .style("line-height", "1.4")
      .style("color", "#555")
      .text(data.description);
  }

  resetInfoPanel() {
    // Utiliser D3 pour réinitialiser le panneau d'information
    d3.select(this.infoPanel).html("");

    // Créer un conteneur avec une position stable
    d3.select(this.infoPanel)
      .append("div")
      .attr("class", "default-info")
      .style("display", "flex")
      .style("height", "100%")
      .style("align-items", "center") // Garde le centrage pour le message par défaut
      .style("justify-content", "center")
      .style("padding-top", "30px") // Ajout d'un padding en haut pour compenser la position
      .style("color", "#7f8c8d")
      .style("text-align", "center")
      .append("p")
      .text("Passez votre souris sur une partie de l'avion pour voir les détails des impacts.");
  }
}

export default AircraftDamages;
