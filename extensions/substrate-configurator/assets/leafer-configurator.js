(() => {
  const score = (rule, answers) => (rule.plantTypes.includes(answers.plant) ? 4 : 0) + (rule.wateringStyles.includes(answers.water) ? 2 : 0) + (answers.pot >= rule.minPotCm && answers.pot <= rule.maxPotCm ? 1 : 0);
  document.querySelectorAll('.leafer-configurator:not([data-ready])').forEach(async root => {
    root.dataset.ready = 'true';
    try {
      const response = await fetch(root.dataset.endpoint, { headers: { Accept: 'application/json' } }); const config = await response.json();
      if (!config.enabled) { root.hidden = true; return; }
      root.style.setProperty('--leafer-color', config.primaryColor); root.innerHTML = `<h2>${config.heading}</h2><p>${config.intro}</p><form><label>Pflanzentyp<select name="plant"><option value="aroid">Aroid / tropisch</option><option value="succulent">Sukkulente</option><option value="cactus">Kaktus</option></select></label><label>Gießverhalten<select name="water"><option value="frequent">Häufig</option><option value="balanced">Ausgeglichen</option><option value="rare">Selten</option></select></label><label>Topfgröße (cm)<input name="pot" type="number" min="4" max="100" value="12"></label><button type="submit">Mischung finden</button></form><div class="leafer-configurator__result" aria-live="polite"></div>`;
      root.querySelector('form').addEventListener('submit', event => { event.preventDefault(); const form = new FormData(event.currentTarget); const answers = { plant: form.get('plant'), water: form.get('water'), pot: Number(form.get('pot')) }; const best = [...config.recommendations].sort((a,b) => score(b, answers)-score(a, answers))[0]; root.querySelector('.leafer-configurator__result').innerHTML = `<h3>${best.label}</h3><p>${best.mix}</p>${best.productUrl ? `<a href="${best.productUrl}">Passende Mischung ansehen</a>` : ''}`; });
    } catch { root.innerHTML = '<p>Der Konfigurator ist momentan nicht verfügbar.</p>'; }
  });
})();
