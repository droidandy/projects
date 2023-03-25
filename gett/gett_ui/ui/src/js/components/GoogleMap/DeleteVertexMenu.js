/* global google */
import deleteVertex from 'assets/images/deleteVertex.png';

const OverlayView = google.maps.OverlayView;

// A menu that lets a user delete a selected vertex of a path
export default class DeleteVertexMenu extends OverlayView {
  imagePositions = {
    default: '0px 27px',
    hover: '-30px 27px',
    active: '-60px 27px'
  };

  height = '27px';
  width = '30px';
  image = deleteVertex;
  top = 15;
  left = 10;

  constructor() {
    super();
    // Creating new element to delete vertex. Used div with background image
    // As there is problem to add events to the child elements
    this.div = document.createElement('div');
    this.div.style.height = this.height;
    this.div.style.width = this.width;
    this.div.style.overflow = 'hidden';
    this.div.style.position = 'absolute';
    this.div.style.backgroundImage = `url("${this.image}")`;
    this.div.style.cursor = 'pointer';
    this.setDefaultImage();

    // add handler to delete vertex
    google.maps.event.addDomListener(this.div, 'click', () => {
      this.removeVertex();
    });

    // add handlers to animate button
    google.maps.event.addDomListener(this.div, 'mouseover', () => {
      this.div.style.backgroundPosition = this.imagePositions.hover;
    });
    google.maps.event.addDomListener(this.div, 'mouseout', () => {
      this.setDefaultImage();
    });
  }

  setDefaultImage() {
    this.div.style.backgroundPosition = this.imagePositions.default;
  }

  onAdd() {
    const map = this.getMap();
    this.getPanes().floatPane.appendChild(this.div);

    // mousedown anywhere on the map except on the menu div will close the menu.
    this.divListener = google.maps.event.addDomListener(map.getDiv(), 'mousedown', (e) => {
      this.div.style.backgroundPosition = this.imagePositions.active;
      if (e.target !== this.div) {
        this.close();
      }
    }, true);
  }

  onRemove() {
    google.maps.event.removeListener(this.divListener);
    this.div.parentNode.removeChild(this.div);

    // clean up
    this.set('position');
    this.set('path');
    this.set('vertex');
  }

  close() {
    this.setMap(null);
  }

  draw() {
    const position = this.get('position');
    const projection = this.getProjection();

    if (!position || !projection) {
      return;
    }

    const point = projection.fromLatLngToDivPixel(position);
    this.div.style.position = 'absolute';
    this.div.style.top = point.y + this.top + 'px';
    this.div.style.left = point.x + this.left + 'px';
  }

  open(map, path, vertex) {
    this.setDefaultImage();

    this.set('position', path.getAt(vertex));
    this.set('path', path);
    this.set('vertex', vertex);
    this.setMap(map);
    this.draw();
  }

  removeVertex() {
    const path = this.get('path');
    const vertex = this.get('vertex');

    if (path || vertex !== undefined) {
      path.removeAt(vertex);
    }

    this.close();
  }
}
