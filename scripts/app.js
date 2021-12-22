"use strict";
var count = 0;
//----------------------api----------------------/

function call_api(coast){

    // get time //
    var today = new Date();
    var dateToday = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2, "0")+'-'+today.getDate().toString().padStart(2, "0");;
    var tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    var dateTomorrow = tomorrow.getFullYear()+'-'+(tomorrow.getMonth()+1).toString().padStart(2, "0")+'-'+tomorrow.getDate().toString().padStart(2, "0");;
    const hour = new Date().getHours();

    //setting params//
    const start = dateToday;
    const end = dateTomorrow;
    const params = 'waveHeight,airTemperature,windSpeed,waterTemperature';
    
    //setting lat and long//
    var lat = "";
    var lng = "";
    const oostende = [51.228443,2.934465] //[lat,long]
    const sydney = [-33.865143,151.209900]
    if (coast == "ostend"){
        lat = oostende[0]
        lng = oostende[1]
    }
    if (coast == "sydney"){
        lat = sydney[0]
        lng = sydney[1]
    }

    fetch(`https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&start=${start}&end=${end}&params=${params}`, {
    headers: {
    'Authorization': '417e72e0-2c2d-11ec-8d00-0242ac130002-417e7358-2c2d-11ec-8d00-0242ac130002'
    }}).then((response) => response.json()).then((jsonData) => {
        console.log(jsonData)
        const windSpeedVal = jsonData.hours[hour].windSpeed.noaa;
        const airTemperatureVal = jsonData.hours[hour].airTemperature.noaa;
        const waveHeightVal = jsonData.hours[hour].waveHeight.noaa;
        const waterTemperatureVal = jsonData.hours[hour].waterTemperature.noaa;

        console.log(`Waveheight: ${waveHeightVal}\nWindspeed: ${windSpeedVal}\nAirtemperatur: ${airTemperatureVal}\nWaterTemperature:${waterTemperatureVal}`)
        millAnimation(windSpeedVal);
        waveHeight(waveHeightVal);
        setTemp('temp',airTemperatureVal);
        setTemp('tempwater',waterTemperatureVal);
        setText(waveHeightVal,windSpeedVal,airTemperatureVal,waterTemperatureVal)
    });
}


/* 
force	             m/s
Calm	        	0-0.2
Light Air		    0.3-1.5
Light Breeze		1.6-3.3
Gentle Breeze		3.4-5.4
Moderate Breeze		5.5-7.9
Fresh Breeze		8.0-10.7
Strong Breeze		10.8-13.8
Near Gale		    13.9-17.1
Gale		        17.2-20.7
Strong Gale		    20.8-24.4
Storm		        24.5-28.4
Violent Storm		28.5-32.6
Hurricane		    >32.7
*/


//----------------------functions----------------------//
function setText(wave,wind,air,water){
    document.getElementById("wave").textContent=`${wave} m`
    document.getElementById("wind").textContent=`${meterPerSecondToKmPerHour(wind)} km/h`
    document.getElementById("air").textContent=`${air}°c`
    document.getElementById("water").textContent=`${water}°c`
}

function meterPerSecondToKmPerHour(val){
    return (val * 3.6).toFixed(2)
}

function waveHeight(height){
    var scale = (height / 10) + 1
    let wave = document.getElementById("wavebig");
    wave.transformOrigin = "bottom right"
    wave.style.transform = `scale(${scale},${scale})`
    clickWave(scale);
}


function toggle(){
    const day = document.getElementById('day')
    const night = document.getElementById('night')
    const tog = document.getElementById('toggle')
    tog.addEventListener('change',() => {
        console.log('toggled')
        document.body.classList.toggle('dark');
        if (day.textContent == ""){
            day.textContent="Day";
            night.textContent="";
        }
        else{
            day.textContent="";
            night.textContent="Night";
        }      
    });
    tog.addEventListener('click',() => {
        console.log('clicked')});
}


function button(){
    const btn = document.getElementById('button')
    const beach = document.getElementById('beach')
    btn.addEventListener('click',() => {
        console.log('clicked'); 
        if (count == 0){
            count = 1;
            console.log(count);
            btn.textContent="Ostend";
            beach.textContent="Sydney beach"
            call_api("sydney");
        }
        else{
            count = 0;
            console.log(count);
            btn.textContent="Sydney";
            beach.textContent="Ostend beach"
            call_api("ostend");
        }     
    });
}


//----------------------animations----------------------//


function waveAnimationPhone(scale){
    let wave = gsap.timeline({
        defaults:{
            ease: "none",
            duration:2,
        },
        repeat: 0,
    })
    wave.set('#wavebig',{transformOrigin: "50% 50%",})
    .fromTo("#wavebig",{y:'0vh',},{y:'32vh'},'<')
    .to("#wavebig",{rotation:"+=180"},'<')
    .to("#wavebig", {scale:0.5},'<')
    .to("#wavebig",{rotation:"+=180"})
    .to("#wavebig", {scale:scale},'<')
    .fromTo("#wavebig",{y:'32vh',},{y:'0vh'},'<')
}

function wavePassing(){
    let wave = gsap.timeline({
        defaults:{
            ease: "none",
            duration:6,
        },
        repeat: -1,
    })
    
    .fromTo("#wavebig",{x:'-30vw',},{x:'120vw'})
}
    


function millAnimation(speed){
    if (speed >= 10){
        var dur = 1 - (speed / 100) 
        console.log(dur)
    }
    else{
        var dur = 10 -speed
        console.log(dur)
    }
    let mill = gsap.timeline({
        defaults:{
            ease: "none",
        },
        repeat: -1,
    })
    mill.set('#millBladesObject',{transformOrigin: "50% 50%",})
    .to("#millBladesObject",{duration:`${dur}`,rotation:`+=360`})  
}


function clickWave(scale){
    let wavejs = document.querySelector(".js-wave");
    wavejs.addEventListener("click", function(){
        console.log("wave clicked");
        waveAnimationPhone(scale);
    })
}

function setTemp(id,val){

    if (val <= -50){var scale = 0}
    if (val < -20 && val > -50){var scale = 0.4 - ((val-20)-(2*val))/100}
    if (val == -20){var scale = 0.4}
    if (val < -10 && val > -20){var scale = 0.7 - ((((val-10)-(2*val))/100) * 3)}
    if (val == -10){var scale = 0.7}
    if (val < 0 && val > -10){var scale = 1 - (((val-(2*val))/100) * 3)}
    if (val == 0){var scale = 1}
    if (val > 0 && val < 10){var scale = ((val/100) * 3.5) +1}
    if (val == 10){var scale = 1.35}
    if (val > 10 && val < 20){var scale = (((val -10)/100) * 3) +1.35}
    if (val == 20){var scale = 1.65}
    if (val > 20 && val < 30){var scale = (((val -20)/100) * 3) +1.65}
    if (val == 30){var scale = 1.95}
    if (val > 30 && val < 40){var scale = (((val -30)/100) * 3) +1.95}
    if (val == 40){var scale = 2.25}
    if (val > 40 && val < 80){var scale = 2 + (val /100)}
    if (val >= 80){var scale = 2.8}

    console.log(scale);
    let temp = gsap.timeline()
    temp.set(`#${id}`,{transformOrigin: "bottom center"})
    .to(`#${id}`,{scaleY: scale})
}




//----------------------run---------------------//


document.addEventListener("DOMContentLoaded", function () {
    console.info("DOM geladen");
    button();
    toggle();
    wavePassing();
    call_api("ostend");
});
