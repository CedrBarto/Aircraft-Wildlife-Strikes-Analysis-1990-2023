import * as d3 from 'd3';

const svgUrls = {
  aileGauche: new URL('../../public/assets/svg/aile_gauche_avion.svg', import.meta.url).href,
  aileDroite: new URL('../../public/assets/svg/aile_droite_avion.svg', import.meta.url).href,
  corps: new URL('../../public/assets/svg/corps_avion.svg', import.meta.url).href,
  nez: new URL('../../public/assets/svg/nez_avion.svg', import.meta.url).href,
  aileronsQueues: new URL('../../public/assets/svg/aileronsQueues_avion.svg', import.meta.url).href
};

class AircraftDamages {
  constructor(container) {
    this.container = container;
    this.selectedPart = null;
    
    // Données simulées sur les dommages par partie d'avion
    this.damageData = {
      'aile_gauche': {
        name: 'Aile gauche',
        strikes: 2345,
        percentage: '23%',
        description: "L'aile gauche est particulièrement vulnérable lors du décollage et de l'atterrissage.",
        color: '#4287f5'
      },
      'aile_droite': {
        name: 'Aile droite',
        strikes: 2256,
        percentage: '22%',
        description: "L'aile droite subit des impacts similaires à l'aile gauche.",
        color: '#4287f5'
      },
      'corps': {
        name: 'Corps de l\'avion',
        strikes: 1547,
        percentage: '15%',
        description: "Le fuselage est moins touché que les autres parties.",
        color: '#42b9f5'
      },
      // Temporairement retiré
      /*'moteur': {
        name: 'Moteurs',
        strikes: 3126,
        percentage: '30%',
        description: "Les moteurs sont les parties les plus fréquemment touchées, avec des conséquences potentiellement graves.",
        color: '#f54242'
      },*/
      'nez': {
        name: 'Nez',
        strikes: 872,
        percentage: '8%',
        description: "Le nez de l'avion, y compris le radar et les capteurs, est vulnérable aux impacts directs.",
        color: '#42c9f5'
      },
      'aileronsQueues': {
        name: 'Ailerons et queue',
        strikes: 210,
        percentage: '2%',
        description: "Les ailerons et la queue sont les parties les moins touchées par les impacts d'oiseaux.",
        color: '#42f59e'
      }
    };
    
    this.init();
  }

  init() {
    // Reste du code inchangé...
    // Vider le conteneur avant de créer l'interface
    this.container.innerHTML = '';
    
    // Créer un en-tête pour la visualisation avec D3
    d3.select(this.container)
      .append('h2')
      .attr('class', 'visualization-title')
      .text('Parties de l\'avion touchées par les impacts');
      
    d3.select(this.container)
      .append('p')
      .attr('class', 'visualization-subtitle')
      .text('Survolez les différentes parties de l\'avion pour voir les détails des impacts.');
    
    // Créer un div pour la visualisation
    const visualizationDiv = d3.select(this.container)
      .append('div')
      .attr('class', 'aircraft-visualization-container')
      .style('display', 'flex')
      .style('justify-content', 'space-between')
      .style('margin-top', '30px')
      .node();
    
    // Créer un conteneur pour l'avion
    const aircraftDiv = d3.select(visualizationDiv)
      .append('div')
      .attr('class', 'aircraft-view')
      .style('width', '60%')
      .style('position', 'relative')
      .style('height', '400px')
      .node();
    
    // Créer un panneau d'information
    const infoPanel = d3.select(visualizationDiv)
      .append('div')
      .attr('class', 'info-panel')
      .style('width', '35%')
      .style('border', '1px solid #ddd')
      .style('border-radius', '8px')
      .style('padding', '20px')
      .style('background-color', '#f9f9f9')
      .node();
    
    // Sauvegarder une référence au panneau d'information
    this.infoPanel = infoPanel;
    
    // Créer l'avion avec ses parties
    this.createAircraftWithParts(aircraftDiv);
    
    // Charger les images puis configurer les événements
    this.loadImages().then(() => {
      this.setupEvents();
      console.log("Événements configurés pour l'avion");
    });
  }

