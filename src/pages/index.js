import BirdStrikePeriods from '../components/birdStrikePeriods.js';
import Species from '../components/species.js';
import AircraftDamages from '../components/aircraftDamages.js';
import BubbleMap  from '../components/bubbleMap.js'; // Assurez-vous que le chemin est correct



document.addEventListener('DOMContentLoaded', () => {
  const daytimeContainer = document.getElementById('daytime-container');
  if (daytimeContainer) {
      new BirdStrikePeriods(daytimeContainer);
  }

  const speciesContainer = document.getElementById('species-container');
  if (speciesContainer) {
      new Species(speciesContainer);
  }

  const aircraftDamagesContainer = document.getElementById('aircraft-damages-container');
  if (aircraftDamagesContainer) {
      new AircraftDamages(aircraftDamagesContainer);
  }

  const bubbleMapContainer = document.getElementById('bubble-map-container');
  if (bubbleMapContainer) {
      const config = {
        width: 960,
        height: 600,
        mapUrl: '/components/states-10m.json',
        dataUrl: '/components/YearsAndLocalisation.json',
        bubbleRadius: 5,
        transitionDuration: 300
      };
      new BubbleMap(config);
  }
});