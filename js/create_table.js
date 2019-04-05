// Fill table recursively parsing data
function createTable(parent, data) {
  Object.keys(data).map(key => {

    // skip if display is none
    if(key === 'display' && data[key] === 'none')
      return;

    let trNode = document.createElement('tr');

    let tdLabelNode = document.createElement('td');
    tdLabelNode.innerHTML = key;
    trNode.appendChild(tdLabelNode);

    let tdValueNode = document.createElement('td');
    if(typeof data[key] === 'object' && data[key] !== null){
      tdValueNode.className += 'subcontent';
      createTable(tdValueNode, data[key]);
    }
    else
      if(typeof(data[key]) === 'number')
        tdValueNode.innerHTML = Math.round(data[key] * 1000000) / 1000000;
      else tdValueNode.innerHTML = data[key];
    trNode.appendChild(tdValueNode);

    parent.appendChild(trNode);
  });
}