  loadImages() {
    console.log("Chargement des images SVG...");
    
    // Charger toutes les images SVG avant de configurer les événements
    const imagePromises = Object.values(svgUrls).map(url => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          console.log(`Image chargée: ${url}`);
          resolve();
        };
        img.onerror = () => {
          console.error(`Erreur de chargement de l'image: ${url}`);
          resolve(); // Résoudre quand même pour ne pas bloquer
        };
        img.src = url;
      });
    });
    
    return Promise.all(imagePromises);
  }

  createAircraftWithParts(container) {
    // Créer les calques pour l'avion
    // 1. Calque de fond (grisé)
    const backgroundLayer = document.createElement('div');
    backgroundLayer.style.position = 'absolute';
    backgroundLayer.style.top = '0';
    backgroundLayer.style.left = '0';
    backgroundLayer.style.width = '100%';
    backgroundLayer.style.height = '100%';
    backgroundLayer.style.zIndex = '1';
    
    // 2. Calque pour les parties interactives
    const partsLayer = document.createElement('div');
    partsLayer.style.position = 'absolute';
    partsLayer.style.top = '0';
    partsLayer.style.left = '0';
    partsLayer.style.width = '100%';
    partsLayer.style.height = '100%';
    partsLayer.style.zIndex = '2';
    
    // Définir les parties de l'avion et leurs propriétés - Sans le moteur temporairement
    const parts = [
      {
        id: 'corps',
        name: 'Corps de l\'avion',
        src: svgUrls.corps,
        style: {
          position: 'absolute',
          top: '12.8%',
          left: '0%',
          width: '100%',
          height: '56%',
          objectFit: 'contain',
          cursor: 'pointer',
          zIndex: '2'
        },
        // Ajout d'une zone de détection spécifique
        hitArea: {
          top: '20%',
          left: '35%',
          width: '30%', 
          height: '40%'
        }
      },
      {
        id: 'aile_gauche',
        name: 'Aile gauche',
        src: svgUrls.aileGauche,
        style: {
          position: 'absolute',
          top: '31%',
          left: '-13%',
          width: '100%',
          height: '37%',
          objectFit: 'contain',
          cursor: 'pointer',
          zIndex: '3'
        },
        // Zone de détection plus précise pour l'aile gauche
        hitArea: {
          top: '38%',
          left: '5%',
          width: '30%',
          height: '20%'
        }
      },
      {
        id: 'aile_droite',
        name: 'Aile droite',
        src: svgUrls.aileDroite,
        style: {
          position: 'absolute',
          top: '31%',
          left: '13%',
          width: '100%',
          height: '37%',
          objectFit: 'contain',
          cursor: 'pointer',
          zIndex: '3'
        },
        // Zone de détection plus précise pour l'aile droite
        hitArea: {
          top: '38%', 
          right: '5%',
          width: '30%',
          height: '20%'
        }
      },
      {
        id: 'nez',
        name: 'Nez',
        src: svgUrls.nez,
        style: {
          position: 'absolute',
          top: '1%',
          left: '0%',
          width: '100%',
          height: '16.8%',
          objectFit: 'contain',
          cursor: 'pointer',
          zIndex: '3'
        },
        // Zone de détection déjà bien placée, maintenue
        hitArea: {
          top: '3%',
          left: '47%',
          width: '7%',
          height: '15%'
        }
      },
      // Moteur temporairement retiré
      {
        id: 'aileronsQueues',
        name: 'Ailerons et queue',
        src: svgUrls.aileronsQueues,
        style: {
          position: 'absolute',
          top: '63%',
          left: '-0.2%',
          width: '100%',
          height: '33%',
          objectFit: 'contain',
          cursor: 'pointer',
          zIndex: '3'
        },
        // Zone de détection déjà bien placée, maintenue
        hitArea: {
          top: '65%',
          left: '47%',
          width: '6%',
          height: '25%'
        }
      }
    ];
    
    // Créer chaque partie de l'avion avec sa zone cliquable
    parts.forEach(part => {
      // Conteneur pour l'image SVG
      const partContainer = document.createElement('div');
      partContainer.className = 'aircraft-part-container';
      partContainer.style.position = 'absolute';
      partContainer.style.top = '0';
      partContainer.style.left = '0';
      partContainer.style.width = '100%';
      partContainer.style.height = '100%';
      partContainer.style.zIndex = part.style.zIndex;
      partContainer.style.pointerEvents = 'none';
      
      // Image SVG
      const partImg = document.createElement('img');
      partImg.className = 'aircraft-part';
      partImg.id = `part-${part.id}`;
      partImg.src = part.src;
      partImg.alt = part.name;
      partImg.setAttribute('data-part', part.id);
      
      // Appliquer les styles
      Object.entries(part.style).forEach(([property, value]) => {
        partImg.style[property] = value;
      });
      
      // Styles supplémentaires pour les parties
      partImg.style.transition = 'all 0.3s ease';
      partImg.style.opacity = '0.7';
      partImg.style.pointerEvents = 'none'; // L'image ne reçoit pas d'événements
      
      // Ajouter l'image au conteneur
      partContainer.appendChild(partImg);
      
      // Créer une zone cliquable (hit area) pour chaque partie
      if (part.hitArea) {
        const hitArea = document.createElement('div');
        hitArea.className = 'hit-area';
        hitArea.setAttribute('data-target', part.id);
        hitArea.style.position = 'absolute';
        hitArea.style.top = part.hitArea.top;
        hitArea.style.left = part.hitArea.left;
        hitArea.style.right = part.hitArea.right || 'auto';
        hitArea.style.width = part.hitArea.width;
        hitArea.style.height = part.hitArea.height;
        hitArea.style.cursor = 'pointer';
        hitArea.style.zIndex = '10'; // Au-dessus des images
        hitArea.style.pointerEvents = 'auto'; // Reçoit les événements
        
        // Pour le débogage, décommentez cette ligne
        // hitArea.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
        
        // Ajouter la zone cliquable au document
        partsLayer.appendChild(hitArea);
      }
      
      // Ajouter le conteneur de l'image
      partsLayer.appendChild(partContainer);
    });
    
    // Ajouter les calques au conteneur
    container.appendChild(backgroundLayer);
    container.appendChild(partsLayer);
  }

  setupEvents() {
    const self = this;
    console.log("Configuration des événements...");
    
    // Au lieu d'ajouter des événements aux images, les ajouter aux zones cliquables
    const hitAreas = document.querySelectorAll('.hit-area');
    console.log(`Nombre de zones cliquables trouvées: ${hitAreas.length}`);
    
    hitAreas.forEach(area => {
      // Événement au survol
      area.addEventListener('mouseenter', function() {
        const targetId = this.getAttribute('data-target');
        console.log(`Survol détecté sur zone: ${targetId}`);
        
        if (!targetId || !self.damageData[targetId]) return;
        
        self.selectedPart = targetId;
        self.updateInfoPanel(targetId);
        
        // Mettre à jour l'opacité des images
        document.querySelectorAll('.aircraft-part').forEach(img => {
          const partId = img.getAttribute('data-part');
          if (partId === targetId) {
            img.style.opacity = '1'; // Image survolée
          } else {
            img.style.opacity = '0.3'; // Autres images
          }
        });
      });
      
      // Événement à la sortie
      area.addEventListener('mouseleave', function() {
        const targetId = this.getAttribute('data-target');
        console.log(`Sortie détectée sur zone: ${targetId}`);
        
        self.selectedPart = null;
        self.resetInfoPanel();
        
        // Réinitialiser l'opacité de toutes les images
        document.querySelectorAll('.aircraft-part').forEach(img => {
          img.style.opacity = '0.7';
        });
      });
    });
  }

  // Les méthodes updateInfoPanel et resetInfoPanel restent inchangées
  updateInfoPanel(partId) {
    // Utiliser D3 pour mettre à jour le panneau d'information
    const data = this.damageData[partId];
    
    // Vider le panneau
    d3.select(this.infoPanel).html("");
    
    // Ajouter l'indicateur de couleur
    d3.select(this.infoPanel)
      .append("div")
      .style("height", "10px")
      .style("background-color", data.color)
      .style("border-radius", "3px")
      .style("margin-bottom", "15px");
    
    // Ajouter le titre
    d3.select(this.infoPanel)
      .append("h3")
      .style("margin-top", "0")
      .style("color", "#2c3e50")
      .text(data.name);
    
    // Ajouter les statistiques
    const stats = d3.select(this.infoPanel)
      .append("div")
      .style("margin-bottom", "15px");
    
    stats.append("p")
      .html(`<strong>Nombre d'impacts:</strong> ${data.strikes}`);
    
    stats.append("p")
      .html(`<strong>Pourcentage:</strong> ${data.percentage}`);
    
    // Ajouter la description
    d3.select(this.infoPanel)
      .append("p")
      .style("line-height", "1.4")
      .style("color", "#555")
      .text(data.description);
  }

  resetInfoPanel() {
    // Utiliser D3 pour réinitialiser le panneau d'information
    d3.select(this.infoPanel).html("");
    
    d3.select(this.infoPanel)
      .append("div")
      .attr("class", "default-info")
      .style("display", "flex")
      .style("height", "100%")
      .style("align-items", "center")
      .style("justify-content", "center")
      .style("color", "#7f8c8d")
      .style("text-align", "center")
      .append("p")
      .text("Passez votre souris sur une partie de l'avion pour voir les détails des impacts.");
  }
}

export default AircraftDamages;