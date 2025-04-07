import * as d3 from "d3";

// SVG icons
const icons = {
    deaths: new URL('../../public/assets/svg/helice.svg', import.meta.url).href,
    percentage: new URL('../../public/assets/svg/loupe.svg', import.meta.url).href,
    size: new URL('../../public/assets/svg/relge.svg', import.meta.url).href,
    rank: new URL('../../public/assets/svg/coupe.svg', import.meta.url).href
};

export default class Species {
  constructor(container) {
    this.container = container;
    this.currentIndex = 0;
    this.birds = [
      {
        name: "Unknown Bird (Small)",
        image: new URL('../../public/assets/img/unknownbird_small.png', import.meta.url).href,
        deaths: "48'898",
        percentage: "~ 28%",
        size: "<25cm",
        rank: "1er"
      },
      {
        name: "Unknown Bird (Medium)",
        image: new URL('../../public/assets/img/unknownbird_medium.png', import.meta.url).href,
        deaths: "38'259",
        percentage: "~ 22%",
        size: "25-40cm",
        rank: "2e"
      },
      {
        name: "Unknown Bird",
        image: new URL('../../public/assets/img/unknownbird.png', import.meta.url).href,
        deaths: "24'834",
        percentage: "~ 14%",
        size: "40cm+",
        rank: "3e"
      },
      {
        name: "Mourning Dove",
        image: new URL('../../public/assets/img/mourningdove.png', import.meta.url).href,
        deaths: "14'576",
        percentage: "~ 8%",
        size: "30cm",
        rank: "4e"
      },
      {
        name: "Barn Swallow",
        image: new URL('../../public/assets/img/barn.png', import.meta.url).href,
        deaths: "9'679",
        percentage: "~ 5%",
        size: "30cm",
        rank: "5e"
      },
      {
        name: "Killdeer",
        image: new URL('../../public/assets/img/killdeer.png', import.meta.url).href,
        deaths: "9'592",
        percentage: "~ 5%",
        size: "26cm",
        rank: "6e"
      },
      {
        name: "American Kestrel",
        image: new URL('../../public/assets/img/kestrel.png', import.meta.url).href,
        deaths: "8'879",
        percentage: "~ 5%",
        size: "33cm",
        rank: "7e"
      },
      {
        name: "Horned Lark",
        image: new URL('../../public/assets/img/hornedlark.png', import.meta.url).href,
        deaths: "8'032",
        percentage: "~ 5%",
        size: "28cm",
        rank: "8e"
      },
      {
        name: "Gulls",
        image: new URL('../../public/assets/img/gulls.png', import.meta.url).href,
        deaths: "7'414",
        percentage: "~ 4%",
        size: "35cm",
        rank: "9e"
      },
      {
        name: "European Starling",
        image: new URL('../../public/assets/img/europeanstarling.png', import.meta.url).href,
        deaths: "6'148",
        percentage: "~ 4%",
        size: "32cm",
        rank: "10e"
      }
    ];
    
    this.init();
  }

  init() {
    this.createLayout();
    this.updateCarousel();
  }

  createLayout() {
    // Container principal
    const mainContainer = d3.select(this.container)
      .append('div')
      .attr('class', 'species-container')
      .style('width', '100%')
      .style('height', '100%')
      .style('position', 'relative')
      .style('overflow', 'hidden');

    // Titre
    mainContainer.append('h2')
      .attr('class', 'title')
      .text('Les espèces les plus touchées');

    // Sous-titre
    mainContainer.append('p')
      .attr('class', 'subtitle')
      .text('While the number and size of the birds can escalate the potential impact to an aircraft, it also makes a difference where the birds impact the aircraft.');

    // Carousel container
    this.carouselContainer = mainContainer.append('div')
      .attr('class', 'carousel-container')
      .style('display', 'flex')
      .style('align-items', 'center')
      .style('justify-content', 'center')
      .style('margin', '40px 0')
      .style('position', 'relative')
      .style('min-height', '400px')
      .style('margin-left', '150px')
      .style('margin-right', '150px');

    // Bouton précédent
    this.carouselContainer.append('button')
      .attr('class', 'nav-button prev')
      .style('position', 'absolute')
      .style('left', '0px')
      .style('z-index', '2')
      .style('background', 'none')
      .style('border', 'none')
      .style('cursor', 'pointer')
      .style('font-size', '24px')
      .html('◀')
      .on('click', () => this.navigate(-1));

    // Images container
    this.imagesContainer = this.carouselContainer.append('div')
      .attr('class', 'images-container')
      .style('display', 'flex')
      .style('align-items', 'center')
      .style('justify-content', 'center')
      .style('width', '100%')
      .style('position', 'relative');

    // Bouton suivant
    this.carouselContainer.append('button')
      .attr('class', 'nav-button next')
      .style('position', 'absolute')
      .style('right', '20px')
      .style('z-index', '2')
      .style('background', 'none')
      .style('border', 'none')
      .style('cursor', 'pointer')
      .style('font-size', '24px')
      .html('▶')
      .on('click', () => this.navigate(1));

    // Stats container
    this.statsContainer = mainContainer.append('div')
      .attr('class', 'stats-container')
      .style('display', 'flex')
      .style('justify-content', 'center')
      .style('gap', '40px')
      .style('margin-top', '20px');

    // Création des conteneurs de statistiques
    const stats = ['deaths', 'percentage', 'size', 'rank'];
    const statLabels = {
      deaths: '',
      percentage: '',
      size: '',
      rank: ''
    };

    stats.forEach(stat => {
      const statContainer = this.statsContainer.append('div')
        .attr('class', `stat-container ${stat}`)
        .style('text-align', 'center');

      statContainer.append('img')
        .attr('class', 'stat-icon')
        .attr('src', icons[stat])
        .style('width', '24px')
        .style('height', '24px')
        .style('margin-bottom', '8px')

      statContainer.append('div')
        .attr('class', 'stat-label')
        .text(statLabels[stat]);

      statContainer.append('div')
        .attr('class', `stat-value ${stat}-value`)
        .style('margin', '5px')
    });
  }

