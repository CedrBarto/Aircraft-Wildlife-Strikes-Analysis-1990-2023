import BirdStrikePeriods from '../components/birdStrikePeriods.js';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('daytime-container');
    if (container) {
        new BirdStrikePeriods(container);
    } else {
        console.error('Container not found');
    }
});