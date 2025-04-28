class BubbleMap {
  constructor(config) {
    this.config = config;
    this.svg = null;
    this.projection = null;
    this.path = null;
    this.bubbleData = [];
    this.years = [];
    this.colorScale = null;
    this.currentYear = null; // Initialiser l'année courante
    this.yearText = null; // Élément pour afficher l'année courante
    
    this.init();
    this.startCountdown();
  }
  
  init() {
    this.createControls(); // D'abord créer les contrôles en haut
    this.createSvg(); // Ensuite créer le SVG pour la carte
    this.setupProjection();
    this.loadData();
  }

  startCountdown() {
    setInterval(() => {
      this.changeYear('next');
    }, 3500); // 5 secondes (5 000 ms)
  }

  createControls() {
    // Créer le conteneur pour les contrôles
    const controlContainer = d3.select("#bubble-map-container")
      .append("div")
      .attr("class", "controls")
      .style("margin-bottom", "15px");

    // Ajouter un conteneur pour afficher l'année courante
    this.yearText = controlContainer.append("span")
      .attr("class", "year-text")
      .style("font-size", "24px")
      .style("margin-right", "20px");

  }
  
  createSvg() {
    this.svg = d3.select("#bubble-map-container")
      .append("svg")
      .attr("width", this.config.width)
      .attr("height", this.config.height);
  }

  setupProjection() {
    this.projection = d3.geoAlbersUsa()
      .scale(1200)
      .translate([this.config.width / 2, this.config.height / 2]);
      
    this.path = d3.geoPath().projection(this.projection);
  }
  
  loadData() {
    // Charger les données et la carte en parallèle
    Promise.all([
      fetch(this.config.dataUrl)
        .then(res => {
          if (!res.ok) {
            throw new Error("Erreur lors du chargement des données JSON");
          }
          return res.json();
        }),
      d3.json(this.config.mapUrl).catch(error => {
        console.error("Erreur lors du chargement de la carte:", error);
        throw new Error("Impossible de charger la carte.");
      })
    ])
    .then(([data, us]) => {
      // Vérifiez si les données sont valides
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Les données JSON sont vides ou mal formées.");
      }
  
      this.bubbleData = data;
      this.processData();
      this.drawMap(us);
      this.currentYear = this.years[0]; // Initialiser l'année courante
      this.updateYearText(); // Afficher l'année courante
      this.drawBubbles(); // Dessiner les bulles pour l'année courante
    })
    .catch(error => {
      console.error("Erreur lors du chargement des données:", error);
      this.displayError("Erreur lors du chargement des données. Veuillez vérifier la console.");
    });
  }
  
  processData() {
    // Extraire les années uniques
    this.years = [...new Set(this.bubbleData.map(d => d.INCIDENT_YEAR))].sort();
    
    // Créer l'échelle de couleurs
    this.colorScale = d3.scaleOrdinal()
      .domain(this.years)
      .range(d3.schemeBlues[Math.max(3, this.years.length)]);
  }
  
  updateYearText() {
    // Mettre à jour le texte de l'année courante
    this.yearText.text(`Année: ${this.currentYear}`);
  }
  
  drawMap(us) {
    // Dessiner les états
    this.svg.append("g")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
      .enter().append("path")
      .attr("class", "state")
      .attr("d", this.path)
      .attr("fill", "rgba(203, 203, 203, 0.7)") // Couleur avec opacité
      .attr("stroke", "#fff"); // Couleur des bordures
    
    // Dessiner les frontières des états
    this.svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-linejoin", "round")
      .attr("d", this.path);
  }

  drawBubbles() {
    // Supprimer toutes les bulles existantes
    this.svg.selectAll(".bubble").remove();
    
    // Dessiner les nouvelles bulles
    this.svg.selectAll(".bubble")
      .data(this.bubbleData.filter(d => d.INCIDENT_YEAR === this.currentYear))
      .enter().append("circle")
      .attr("class", d => `bubble year-${d.INCIDENT_YEAR}`)
      .attr("cx", d => {
        const coords = this.projection([d.LONGITUDE, d.LATITUDE]);
        return coords ? coords[0] : null;
      })
      .attr("cy", d => {
        const coords = this.projection([d.LONGITUDE, d.LATITUDE]);
        return coords ? coords[1] : null;
      })
      .attr("r", this.config.bubbleRadius)
      .attr("fill", "skyblue")
      .append("title")
      .text(d => `Année: ${d.INCIDENT_YEAR}, Coordonnées: ${d.LATITUDE}, ${d.LONGITUDE}`);
  }
  
  changeYear(direction) {
    const currentIndex = this.years.indexOf(this.currentYear);
    if (direction === 'next') {
      this.currentYear = this.years[(currentIndex + 1) % this.years.length];
    } else {
      this.currentYear = this.years[(currentIndex - 1 + this.years.length) % this.years.length];
    }
    this.updateYearText(); // Mettre à jour le texte de l'année courante
    this.updateBubbles(); // Mettre à jour les bulles pour l'année sélectionnée
  }

  updateBubbles() {
    // Sélectionner toutes les bulles et les mettre à jour
    const bubbles = this.svg.selectAll(".bubble")
      .data(this.bubbleData.filter(d => d.INCIDENT_YEAR === this.currentYear), d => `${d.LATITUDE}-${d.LONGITUDE}`); // Utiliser une clé unique

    // Mettre à jour les bulles existantes
    bubbles
      .attr("cx", d => {
        const coords = this.projection([d.LONGITUDE, d.LATITUDE]);
        return coords ? coords[0] : null;
      })
      .attr("cy", d => {
        const coords = this.projection([d.LONGITUDE, d.LATITUDE]);
        return coords ? coords[1] : null;
      });

    // Ajouter de nouvelles bulles
    bubbles.enter().append("circle")
      .attr("class", d => `bubble year-${d.INCIDENT_YEAR}`)
      .attr("cx", d => {
        const coords = this.projection([d.LONGITUDE, d.LATITUDE]);
        return coords ? coords[0] : null;
      })
      .attr("cy", d => {
        const coords = this.projection([d.LONGITUDE, d.LATITUDE]);
        return coords ? coords[1] : null;
      })
      .attr("r", this.config.bubbleRadius)
      .attr("fill", "skyblue")
      .append("title")
      .text(d => `Année: ${d.INCIDENT_YEAR}, Coordonnées: ${d.LATITUDE}, ${d.LONGITUDE}`);

    // Supprimer les bulles qui ne correspondent pas à l'année courante
    bubbles.exit().remove();
  }
  
  displayError(message) {
    // Ajouter une méthode pour afficher les erreurs
    d3.select("#bubble-map-container")
      .append("div")
      .attr("class", "error-message")
      .style("color", "red")
      .style("font-weight", "bold")
      .text(message);
  }
}

export default BubbleMap;