  updateCarousel() {
    // Supprimer les images existantes
    this.imagesContainer.selectAll('.bird-item').remove();

    // Calculer les indices des images précédente et suivante
    const prevIndex = (this.currentIndex - 1 + this.birds.length) % this.birds.length;
    const nextIndex = (this.currentIndex + 1) % this.birds.length;

    // Ajouter l'image précédente (floutée)
    const prevItem = this.imagesContainer.append('div')
      .attr('class', 'bird-item prev')
      .style('position', 'absolute')
      .style('left', '50px')
      .style('text-align', 'center')
      .style('transform', 'scale(0.8)');

    prevItem.append('img')
      .attr('class', 'bird-image')
      .attr('src', this.birds[prevIndex].image)
      .style('width', '200px')
      .style('height', 'auto')
      .style('filter', 'blur(3px)')
      .style('opacity', '0.6');

    prevItem.append('div')
      .attr('class', 'bird-name')
      .style('margin-top', '10px')
      .style('font-size', '16px')
      .style('color', '#666')
      .style('opacity', '0.6')
      .text(this.birds[prevIndex].name);

    // Ajouter l'image courante
    const currentItem = this.imagesContainer.append('div')
      .attr('class', 'bird-item current')
      .style('position', 'relative')
      .style('z-index', '1')
      .style('text-align', 'center');

    currentItem.append('img')
      .attr('class', 'bird-image')
      .attr('src', this.birds[this.currentIndex].image)
      .style('width', '300px')
      .style('height', 'auto');

    currentItem.append('div')
      .attr('class', 'bird-name')
      .style('margin-top', '15px')
      .style('font-size', '20px')
      .style('color', '#333')
      .style('font-weight', 'bold')
      .text(this.birds[this.currentIndex].name);

    // Ajouter l'image suivante (floutée)
    const nextItem = this.imagesContainer.append('div')
      .attr('class', 'bird-item next')
      .style('position', 'absolute')
      .style('right', '50px')
      .style('text-align', 'center')
      .style('transform', 'scale(0.8)');

    nextItem.append('img')
      .attr('class', 'bird-image')
      .attr('src', this.birds[nextIndex].image)
      .style('width', '200px')
      .style('height', 'auto')
      .style('filter', 'blur(3px)')
      .style('opacity', '0.6');

    nextItem.append('div')
      .attr('class', 'bird-name')
      .style('margin-top', '10px')
      .style('font-size', '16px')
      .style('color', '#666')
      .style('opacity', '0.6')
      .text(this.birds[nextIndex].name);

    // Mettre à jour les statistiques
    const currentBird = this.birds[this.currentIndex];
    d3.select('.deaths-value').text(currentBird.deaths);
    d3.select('.percentage-value').text(currentBird.percentage);
    d3.select('.size-value').text(currentBird.size);
    d3.select('.rank-value').text(currentBird.rank);
  }

  navigate(direction) {
    // Mettre à jour l'index
    this.currentIndex = (this.currentIndex + direction + this.birds.length) % this.birds.length;
    
    // Mettre à jour le carousel avec une animation
    this.updateCarousel();
  }
} 