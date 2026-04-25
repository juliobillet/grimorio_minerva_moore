const recipesSeed = [
  {
    id: crypto.randomUUID(),
    title: 'Cítrico (Energizante)',
    profile: 'Focado no frescor para o dia a dia.',
    base: '40ml de álcool de cereais.',
    top: '15 gotas de Limão Siciliano + 15 gotas de Bergamota.',
    middle: '10 gotas de Capim-Limão (Lemongrass).',
    baseNotes: '5 gotas de Cedro.',
    notes:
      'Atenção: óleos cítricos podem manchar a pele sob sol. Maturar por 15 a 30 dias em frasco âmbar esterilizado.'
  },
  {
    id: crypto.randomUUID(),
    title: 'Floral (Romântico e Calmante)',
    profile: 'Cheiro clássico de jardim, elegante e suave.',
    base: '40ml de álcool de cereais.',
    top: '10 gotas de Laranja Doce.',
    middle: '20 gotas de Gerânio + 10 gotas de Lavanda.',
    baseNotes: '5 gotas de Ylang Ylang.',
    notes:
      'Gerânio atua como alternativa à rosa natural. Maturação de 15 a 30 dias melhora a integração olfativa.'
  },
  {
    id: crypto.randomUUID(),
    title: 'Doce / Adocicado (Aconchegante)',
    profile: 'Doçura natural de resinas e sementes.',
    base: '40ml de álcool de cereais.',
    top: '10 gotas de Tangerina.',
    middle: '10 gotas de Palmarosa.',
    baseNotes: '20 gotas de Baunilha + 5 gotas de Benjoim.',
    notes:
      'Sem açúcar sintético: o doce é resinoso. Excelente para noites frias.'
  },
  {
    id: crypto.randomUUID(),
    title: 'Amadeirado (Terroso e Marcante)',
    profile: 'Fragrância densa e de ótima fixação artesanal.',
    base: '40ml de álcool de cereais.',
    top: '10 gotas de Alecrim.',
    middle: '10 gotas de Pinheiro Silvestre ou Cipreste.',
    baseNotes: '15 gotas de Cedro Virgínia + 10 gotas de Patchouli.',
    notes:
      'Patchouli ajuda como fixador natural. Guardar em local escuro e fresco.'
  }
];

const storageKey = 'grimorio.minerva.recipes';

const book = document.getElementById('book');
const unlockForm = document.getElementById('unlockForm');
const authMessage = document.getElementById('authMessage');
const pagesArea = document.getElementById('pagesArea');

const indexList = document.getElementById('indexList');
const recipeTitle = document.getElementById('recipeTitle');
const recipeTagline = document.getElementById('recipeTagline');
const recipeContent = document.getElementById('recipeContent');
const recipeForm = document.getElementById('recipeForm');

const brandLogo = document.getElementById('brandLogo');
const logoFallback = document.getElementById('logoFallback');

let recipes = loadRecipes();

function loadRecipes() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return recipesSeed;
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length ? parsed : recipesSeed;
  } catch {
    return recipesSeed;
  }
}

function saveRecipes() {
  localStorage.setItem(storageKey, JSON.stringify(recipes));
}

function renderIndex() {
  indexList.innerHTML = '';

  recipes.forEach((recipe, i) => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.textContent = `${i + 1}. ${recipe.title}`;
    button.addEventListener('click', () => openRecipe(recipe.id));
    li.appendChild(button);
    indexList.appendChild(li);
  });
}

function renderRecipe(recipe) {
  recipeTitle.textContent = recipe.title;
  recipeTagline.textContent = recipe.profile || 'Registro aromático';

  recipeContent.innerHTML = `
    <h4>Base</h4>
    <p>${recipe.base || '—'}</p>

    <h4>Notas de Topo</h4>
    <p>${recipe.top || '—'}</p>

    <h4>Notas de Corpo</h4>
    <p>${recipe.middle || '—'}</p>

    <h4>Notas de Fundo</h4>
    <p>${recipe.baseNotes || '—'}</p>

    <h4>Anotações</h4>
    <p>${recipe.notes || '—'}</p>
  `;
}

function openRecipe(recipeId) {
  const selected = recipes.find((r) => r.id === recipeId) || recipes[0];
  renderRecipe(selected);
}

unlockForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const password = new FormData(unlockForm).get('password');

  authMessage.textContent = 'Consultando os sigilos...';

  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    if (!response.ok) {
      authMessage.textContent = 'Senha incorreta. O grimório permanece selado.';
      return;
    }

    authMessage.textContent = 'Acesso permitido. Abrindo as páginas...';
    book.classList.remove('is-locked');
    book.classList.add('is-open');
    pagesArea.setAttribute('aria-hidden', 'false');
    renderIndex();
    openRecipe(recipes[0]?.id);
  } catch (error) {
    authMessage.textContent = 'Falha na abertura do grimório. Tente novamente.';
    console.error(error);
  }
});

recipeForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(recipeForm);
  const newRecipe = {
    id: crypto.randomUUID(),
    title: (formData.get('newTitle') || '').toString().trim(),
    profile: (formData.get('newProfile') || '').toString().trim(),
    base: (formData.get('newBase') || '').toString().trim(),
    top: (formData.get('newTop') || '').toString().trim(),
    middle: (formData.get('newMiddle') || '').toString().trim(),
    baseNotes: (formData.get('newBaseNotes') || '').toString().trim(),
    notes: (formData.get('newTips') || '').toString().trim()
  };

  if (!newRecipe.title) return;

  recipes.push(newRecipe);
  saveRecipes();
  renderIndex();
  openRecipe(newRecipe.id);
  recipeForm.reset();
});

brandLogo.addEventListener('error', () => {
  brandLogo.style.display = 'none';
  logoFallback.style.display = 'inline';
});
