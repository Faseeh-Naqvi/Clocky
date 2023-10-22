function updateDigitalClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const timeElement = document.getElementById('time');

    if (hours > 12) {
        timeElement.textContent = `${hours - 12}:${minutes}:${seconds} PM`;
    } else {
        timeElement.textContent = `${hours}:${minutes}:${seconds} AM`;
    }
}

setInterval(updateDigitalClock, 1000);
function updateBackgroundColor() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    let backgroundColor = '#000000';
    let image="images/sun.png";

    // Calculate the time of day in minutes
    const timeOfDay = hours * 60 + minutes;
    //const timeOfDay = 300; //For testing
    console.log("The time in minutes is: ",timeOfDay);

    const colors = [
        { time: 0, color: '#043e52' },       // Night
        { time: 300, color: '#0f395d' },     // Pre-dawn
        { time: 360, color: '#1c3c6d' },     // Early Morning
        { time: 660, color: '#ffaa90' },     // Mid-Morning
        { time: 720, color: '#ffa45d' },     // Late Morning
        { time: 960, color: '#ffaa90' },     // Early Afternoon
        { time: 1020, color: '#ff993d' },    // Late Afternoon
        { time: 1080, color: '#e16a3d' },    // Evening
        { time: 1120, color: '#0f395d' },    // Dusk
        { time: 1380, color: '#043e52' },    // Nightfall
        { time: 1440, color: '#043e52' },    // Night
    ];
    const images =[
        {time: 0,image: "images/night.png"},
        {time: 250,image: "images/sunSetRise.png"},
        {time: 400,image: "images/sun.png"},
        {time: 1080,image: "images/sunSetRise.png"},
        {time: 1140,image: "images/night.png"},
    ];

    for (let i = 0; i < colors.length - 1; i++) {
        if (timeOfDay >= colors[i].time && timeOfDay < colors[i + 1].time) {
            const percent = (timeOfDay - colors[i].time) / (colors[i + 1].time - colors[i].time);
            backgroundColor = interpolateColor(colors[i].color, colors[i + 1].color, percent);
            break;
        }
    }

    for (let i = 0; i < images.length - 1; i++) {
        if(timeOfDay>= images[images.length -1].time){
            image = images[i].image;
            break;
        }
        if (timeOfDay >= images[i].time && timeOfDay < images[i + 1].time) {
            image = images[i].image;
            break;
        }
    }
    
    document.getElementById("image").src = image;

    if(timeOfDay>=1200|| timeOfDay<=400){ // make sure that text is readable.
        document.body.style.backgroundColor = backgroundColor;
    }
    else{
        document.body.style.backgroundColor = backgroundColor;
        document.getElementById('time').style.color =backgroundColor;
    }
}

function interpolateColor(color1, color2, percent) {
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);

    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);

    const r = Math.floor(r1 + percent * (r2 - r1));
    const g = Math.floor(g1 + percent * (g2 - g1));
    const b = Math.floor(b1 + percent * (b2 - b1));

    return `rgb(${r},${g},${b})`;
}

setInterval(updateBackgroundColor, 1000);


////for sunset & sunrise://

// fetch(`https://api.sunrise-sunset.org/json?lat=42.58&lng=-81.13&date=2023-10-22`)
//     .then(response => response.json())
//     .then(data => {
//         const sunriseTime = data.results.sunrise;
//         const sunsetTime = data.results.sunset;

//         console.log(`Sunrise: ${sunriseTime}`);
//         console.log(`Sunset: ${sunsetTime}`);
//     })
//     .catch(error => console.error(error));
