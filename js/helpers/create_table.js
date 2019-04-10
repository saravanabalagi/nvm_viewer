// Fill table recursively parsing data
function createTable(parent, data) {
  Object.keys(data).map(key => {

    let trNode = document.createElement('tr');

    let tdLabelNode = document.createElement('td');
    tdLabelNode.innerHTML = key;
    trNode.appendChild(tdLabelNode);

    const digitsToRound = 6;
    const digitsToRoundInPow = Math.pow(10, digitsToRound);
    let tdValueNode = document.createElement('td');
    if(typeof data[key] === 'object' && data[key] !== null){
      if('display' in data[key] && data[key].display === 'none') return;
      tdValueNode.className += 'subcontent';
      createTable(tdValueNode, data[key]);
    }
    else
      if(typeof(data[key]) === 'number')
        tdValueNode.innerHTML = Math.round(data[key] * digitsToRoundInPow) / digitsToRoundInPow;
      else tdValueNode.innerHTML = data[key];
    trNode.appendChild(tdValueNode);

    parent.appendChild(trNode);
  });
}