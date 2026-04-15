export default async function decorate(block) {
  // STEP 1: find main layout container
  const outer = block.querySelector(':scope > div');
  if (!outer) return;

  outer.classList.add('custom-form-layout');

  const columns = Array.from(outer.children);
  if (columns.length < 2) return;

  const contentCol = columns[0];
  const formCol = columns[1];

  contentCol.classList.add('custom-form-content');
  formCol.classList.add('custom-form-form');

  // STEP 2: find form.json link
  const link = formCol.querySelector('a[href$=".json"]');
  if (!link) return;

  const formUrl = link.href;
  formCol.innerHTML = ''; // remove link text

  // STEP 3: fetch form JSON
  const response = await fetch(formUrl);
  const formJson = await response.json();

  // STEP 4: build form
  const form = document.createElement('form');
  form.className = 'eds-form';
  form.method = 'post';

  formJson.data.forEach((field) => {
    // Submit button
    if (field.Type === 'submit') {
      const button = document.createElement('button');
      button.type = 'submit';
      button.textContent = field.Label || 'Submit';
      form.appendChild(button);
      return;
    }

    const fieldWrap = document.createElement('div');
    fieldWrap.className = 'eds-form-field';

    let input;
    if (field.Type === 'textarea') {
      input = document.createElement('textarea');
    } else {
      input = document.createElement('input');
      input.type = field.Type;
    }

    input.name = field.Name;
    input.placeholder = field.Placeholder || '';
    input.setAttribute('aria-label', field.Label || field.Name);

    if (field.Required === 'yes') {
      input.required = true;
    }

    fieldWrap.appendChild(input);
    form.appendChild(fieldWrap);
  });

  formCol.appendChild(form);
}