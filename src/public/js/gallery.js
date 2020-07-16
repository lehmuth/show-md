let galleries = document.getElementsByClassName('gallery');
console.log(galleries);
Array.from(galleries).forEach(element => {
    lightGallery(element);
});