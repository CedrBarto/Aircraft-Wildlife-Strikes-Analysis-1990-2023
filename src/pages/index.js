import BirdStrikePeriods from '../components/birdStrikePeriods.js';
import Species from '../components/species.js';

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
});
