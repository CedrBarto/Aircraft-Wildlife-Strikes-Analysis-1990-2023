import BirdStrikePeriods from '../components/birdStrikePeriods.js';
import Species from '../components/species.js';
import AircraftDamages from '../components/aircraftDamages.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialisation de BirdStrikePeriods
    const daytimeContainer = document.getElementById('daytime-container');
    if (daytimeContainer) {
        new BirdStrikePeriods(daytimeContainer);
    } else {
        console.error('Daytime container not found');
    }

    // Initialisation du carousel des espèces
    const speciesContainer = document.getElementById('species-container');
    if (speciesContainer) {
        new Species(speciesContainer);
    } else {
        console.error('Species container not found');
    }

    // Initialiser la visualisation des dommages d'avion
  const aircraftDamagesContainer = document.getElementById('aircraft-damages-container');
  if (aircraftDamagesContainer) {
    console.log('Initialisation de la visualisation des dommages d\'avion');
    new AircraftDamages(aircraftDamagesContainer);
  } else {
    console.error('Container aircraft-damages-container non trouvé');
  }

     // Initialiser la visualisation des dommages d'avion
     const bubbleMapContainer = document.getElementById('bubble-map-container');
     if (bubbleMapContainer) {
       console.log('Initialisation de la visualisation des dommages d\'avion');
       new BubbleMap(bubbleMapContainer);
     } else {
       console.error('Container aircraft-damages-container non trouvé');
     }


});