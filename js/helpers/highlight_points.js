function highlightPoints(data) {

    let texture = new THREE.TextureLoader().load( 'assets/viridis.png' );
    let dotGeometry = new THREE.Geometry();

    let selectedPoints = points.filter(point => point.measurements.some(measurement => measurement[0]===data.index));
    selectedPoints.map(point =>
        dotGeometry.vertices.push(new THREE.Vector3(
            point.displayPosition.x,
            point.displayPosition.y,
            point.displayPosition.z)));

    // calculate 90th percentile
    let pointsArray = {xPoints: [], yPoints: [], zPoints: []};
    selectedPoints.map(point => {
        pointsArray.xPoints.push(Math.abs(point.displayPosition.x));
        pointsArray.yPoints.push(Math.abs(point.displayPosition.y));
        pointsArray.zPoints.push(Math.abs(point.displayPosition.z));
    });
    let localMax = {
        x: percentile(pointsArray.xPoints, 0.9),
        y: percentile(pointsArray.yPoints, 0.9),
        z: percentile(pointsArray.zPoints, 0.9),
    };

    // let zMax = Math.max(...selectedPoints.map(point => Math.abs(point.displayPosition.z)));
    // console.log({localMax, zMax});

    // // check outlier ratio
    // outliers = selectedPoints.map(point => {
    //   if(Math.abs(point.displayPosition.z / localMax.z) > 1) return point;
    // }).filter(e => e!=null);
    // console.log(outliers.length, selectedPoints.length);

    let dotMaterial = new THREE.ShaderMaterial( {
        uniforms: {
            map: { value: texture },
            width: { value: innerWidth },
            height: { value: innerHeight },
            normX: { value: localMax.x },
            normY: { value: localMax.y },
            normZ: { value: localMax.z },
            currentX: { value: data.displayPosition.x },
            currentY: { value: data.displayPosition.y },
            currentZ: { value: data.displayPosition.z },
        },
        vertexShader: document.getElementById( 'vs' ).textContent,
        fragmentShader: document.getElementById( 'fs' ).textContent,
    } );

    let dot = new THREE.Points( dotGeometry, dotMaterial );
    dot.name = 'highlightedPoints';
    scene.add( dot );

    return selectedPoints;

}

function removeHighlightPoints() {

    let highlightedPoints = scene.getObjectByName('highlightedPoints');
    scene.remove(highlightedPoints);

}