import * as d3 from "d3";

// Intégration directe des SVG en tant que chaînes de caractères
const CLOUD_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 413.19 353.07">
  <path fill="#e8e8e8" d="M.28,222.05c.28-3.22,1.49-8.52,2.32-11.81,5.83-23.36,21.93-40.82,43.28-51.16-2.3-70.29,58.08-124.49,128.02-111.18,26.25,5,48.05,19.79,64.98,40,11.64-4.25,22.7-10.18,35.34-11.18,50.08-3.97,92.17,31.7,93.57,82.35,72.15,32.74,54.19,140.12-24.97,146.97l-98.03-.07c-1.86-14.54-10.42-27.96-22.52-36-3.95-2.62-11.31-4.96-13.88-7.11-2.05-1.71-3.13-5.26-4.79-7.32-10.41-12.94-24.22-22.56-40.97-25.21-4.13-.65-10.29-.24-14.11-1.22-2.08-.53-11.8-7.84-16.18-9.64-32.48-13.36-68.93.53-82.43,33.26-1.16,2.82-2.71,10.47-4.07,12.08s-8.71,5.23-11.26,7.3c-4.27,3.48-7.57,8.11-11.34,12.08l-8.3-9.42c-6.88-9.93-13.46-25.37-14.67-37.4-.41-4.01-.35-11.29,0-15.34Z"/>
  <path fill="#e8e8e8" d="M139.59,242.51c.98.86,1.58,3.25,3.2,3.56,16.83-3.8,35.01,2.01,45.91,15.53,2.42,3,6.72,12.82,8.02,13.78,1.7,1.26,9.7,2.9,13.1,4.65,34.23,17.66,21.67,71.34-17.06,72.05-40.84-2.52-85.5,3.25-125.9-.05-44.51-3.63-48.18-64.71-5.61-75.03.46-42.13,46.38-62.44,78.34-34.49Z"/>
  <path fill="#e8e8e8" d="M307.41,12.4c.99.88,2.43,4.14,3.9,4.29,22.1-6.12,46.13,7.48,53.03,29.18,30.2,4.35,44.72,38.88,24.02,62.71-1.92,2.2-12.82,11.8-15.24,10.06-21.56-47.91-81.25-71.59-129.45-48.52-7.47-7.15-15.08-14.2-23.91-19.66l9.53-2.97c1.16-9.71,2.2-18.29,7.56-26.76,15.57-24.61,49.39-27.23,70.58-8.34Z"/>
</svg>`;

const PLANE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 469.77 179.08">
  <path d="M438.79,145.3c-5.18-.1-11.26.5-16.2-1.3-4.67-1.7-8.58-8.65-13.26-8.75-7.53-.15-19.82,3.24-28.05,4.05-25.97,2.53-56,4.63-81.98,2.99-11.98-.76-22.47-1.06-34.1-1.66-9.62-.5-12.1-.14-22.88-.29-10.16-.14-21.44-.15-31.53-1.03-.28,1.89,8.35,2.62,6,4.98l-16.8,3.21-1.2,4.79c1.25,1.11,11.09-3.17,9.98.49l-14.47,25.53c-2.17,1.95-19.67-.19-22.09-1.94-2.7-1.96-7.78-16.25-10.1-16.97-1.22-.38-6.24.72-7.29,1.44-3.42,2.34-.05,5.7-9.5,6.5-5.21.44-15.53-.47-20.91-1.16-3.75-.48-16.45-2.77-18.92-4.81-3.9-3.22-2.95-19.45-1.19-24.05,4.57-11.94,15.78-4.85,24.99-6.81l22.5,3.79c-.71-1.14-.83-3.1-1.54-3.96-1.01-1.23-26.85-9.14-30.22-9.78-25.69-4.83-53.51-4.49-79.45-10.55-7.99-1.87-35.07-10.38-39.01-16.98-6.44-10.77,8.65-14.21,14.58-17.87,3.87-2.39,6.21-6.07,11.29-8.71,12.1-6.29,31.28-5.78,44.9-5.18,47.05,2.06,95.54,12.96,142.74,14.81l101.08-50.91c7.12-5.95,13.39-18.36,20.08-23.92,2.1-1.74,1.54-1.37,4.88-.5l1.71.46c.27.07.39.38.25.62-7.06,11.65-11.38,24.27-21.8,33.45-3.8,3.35-25.63,17.86-26.46,19.54-1.28,2.57,9.04,3,7.99,6.49h-16.5c-1.54,0-15.82,11.76-18.49,13.51-.41,2.01.47,1.22,1.27,1.7,2.22,1.33,5.08,2.67,7.72,2.79-1.06,2.84-5.75,2.12-8.54,2.03-2.49-.09-10.11-3.16-9.45.96,13.81.84,27.64,2.43,41.37,4.13,17.31,2.14,37.34,6.64,54.14,7.86,13.59.99,18.63-1.98,28.5-10.47,19.17-16.5,35.65-38.4,55.41-54.59,3.47-1.49,20.81-.31,23.6,1.58s-16.6,55.38-17.01,62.49c7.92-2.6,16.58-9.53,24.97-4.49l-22.97,21.01c-.45,2.29,1,1.24,2.35,1.61,3.64.99,18.52,3.57,19.49,6.54.57,1.74.14,5.75-1.12,7.08-3.68,3.91-22.93,4.47-28.74,6.25v14Z"/>
</svg>`;

