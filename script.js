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

        async function fetchMonsters() {
            for (let i = 1; i <= 40; i++) {
                try {
                    const response = await fetch(`https://monsterhunterapi.onrender.com/mhapi/monstruos/${i}/`);
                    if (!response.ok) {
                        console.error(`Error al obtener el monstruo ${i}: ${response.status}`);
                        continue;
                    }
                    const monster = await response.json();
                    allMonsters.push(monster);
                    monster.elemento.forEach(el => allElements.set(el.nombre, el.icono));
                    monster.estado.forEach(st => allStates.set(st.nombre, st.icono));
                    monster.debilidad.forEach(db => allWeaknesses.set(db.nombre, db.icono));
                } catch (error) {
                    console.error(`Error de conexión con el monstruo ${i}:`, error);
                }
            }
            populateFilters();
            renderMonsters(allMonsters);
        }

        function populateFilters() {
            populateFilterSection(allElements, elementsSection, filterMonstersByElement);
            populateFilterSection(allStates, statesSection, filterMonstersByState);
            populateFilterSection(allWeaknesses, weaknessesSection, filterMonstersByWeakness);

            const resetButton = document.createElement('button');
            resetButton.textContent = 'Reiniciar';
            resetButton.onclick = () => renderMonsters(allMonsters);
            resetSection.appendChild(resetButton);
        }

        function populateFilterSection(map, section, callback) {
            map.forEach((icon, name) => {
                const button = document.createElement('button');
                button.innerHTML = `<img src="${icon}" alt="${name}"> ${name}`;
                button.onclick = () => callback(name);
                section.appendChild(button);
            });
        }

        function renderMonsters(monsters) {
            container.innerHTML = '';
            monsters.forEach(monster => {
                const miniCard = document.createElement('div');
                miniCard.className = 'mini-card';
                miniCard.innerHTML = `
                    <img src="${monster.icono}" alt="${monster.nombre}">
                    <h4>${monster.nombre}</h4>
                    <button class="botones1" onclick='showModal(${JSON.stringify(monster)})'>Ver más</button>
                `;
                container.appendChild(miniCard);
            });
        }

        function showModal(monster) {
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

        function closeModal() {
            modal.style.display = 'none';
        }

        function filterMonstersByElement(elementName) {
            renderMonsters(allMonsters.filter(monster => monster.elemento.some(el => el.nombre === elementName)));
        }
        function filterMonstersByState(stateName) {
            renderMonsters(allMonsters.filter(monster => monster.estado.some(st => st.nombre === stateName)));
        }

        function filterMonstersByWeakness(weakName) {
            renderMonsters(allMonsters.filter(monster => monster.debilidad.some(db => db.nombre === weakName)));
        }

        fetchMonsters();