const tbody = document.querySelector('tbody')
const sTipo = document.querySelector('#m-tipo')
const sQuanti = document.querySelector('#m-qtd')
const sModel = document.querySelector('#m-model')
const sMarca = document.querySelector('#m-marca')
const sCondicao = document.querySelector('#m-condi')
const sDiferencial = document.querySelector('#d-difere')
const btnSalvar = document.querySelector('#btnSalvar')
const modal = document.querySelector('.modal-container')
const deleteModal = document.querySelector('.delete-modal-container')
const cancelButton = document.querySelector('#cancelButton')
const deleteButton = document.querySelector('#excludeButton')
const modalForm = document.querySelector('#modalForm')

let itens
let id

// Funcs used to set attributes on edition modal 
function setRadioOption(itens, index) {
  a = document.querySelector(`input[name="m-condi"]`)
  document.querySelector(`input[name="m-condi"][value="${itens[index].condicao}"]`).checked = true;
}

function setCheckboxOption(itens, index) {
  itens[index].diferencial.forEach(diferencial => {
    document.querySelector(`input[name="d-difere"][value="${diferencial}"]`).checked = true;
  });
}

function setDropdownOption(itens, index) {
  document.querySelector(`#m-tipo option[value="${itens[index].tipo}"]`).selected = true;
}

// Funcs used to register the selected item values

function getSelectedRadioValue(name) {
  const radios = document.getElementsByName(name);
  let selectedValue;
  radios.forEach(radio => {
    if (radio.checked) {
      selectedValue = radio.value;
    }
  });
  return selectedValue;
}

function getSelectedCheckboxValue(name) {
  const checkboxes = document.getElementsByName(name);
  let selectedValues = [];
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      selectedValues.push(checkbox.value);
    }
  });
  return selectedValues;
}

function getSelectedDropdownValue(name) {
  const dropdown = document.getElementById(name);
  return dropdown.options[dropdown.selectedIndex].value;
}

// Funcs used to open and close modals

function openModal(edit = false, index = 0) {
  modal.classList.add('active')

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active')
      modalForm.reset();
    }
  }

  if (edit) {
    sModel.value = itens[index].model
    sMarca.value = itens[index].marca
    sQuanti.value = itens[index].qtd
    setCheckboxOption(itens, index)
    setDropdownOption(itens, index)
    setRadioOption(itens, index)
    id = index
  }
  
}

function openDeleteModal(index) {
  deleteModal.classList.add('active');
  deleteButton.setAttribute('onclick', `deleteItem(${index})`);

  modal.onclick = e => {
      if (e.target.className.indexOf('delete-modal-container') !== -1) {
          modal.classList.remove('active');
      }
  }
}


function closeModal() {
  deleteModal.classList.remove('active');
}

btnSalvar.onclick = e => {
  
  if (sModel.value == '' || sMarca.value == '' || sQuanti.value == '') {
    return
  }

  e.preventDefault();

  if (id !== undefined) {
    itens[id].model = sModel.value
    itens[id].marca = sMarca.value
    itens[id].qtd = sQuanti.value
    itens[id].tipo = getSelectedDropdownValue('m-tipo')
    itens[id].condicao = getSelectedRadioValue('m-condi')
    itens[id].diferencial = getSelectedCheckboxValue('d-difere')

  } else {
    itens.push({'model': sModel.value, 'marca': sMarca.value, 'qtd': sQuanti.value, 'tipo': getSelectedDropdownValue('m-tipo'), 'condicao': getSelectedRadioValue('m-condi'), 'diferencial': getSelectedCheckboxValue('d-difere')})
  }

  setItensBD()

  modalForm.reset()
  modal.classList.remove('active')
  loadItens()
  id = undefined
}

// Funcs used to edit and delete items

function deleteItem(index) {
  itens.splice(index, 1)
  setItensBD()
  loadItens()
  closeModal()
}

function insertItem(item, index) {
  const tr = document.createElement('tr')
  tr.innerHTML = `
    <td>${item.model}</td>
    <td>${item.marca}</td>
    <td>${item.qtd}</td>
    <td class="edit-btn">
      <button onclick="openModal(true, ${index})">
        <i class="fas fa-pencil-alt"></i>
      </button>
    </td>
    <td class="delete-btn">
      <button onclick="openDeleteModal(${index})">
        <i class="fas fa-trash-alt"></i>
      </button>
    </td>
  `
  tbody.appendChild(tr)
}

// Funcs used to load and set items

function loadItens() {
  itens = getItensBD()
  tbody.innerHTML = ''
  itens.forEach((item, index) => {
    insertItem(item, index)
  })
}

const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? []
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens))

loadItens()
