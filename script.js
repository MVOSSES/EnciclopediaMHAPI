const container = document.getElementById('monstersContainer');
const elementsSection = document.getElementById('elementsSection');
const statesSection = document.getElementById('statesSection');
const weaknessesSection = document.getElementById('weaknessesSection');
const resetSection = document.getElementById('resetSection');
const modal = document.getElementById('monsterModal');
const modalContent = document.getElementById('modalContent');

let allMonsters = [];
let allElements = new Map();
let allStates = new Map();
let allWeaknesses = new Map();

// Carga todos los monstruos de la API
async function fetchMonsters() {
    try {
        showLoading(true); // Muestra "Cargando..."
        const response = await fetch('https://monsterhunterapi.onrender.com/mhapi/monstruos/');
        
        if (!response.ok) throw new Error(`Error en la API: ${response.status}`);

        allMonsters = await response.json();

        allMonsters.forEach(monster => {
            monster.elemento.forEach(el => allElements.set(el.nombre, el.icono));
            monster.estado.forEach(st => allStates.set(st.nombre, st.icono));
            monster.debilidad.forEach(db => allWeaknesses.set(db.nombre, db.icono));
        });

        populateFilters();
        renderMonsters(allMonsters);
    } catch (error) {
        console.error("Error al cargar los monstruos:", error);
        showError("No se pudieron cargar los datos. Intenta nuevamente.");
    } finally {
        showLoading(false); // Oculta "Cargando..."
    }
}

// Renderiza todos los monstruos
function renderMonsters(monsters) {
    container.innerHTML = '';
    monsters.forEach(renderMonster);
}

// Renderiza un solo monstruo (optimización)
function renderMonster(monster) {
    const miniCard = document.createElement('div');
    miniCard.className = 'mini-card';
    miniCard.innerHTML = `
        <img src="${monster.icono}" alt="${monster.nombre}">
        <h4>${monster.nombre}</h4>
        <button class="botones1" onclick='showModal(${monster.id})'>Ver más</button>
    `;
    container.appendChild(miniCard);
}

// Muestra el modal con la información del monstruo
function showModal(monsterId) {
    const monster = allMonsters.find(m => m.id === monsterId);
    if (!monster) return;

    modalContent.innerHTML = `
        <button class="close-btn" onclick="closeModal()">X</button>
        <img class="imagen-tarjeta" src="${monster.imagen}" alt="${monster.nombre}">
        <h3>${monster.nombre}</h3>
        <p>Clase: ${monster.clase.nombre}</p>
        <div class="element">
            <p>Elemento:</p>
            ${monster.elemento.map(el => `<span><img src="${el.icono}" alt="${el.nombre}"></span>`).join(' ')}
        </div>
        <div class="element">
            <p>Plagas:</p>
            ${monster.estado.map(es => `<span><img src="${es.icono}" alt="${es.nombre}"></span>`).join(' ')}
        </div>
        <div class="element">
            <p>Debilidad:</p>
            ${monster.debilidad.map(de => `<span><img src="${de.icono}" alt="${de.nombre}"></span>`).join(' ')}
        </div>
        <p>Tamaño: ${monster.min_size} - ${monster.max_size} m</p>
    `;
    modal.style.display = 'flex';
}

// Cierra el modal
function closeModal() {
    modal.style.display = 'none';
}

// Población de filtros
function populateFilters() {
    populateFilterSection(allElements, elementsSection, filterMonstersByElement);
    populateFilterSection(allStates, statesSection, filterMonstersByState);
    populateFilterSection(allWeaknesses, weaknessesSection, filterMonstersByWeakness);

    resetSection.innerHTML = ''; // Limpia botón de reinicio antes de agregarlo
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reiniciar';
    resetButton.onclick = () => renderMonsters(allMonsters);
    resetSection.appendChild(resetButton);
}

function populateFilterSection(map, section, callback) {
    section.innerHTML = ''; // Limpia antes de agregar nuevos elementos
    map.forEach((icon, name) => {
        const button = document.createElement('button');
        button.innerHTML = `<img src="${icon}" alt="${name}"> ${name}`;
        button.onclick = () => callback(name);
        section.appendChild(button);
    });
}

// Filtrado de monstruos por elementos
function filterMonstersByElement(elementName) {
    renderMonsters(allMonsters.filter(monster => monster.elemento.some(el => el.nombre === elementName)));
}

// Filtrado por estado
function filterMonstersByState(stateName) {
    renderMonsters(allMonsters.filter(monster => monster.estado.some(st => st.nombre === stateName)));
}

// Filtrado por debilidad
function filterMonstersByWeakness(weakName) {
    renderMonsters(allMonsters.filter(monster => monster.debilidad.some(db => db.nombre === weakName)));
}

// Muestra un mensaje de carga
function showLoading(isLoading) {
    if (isLoading) {
        container.innerHTML = '<p class="loading">Cargando datos...</p>';
    } else {
        const loadingMsg = document.querySelector('.loading');
        if (loadingMsg) loadingMsg.remove();
    }
}

// Muestra un mensaje de error si la API falla
function showError(message) {
    container.innerHTML = `<p class="error">${message}</p>`;
}

// Ejecutar la carga de monstruos
fetchMonsters();
