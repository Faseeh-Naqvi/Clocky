//global:
let sunriseTime=0;
let sunsetTime=0;
let firstLightTime = 0;
let dawnTime = 0;
let morningTime = 0;
let noonTime = 0;
let duskTime = 0;

//Get user Location//
let long=0;
let lat=0;

function getLocation() {
    if (navigator.geolocation) {
        alert("Hi! We need your location to get sunrise and sunset timings.");
        navigator.geolocation.getCurrentPosition(function(position) {
            lat = position.coords.latitude;
            long = position.coords.longitude;

            // Once you have lat and long, make the fetch request for sunrise and sunset
            fetch(`https://api.sunrisesunset.io/json?lat=${lat}&lng=${long}`)
                .then(response => response.json())
                .then(data => {
                    sunriseTime = findTime(data.results.sunrise);
                    sunsetTime = findTime(data.results.sunset);
                    noonTime = findTime(data.results.solar_noon); // noon, midday
                    firstLightTime = findTime(data.results.first_light); // first light
                    lastLightTime = findTime(data.results.last_light); // last light
                    dawnTime = findTime(data.results.dawn); // dawn
                    duskTime = findTime(data.results.dusk); // dusk
                })
                .catch(error => console.error(error));
        }, function(error) {
            switch (error.code) {
                // Handle geolocation-related errors
            }
        });
    } else {
        alert("Geolocation is not supported by this browser :(");
    }
}

getLocation();

function updateDigitalClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const timeElement = document.getElementById('time');

    if (hours >= 12) {
        if(hours == 12){
            timeElement.textContent = `${hours}:${minutes}:${seconds} PM`;
        }
        else{
            timeElement.textContent = `${hours - 12}:${minutes}:${seconds} PM`;
        }
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
    
    //console.log("The time in minutes is: ",timeOfDay);
    
    const colors = [
        { time: 0, color: '#03303f' },       // Night
        { time: firstLightTime, color: '#0f395d' },     // Pre-dawn
        { time: dawnTime, color: '#0E65A3' },     // Early Morning
        { time: sunriseTime, color: '#ffcb8f' },     // Mid-Morning
        { time: sunriseTime+150, color: '#ffa45d' },     // Late Morning
        { time: noonTime, color: '#f8a054' },     // Early Afternoon
        { time: noonTime+30, color: '#ff993d' },    // Late Afternoon
        { time: sunsetTime, color: '#e16a3d' },    // Evening
        { time: duskTime, color: '#043e52' },    // Dusk
        { time: duskTime+60, color: '#0f395d' },    // Nightfall
        { time: 1440, color: '#03303f' },    // Night
    ];
    
    
    const images = [
        { time: 0, image: "images/night.png" },
        { time: dawnTime, image: "images/sunSetRise.png" },
        { time: sunriseTime, image: "images/sun.png" },
        { time: sunsetTime, image: "images/sunSetRise.png" },
        { time: duskTime, image: "images/night.png" },
    ];

    for (let i = 0; i < colors.length - 1; i++) {
        if (timeOfDay >= colors[i].time && timeOfDay < colors[i + 1].time) {
            console.log(i);
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

    if(timeOfDay>=1120|| timeOfDay<=400){ // make sure that text is readable.
        document.body.style.backgroundColor = backgroundColor;
        document.getElementById('time').style.color ="#FFFFFF";
        
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





function findTime(timeStr) {
    const timePieces = timeStr.split(' ');
    
    if (timePieces.length === 2) {
        const timeWithoutPeriod = timePieces[0];
        const period = timePieces[1];

        const timeParts = timeWithoutPeriod.split(':');
        if (timeParts.length === 3) {
            let hours = parseInt(timeParts[0]);
            const minutes = parseInt(timeParts[1]);
            

            if (period === "PM" && hours < 12) {
                hours += 12;
            } else if (period === "AM" && hours === 12) {
                hours = 0;
            }

            return hours * 60 + minutes;
        }
    }
}