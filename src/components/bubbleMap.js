// bubbleMap.js
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

class BubbleMap {
    constructor(svgSelector, mapFile = "/assets/data/counties-albers-10m.json", dataFile = "    /assets/data/YearsAndLocation.json") {
        this.svgSelector = svgSelector;
        this.mapFile = mapFile;
        this.dataFile = dataFile;
        this.width = 960;
        this.height = 600;
        this.currentYearIndex = 0;
        this.years = [];
        this.init();
    }

    async init() {
        const svg = d3.select(this.svgSelector)
            .attr("width", this.width)
            .attr("height", this.height);

        const projection = d3.geoAlbersUsa()
            .translate([this.width / 2, this.height / 2])
            .scale(1280);

        const path = d3.geoPath().projection(projection);

        // Charger les données topo et les données des bulles
        const [topoData, data] = await Promise.all([
            d3.json(this.mapFile),
            d3.json(this.dataFile)
        ]);

        const counties = topojson.feature(topoData, topoData.objects.counties);

        // Dessiner les comtés
        svg.append("g")
            .selectAll("path")
            .data(counties.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", "#eee")
            .attr("stroke", "#888")
            .attr("stroke-width", 0.3);

        // Échelle pour la taille des bulles
        this.radius = d3.scaleSqrt()
            .domain([0, d3.max(data, d => d.valeur)])
            .range([2, 20]);

        // Récupérer les années uniques
        this.years = Array.from(new Set(data.map(d => d.annee)));

        // Démarrer l'animation
        this.animateBubbles(data, projection);
    }

    drawBubbles(data, projection, year) {
        const svg = d3.select(this.svgSelector);
        svg.selectAll(".bubble").remove(); // Supprimer les bulles existantes

        const filteredData = data.filter(d => d.annee === year);

        svg.append("g")
            .attr("class", "bubbles")
            .selectAll("circle")
            .data(filteredData)
            .enter()
            .append("circle")
            .attr("class", "bubble")
            .attr("cx", d => {
                const coords = projection([d.lon, d.lat]);
                return coords ? coords[0] : null;
            })
            .attr("cy", d => {
                const coords = projection([d.lon, d.lat]);
                return coords ? coords[1] : null;
            })
            .attr("r", d => this.radius(d.valeur))
            .attr("fill", "steelblue")
            .attr("stroke", "#fff")
            .attr("stroke-width", 0.6)
            .attr("opacity", 0.75)
            .append("title")
            .text(d => `Année: ${d.annee}\nValeur: ${d.valeur}`);
    }

    animateBubbles(data, projection) {
        this.drawBubbles(data, projection, this.years[this.currentYearIndex]);
        this.currentYearIndex = (this.currentYearIndex + 1) % this.years.length; // Passer à l'année suivante
        setTimeout(() => this.animateBubbles(data, projection), 1000); // Changer d'année toutes les secondes
    }
}

export default BubbleMap;
  

