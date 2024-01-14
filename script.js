// Liste prédéfinie des noms de Pokémon de base pour le filtrage
const basePokemonList = new Set(['bulbasaur', 'charmander', 'squirtle', /* ... autres Pokémon de base ... */]);

// Fonction pour charger et afficher les produits avec filtrage par type et par stade d'évolution
function loadProducts(filterType = 'all', filterEvolution = 'all') {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Effacer les produits précédents avant de charger les nouveaux

    fetch('https://pokeapi.co/api/v2/pokemon?limit=500') 
        .then(response => response.json())
        .then(data => Promise.all(data.results.map(pokemon => fetch(pokemon.url).then(res => res.json()))))
        .then(pokemonDetailsArray => {
            pokemonDetailsArray.forEach(pokemonDetails => {
                // Filtre par type
                const isTypeMatch = filterType === 'all' || pokemonDetails.types.some(typeInfo => typeInfo.type.name === filterType);
                // Filtre par stade d'évolution en utilisant la liste prédéfinie
                const isEvolutionMatch = filterEvolution === 'all' || (filterEvolution === 'base' && basePokemonList.has(pokemonDetails.name.toLowerCase()));

                // Ajouter un prix aux détails de Pokémon
                pokemonDetails.price = basePokemonList.has(pokemonDetails.name.toLowerCase()) ? 10 : 30; // Prix exemple

                if (isTypeMatch && isEvolutionMatch) {
                    renderPokemonCard(pokemonDetails);
                    // Fonction pour réinitialiser les filtres
function resetFilters() {
    document.getElementById('type-filter').value = 'all';
    document.getElementById('evolution-filter').value = 'all';
    loadProducts(); // Recharger les produits avec les filtres réinitialisés
}


// Gestionnaire d'événements pour le bouton 'Réinitialiser'
document.getElementById('reset-filters').addEventListener('click', resetFilters);

                }
            });
        })
        .catch(error => console.error('Error:', error));
}

// Fonction pour charger les options de filtrage
function loadFilterOptions() {
    const typeSelect = document.getElementById('type-filter');
    fetch('https://pokeapi.co/api/v2/type')
        .then(response => response.json())
        .then(data => data.results.forEach(type => createFilterOption(typeSelect, type.name)));
}

// Fonction pour appliquer les filtres
function applyFilters() {
    const selectedType = document.getElementById('type-filter').value;
    const selectedEvolution = document.getElementById('evolution-filter').value;
    loadProducts(selectedType, selectedEvolution); // Recharger les produits avec les filtres appliqués
}

// Fonction pour créer une option de filtrage
function createFilterOption(selectElement, optionValue) {
    const option = document.createElement('option');
    option.value = optionValue;
    option.textContent = optionValue;
    selectElement.appendChild(option);
}

// Fonction pour afficher la carte Pokémon
function renderPokemonCard(pokemonDetails) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <img src="${pokemonDetails.sprites.front_default}" alt="${pokemonDetails.name}">
        <h3>${pokemonDetails.name}</h3>
        <p>Prix: ${pokemonDetails.price}€</p>
        <button class="add-to-cart" data-pokemon='${JSON.stringify(pokemonDetails)}'>Ajouter au panier</button>
    `;
    document.getElementById('product-list').appendChild(card);
}

// Gestionnaire d'événements pour le bouton 'Appliquer'
function setupEventListeners() {
    const productList = document.getElementById('product-list');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    productList.addEventListener('click', function (event) {
        if (event.target && event.target.classList.contains('add-to-cart')) {
            const pokemon = JSON.parse(event.target.getAttribute('data-pokemon'));
            cart.push(pokemon);
            localStorage.setItem('cart', JSON.stringify(cart));

            // Calculez le montant total du panier
            const totalPrice = cart.reduce((total, item) => total + item.price, 0);
            localStorage.setItem('totalPrice', totalPrice);

            // Redirigez l'utilisateur vers le panier
            window.location.href = 'cart.html'; // Assurez-vous que le nom du fichier est correct
        }
    });

    document.getElementById('apply-filters').addEventListener('click', applyFilters);
}

// Lorsque le DOM est entièrement chargé, configurer les fonctions et les gestionnaires d'événements
document.addEventListener('DOMContentLoaded', function () {
    loadProducts();
    loadFilterOptions();
    setupEventListeners();
});

// Affichage du panier
document.addEventListener('DOMContentLoaded', function () {
    const cartItems = document.getElementById('cart-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalPrice = parseInt(localStorage.getItem('totalPrice')) || 0;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Votre panier est vide.</p>';
    } else {
        cart.forEach(pokemon => renderCartItem(cartItems, pokemon));
    }

    // Affichez le montant total du panier
    const totalPriceElement = document.getElementById('total-price'); // Assurez-vous que cet élément existe dans votre HTML
    totalPriceElement.textContent = `Total: ${totalPrice}€`;

    document.getElementById('clear-cart').addEventListener('click', function () {
        localStorage.clear();
        cartItems.innerHTML = '<p>Votre panier est vide.</p>';
        totalPriceElement.textContent = 'Total: 0€'; // Mettez à jour le montant total après avoir vidé le panier
    });

    document.getElementById('back-to-shop').addEventListener('click', function () {
        window.location.href = 'produit.html';
    });
});

// Affichage du panier avec mise à jour
document.addEventListener('DOMContentLoaded', function () {
    const cartItems = document.getElementById('cart-items');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalPrice = parseInt(localStorage.getItem('totalPrice')) || 0;

    function updateCartDisplay() {
        cartItems.innerHTML = '';
        cart.forEach((pokemon, index) => renderCartItem(cartItems, pokemon, index));

        const totalPriceElement = document.getElementById('total-price');
        totalPrice = cart.reduce((total, item) => total + item.price, 0);
        totalPriceElement.textContent = `Total: ${totalPrice}€`;
        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.setItem('totalPrice', totalPrice);
    }

    cartItems.addEventListener('click', function (event) {
        if (event.target && event.target.classList.contains('remove-from-cart')) {
            const index = event.target.getAttribute('data-index');
            cart.splice(index, 1);
            updateCartDisplay();
        }
    });

    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Votre panier est vide.</p>';
    } else {
        updateCartDisplay();
    }

    document.getElementById('clear-cart').addEventListener('click', function () {
        cart = [];
        updateCartDisplay();
    });

    document.getElementById('back-to-shop').addEventListener('click', function () {
        window.location.href = 'produit.html';
    });
});

// Fonction pour afficher un élément du panier
function renderCartItem(cartItems, pokemon, index) {
    if (pokemon && pokemon.sprites && pokemon.sprites.front_default && pokemon.name) {
        const item = document.createElement('div');
        item.className = 'cart-item';
        item.innerHTML = `
            <h3>${pokemon.name}</h3>
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <p>Prix: ${pokemon.price}€</p>
            <button class="remove-from-cart" data-index="${index}">Supprimer</button>
        `;
        cartItems.appendChild(item);
    } else {
        console.error('Donnée Pokémon invalide dans le panier:', pokemon);
    }
}

const pokemonTypeColors = {
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    psychic: '#F85888',
    ice: '#98D8D8',
    dragon: '#7038F8',
    dark: '#705848',
    fairy: '#EE99AC',
    // ... ajoutez d'autres types et couleurs selon vos préférences ...
};
