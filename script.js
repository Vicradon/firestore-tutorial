//note, asynchronous objects can't be stored in variables because it takes time for the data to be fetched
//asychronous tasks instead return promises.
//db.collection('collection name') is used to reference those collections stored in the console.
//the get() method attached to it is used to retrieve data from the database
//each collection has a snapshot. That's the current state of the collection when the promise returns a value;
//You can actually reference name of input elements using .name.value

const $ = node => document.querySelector(node);
const aev = (node, event, func) => node.addEventListener(event, func);
const log = node => console.log(node);

const cafeList = $('#cafe-list');
const add_btn = $('#add-cafe-form button');
const form = $('#add-cafe-form');


const render_cafe = doc => {
  const li = document.createElement('li');
  const cross = document.createElement('div');
  cross.textContent = 'x';
  const { city, name } = doc.data();
  const { id } = doc;
  li.innerHTML = `<span>${name}</span><span>${city}</span>`;
  li.setAttribute('data-id', id);
  li.appendChild(cross);
  //when you use backticks, use appenChild();
  cafeList.appendChild(li);

  //deleting data
  aev(cross, 'click', e => {
    e.stopPropagation();
    reqid = e.target.parentElement.getAttribute('data-id');
    db.collection('cafes').doc(reqid).delete();
  })
}

/*for querying
db.collection('cafes').where('city', '<', 'L').get().then(
  snapshot => snapshot.docs.forEach(item => render_cafe(item))
);
*/ 
// db.collection('cafes').where('city', '==', 'd-city').orderBy('name').get().then(
//   snapshot => snapshot.docs.forEach(item => render_cafe(item))
// ); 

aev(form, 'submit', e => {
  e.preventDefault();
  if (form.name.value !== '' && form.city.value !== '') {
    db.collection('cafes').add({ 
      name: form.name.value,
      city: form.city.value
    });
  }

  form.name.value = '';
  form.city.value = ''; 
});
db.collection('cafes').orderBy('city').onSnapshot(snapshot => {
  let changes = snapshot.docChanges();
  changes.forEach(item => {
    const {type} = item;
    if (type === 'added') {render_cafe(item.doc)}
    else if (type === 'removed') {
      const li = cafeList.querySelector(`[data-id = ${item.doc.id}]`);
      cafeList.removeChild(li);
    }
  })
});