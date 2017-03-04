var images = [
    "/images/background1.jpg",
    "/images/background2.jpg",
    "/images/background3.jpg",
    "/images/background4.jpg",
    "/images/background5.jpg"
];

for (var i = 0; i < images.length; i += 1) {
    var image = new Image();
    image.src = images[i];   
}