// Convertir les SVG en URI data pour les utiliser dans les éléments image
const cloudSvgUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(CLOUD_SVG);
const planeSvgUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(PLANE_SVG);

console.log("SVG intégrés directement en URI data");

export default class BirdStrikePeriods {
  constructor(container) {
    this.container = container;
    this.periods = {
      dawn: { color: "#9393DC", label: "Aube", percent: 2, icon: "◐" },
      day: { color: "#FFE658", label: "Jour", percent: 36, icon: "☀" },
      dusk: { color: "#FF8158", label: "Crépuscule", percent: 44, icon: "◓" },
      night: { color: "#273A6C", label: "Nuit", percent: 18, icon: "☾" },
    };
    this.width = 800;
    this.height = 500;
    this.activeIndex = 0;
    
    // Stockage des URLs SVG en Data URI
    this.cloudSvgUrl = cloudSvgUrl;
    this.planeSvgUrl = planeSvgUrl;
    
    this.init();
  }

  init() {
    this.createLayout();
    this.createScene();
    this.createButtons();
    this.setActivePeriod('night');
  }

  createLayout() {
    // Create content container with flex layout
    this.contentContainer = d3.select(this.container)
      .append('div')
      .attr('class', 'content-container')
      .style('display', 'flex')
      .style('flex-direction', 'row')
      .style('height', '100%')
      .style('margin-bottom', '0');
    
    // Add left panel for title and text
    this.leftPanel = this.contentContainer.append('div')
      .attr('class', 'left-panel')
      .style('width', '30%')
      .style('padding', '40px 20px');
    
    // Add title section
    this.leftPanel.append('h2')
      .attr('class', 'title')
      .text('Impacts selon les périodes de la journée');
    
    this.leftPanel.append('p')
      .attr('class', 'description')
      .text('Ce visuel représente le pourcentage des impacts dû au oiseaux selon les différentes périodes du jour. Nous avons l`aube, la journée, le crépuscule et la nuit".');

    // Add debug info for SVG paths if needed
    this.leftPanel.append('div')
      .attr('class', 'debug-info')
      .style('font-size', '12px')
      .style('color', '#999')
      .style('margin-top', '20px')
      .style('display', 'none'); // Hidden by default
    
    // Add right panel for visualization
    this.rightPanel = this.contentContainer.append('div')
      .attr('class', 'right-panel')
      .style('width', '70%');
    
    // Create SVG in right panel
    this.svg = this.rightPanel.append('svg')
      .attr('width', '100%')
      .attr('height', this.height)
      .attr('class', 'birdstrike-scene');
    
    // Add background
    this.background = this.svg
      .append('rect')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('fill', this.periods.night.color);
    
    // Add percentage display
    this.percentDisplay = this.svg.append('text')
      .attr('class', 'percent-display')
      .attr('x', '50%')
      .attr('y', this.height / 2 + 40)
      .attr('font-size', '160px')
      .attr('fill', 'rgba(255, 255, 255, 0.5)')
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'bold')
      .text('18%');
  }

  createButtons() {
    // Create a separate div for buttons to ensure it's outside the content flow
    const buttonsOuterContainer = d3.select(this.container)
      .append('div')
      .attr('class', 'period-buttons-container')
      .style('text-align', 'center')
      .style('width', '70%')
      .style('position', 'relative')
      .style('margin-top', '15px')
      .style('margin-left', 'auto');
    
    // Create buttons container 
    const buttonContainer = buttonsOuterContainer
      .append('div')
      .attr('class', 'period-buttons')
      .style('display', 'inline-flex')
      .style('justify-content', 'center')
      .style('gap', '15px')
      .style('margin', '0 auto');

    // Create buttons for each period
    Object.entries(this.periods).forEach(([period, data]) => {
      // Create wrapper for consistent spacing
      const button = buttonContainer
        .append('div')
        .attr('class', 'period-button-wrapper');
      
      // Create the actual button with icon and label
      button.append('button')
        .attr('class', 'period-button')
        .attr('data-period', period)
        .html(`<span class="period-icon ${period}-icon">${data.icon}</span><span>${data.label}</span>`)
        .style('background-color', 'white')
        .style('color', 'black')
        .on('click', () => this.updatePeriod(period));
    });
  }

  createScene() {
    // Calculate center point
    const centerX = parseInt(this.svg.style('width')) / 2 || this.width / 2;
    const centerY = this.height / 2;
    
    // Main scene container
    this.sceneGroup = this.svg.append('g')
      .attr('class', 'scene-group')
      .attr('transform', `translate(${centerX}, ${centerY})`);
    
    // Create cloud group with airplane
    const cloudPlaneGroup = this.sceneGroup.append('g')
      .attr('class', 'cloud-plane-group');
    
    // Try all possible SVG paths
    this.tryCreateSVGElements(cloudPlaneGroup);
  }
  
  tryCreateSVGElements(cloudPlaneGroup) {
    // First try with direct elements (fallback if SVG doesn't load)
    this.createFallbackElements(cloudPlaneGroup);
    
    // Utilisons directement les URLs importées
    const cloudUrl = this.cloudSvgUrl;
    const planeUrl = this.planeSvgUrl;
    
    console.log("Utilisation des URLs importées:", { cloudUrl, planeUrl });
    
    try {
      // Far left cloud - écarté davantage vers la gauche
      const farLeftCloud = cloudPlaneGroup.append('image')
        .attr('href', cloudUrl)
        .attr('width', 320)  // Augmenté de 260 à 320
        .attr('height', 240) // Augmenté de 195 à 240
        .attr('x', -550)     // Ajusté pour le centrage
        .attr('y', -180)     // Ajusté pour le centrage
        .attr('class', 'cloud far-left-cloud')
        .style('opacity', 0.75);
      
      // Left cloud - principal nuage à gauche, écarté du premier
      const leftCloud = cloudPlaneGroup.append('image')
        .attr('href', cloudUrl)
        .attr('width', 450)  // Augmenté de 380 à 450
        .attr('height', 380) // Augmenté de 320 à 380
        .attr('x', -390)     // Ajusté pour le centrage
        .attr('y', -220)     // Ajusté pour le centrage
        .attr('class', 'cloud left-cloud')
        .style('opacity', 0.9);
      
      // Airplane - positionné au centre et orienté vers la droite - AGRANDI ENCORE PLUS
      const airplane = cloudPlaneGroup.append('image')
        .attr('href', planeUrl)
        .attr('width', 320)  // Augmenté de 260 à 320
        .attr('height', 120) // Augmenté de 98 à 120
        .attr('x', -160)     // Ajusté pour le centrage
        .attr('y', -38)      // Ajusté pour l'alignement vertical
        .attr('class', 'airplane')
        // Orienté vers la droite (symétrie horizontale)
        .style('transform', 'scaleX(-1)');
      
      // Right cloud - principal nuage à droite
      const rightCloud = cloudPlaneGroup.append('image')
        .attr('href', cloudUrl)
        .attr('width', 480)  // Augmenté de 400 à 480
        .attr('height', 380) // Augmenté de 320 à 380
        .attr('x', 160)      // Ajusté pour le centrage
        .attr('y', -140)     // Ajusté pour le centrage
        .attr('class', 'cloud right-cloud')
        .style('opacity', 0.9);
        
      // Far right cloud
      const farRightCloud = cloudPlaneGroup.append('image')
        .attr('href', cloudUrl)
        .attr('width', 320)  // Augmenté de 260 à 320
        .attr('height', 240) // Augmenté de 195 à 240
        .attr('x', 380)      // Ajusté pour le centrage
        .attr('y', -80)      // Ajusté pour le centrage
        .attr('class', 'cloud far-right-cloud')
        .style('opacity', 0.75);
      
      // Vérification si les éléments ont été créés correctement
      const allElements = [farLeftCloud, leftCloud, airplane, rightCloud, farRightCloud];
      const svgCreated = allElements.every(el => el && !el.empty());
      
      if (svgCreated) {
        console.log("SVGs créés avec succès");
        // Masquer les éléments de secours
        d3.selectAll('.fallback-element').style('display', 'none');
      } else {
        console.error("Erreur lors de la création des SVGs");
        // Afficher les éléments de secours
        d3.selectAll('.fallback-element').style('display', 'block');
      }
      
    } catch (error) {
      console.error("Erreur lors de la création des SVGs:", error);
      // Afficher les éléments de secours en cas d'erreur
      d3.selectAll('.fallback-element').style('display', 'block');
      
      // Afficher l'erreur dans le panneau de débogage
      d3.select('.debug-info')
        .style('display', 'block')
        .html(`<p>Erreur lors du chargement des SVGs: ${error.message}</p>`);
    }
  }
  
  createFallbackElements(cloudPlaneGroup) {
    // Far left cloud fallback
    cloudPlaneGroup.append('ellipse')
      .attr('cx', -520)
      .attr('cy', -50)
      .attr('rx', 135)
      .attr('ry', 95)
      .attr('fill', '#E0E0E0')
      .attr('class', 'fallback-element')
      .style('display', 'none');
    
    // Cloud fallback (left)
    cloudPlaneGroup.append('ellipse')
      .attr('cx', -360)
      .attr('cy', -60)
      .attr('rx', 160)
      .attr('ry', 110)
      .attr('fill', '#E0E0E0')
      .attr('class', 'fallback-element')
      .style('display', 'none');
    
    // Airplane fallback - agrandi encore davantage
    cloudPlaneGroup.append('path')
      .attr('d', 'M0,0 L65,20 L50,0 L65,-20 Z')
      .attr('fill', 'black')
      .attr('class', 'fallback-element')
      .style('display', 'none');
    
    // Cloud fallback (right)
    cloudPlaneGroup.append('ellipse')
      .attr('cx', 200)
      .attr('cy', -40)
      .attr('rx', 160)
      .attr('ry', 110)
      .attr('fill', '#E0E0E0')
      .attr('class', 'fallback-element')
      .style('display', 'none');
      
    // Far right cloud fallback
    cloudPlaneGroup.append('ellipse')
      .attr('cx', 420)
      .attr('cy', -20)
      .attr('rx', 135)
      .attr('ry', 95)
      .attr('fill', '#E0E0E0')
      .attr('class', 'fallback-element')
      .style('display', 'none');
  }

  getCloudHorizontalOffset(period) {
    // Different horizontal offsets for each period - progression logique dawn → night
    const offsets = {
      dawn: -60,    // Position la plus à gauche au matin
      day: -20,     // Avancée vers la droite le jour
      dusk: 20,     // Encore plus à droite au crépuscule
      night: 60     // Position la plus à droite la nuit
    };
    return offsets[period] || 0;
  }

  getCloudOffset(period) {
    // Different vertical offsets for each period - progression logique dawn → night
    const offsets = {
      dawn: -40,    // Position haute le matin
      day: -10,     // Descend un peu le jour
      dusk: 10,     // Descend encore au crépuscule
      night: 30     // Position la plus basse la nuit
    };
    return offsets[period] || 0;
  }
  
  getCloudScale(period) {
    // Taille constante pour tous les périodes
    return 1.0;
  }
  
  getCloudOpacity(period) {
    // Different opacities for each period - progression logique dawn → night
    const opacities = {
      dawn: 0.8,    // Assez visible mais pas totalement le matin
      day: 0.95,    // Très visible le jour
      dusk: 0.9,    // Légèrement moins visible au crépuscule
      night: 0.7    // Le moins visible la nuit
    };
    return opacities[period] || 0.7;
  }
  
  getPlaneRotation(period) {
    // Different rotations for the plane depending on period - progression logique dawn → night
    const rotations = {
      dawn: -12,    // Ascension le matin
      day: -3,      // Presque horizontal le jour
      dusk: 6,      // Légère descente au crépuscule
      night: 15     // Descente plus prononcée la nuit
    };
    return rotations[period] || 0;
  }

  updatePeriod(period) {
    const previousPeriod = this.currentPeriod;
    this.currentPeriod = period;
    
    // Background transition
    this.background
      .transition()
      .duration(1000)
      .attr('fill', this.periods[period].color);

    // Update percentage display
    this.percentDisplay
      .transition()
      .duration(1000)
      .text(`${this.periods[period].percent}%`);

    // Update button styles
    d3.selectAll('.period-button')
      .classed('active', false);
    d3.select(`[data-period="${period}"]`)
      .classed('active', true);
    
    // Animate the cloud-plane group with both vertical and horizontal movement
    // mais en gardant une échelle constante (1.0)
    const cloudPlaneGroup = d3.select('.cloud-plane-group');
    
    cloudPlaneGroup
      .transition()
      .duration(1000)
      .attr('transform', `translate(${this.getCloudHorizontalOffset(period)}, ${this.getCloudOffset(period)})`)
      .style('opacity', this.getCloudOpacity(period));
      
    // Animate the airplane specific rotation
    d3.selectAll('.airplane')
      .transition()
      .duration(1000)
      .attr('transform', `rotate(${this.getPlaneRotation(period)})`);
      
    // Nuages individuels - animations légèrement différentes pour plus de dynamisme
    const cloudIndices = {
      'far-left-cloud': 0,
      'left-cloud': 1,
      'right-cloud': 2,
      'far-right-cloud': 3
    };
    
    // Animer chaque nuage avec un délai et une amplitude légèrement différents
    // mais sans changer leur taille
    Object.entries(cloudIndices).forEach(([cloudClass, index]) => {
      const delay = index * 150; // Délai progressif
      const extraVerticalOffset = (period === 'dawn' || period === 'day') ? -5 * index : 3 * index;
      const extraHorizontalOffset = (period === 'dawn' || period === 'day') ? -3 * index : 3 * index;
      
      d3.select(`.${cloudClass}`)
        .transition()
        .delay(delay)
        .duration(1200)
        .attr('transform', `translate(${extraHorizontalOffset}, ${extraVerticalOffset})`)
        .style('opacity', this.getCloudOpacity(period) - (index * 0.05));
    });
      
    // Animate fallback elements too
    d3.selectAll('.fallback-element ellipse')
      .transition()
      .duration(1000)
      .style('opacity', this.getCloudOpacity(period));
  }

  setActivePeriod(period) {
    if (this.periods[period]) {
      this.currentPeriod = period;
      
      this.background
        .attr('fill', this.periods[period].color);
      
      this.percentDisplay
        .text(`${this.periods[period].percent}%`);
      
      d3.selectAll('.period-button')
        .classed('active', false);
      d3.select(`[data-period="${period}"]`)
        .classed('active', true);
        
      // Set initial position for cloud-plane group with horizontal offset
      // mais sans échelle (taille constante)
      const cloudPlaneGroup = d3.select('.cloud-plane-group');
      
      cloudPlaneGroup
        .attr('transform', `translate(${this.getCloudHorizontalOffset(period)}, ${this.getCloudOffset(period)})`)
        .style('opacity', this.getCloudOpacity(period));
        
      // Set initial rotation for airplane
      d3.selectAll('.airplane')
        .attr('transform', `rotate(${this.getPlaneRotation(period)})`);
      
      // Position initiale des nuages individuels
      const cloudIndices = {
        'far-left-cloud': 0,
        'left-cloud': 1,
        'right-cloud': 2,
        'far-right-cloud': 3
      };
      
      Object.entries(cloudIndices).forEach(([cloudClass, index]) => {
        const extraVerticalOffset = (period === 'dawn' || period === 'day') ? -5 * index : 3 * index;
        const extraHorizontalOffset = (period === 'dawn' || period === 'day') ? -3 * index : 3 * index;
        
        d3.select(`.${cloudClass}`)
          .attr('transform', `translate(${extraHorizontalOffset}, ${extraVerticalOffset})`)
          .style('opacity', this.getCloudOpacity(period) - (index * 0.05));
      });
      
      // Set initial opacity for fallback elements
      d3.selectAll('.fallback-element ellipse')
        .style('opacity', this.getCloudOpacity(period));
        
      // Set fallback airplane rotation
      d3.selectAll('.fallback-element path')
        .attr('transform', `rotate(${this.getPlaneRotation(period)})`);
    }
  }
} 