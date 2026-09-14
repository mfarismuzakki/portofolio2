(() => {
  const cards = [...document.querySelectorAll('.course-card')];
  const search = document.querySelector('#course-search');
  const buttons = [...document.querySelectorAll('.semester-filters button')];
  const count = document.querySelector('#result-count');
  const clear = document.querySelector('#clear-search');
  const empty = document.querySelector('#empty-state');
  let semester = 'all';
  const normalize = text => text.toLocaleLowerCase('id').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const searchable = new Map(cards.map(card => [card, normalize(card.textContent)]));
  function filter() {
    const terms = normalize(search.value).trim().split(/\s+/).filter(Boolean);
    let visible = 0;
    cards.forEach(card => {
      const matches = (semester === 'all' || card.dataset.semester === semester)
        && terms.every(term => searchable.get(card).includes(term));
      card.hidden = !matches;
      if (matches) visible++;
    });
    count.textContent = `Menampilkan ${visible} dari ${cards.length} mata kuliah`;
    empty.hidden = visible !== 0;
    clear.hidden = search.value.length === 0;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.semester === semester)));
  }
  buttons.forEach(button => button.addEventListener('click', () => { semester = button.dataset.semester; filter(); }));
  search.addEventListener('input', filter);
  clear.addEventListener('click', () => { search.value = ''; filter(); search.focus(); });
  document.querySelector('#reset-filters').addEventListener('click', () => {
    semester = 'all'; search.value = ''; filter(); search.focus();
  });
  document.querySelector('.collection-tools').hidden = false;
  filter();
})();
