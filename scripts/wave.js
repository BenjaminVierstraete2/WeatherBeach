"use strict";
var millspeed = 5 //Lower = faster --- use range .7-50

function waveAnimation(){
    let wave = gsap.timeline({
        defaults:{
            ease: "none",
            duration:1.5,
        },
        repeat: 0,
    })
    wave.set('#wave1',{transformOrigin: "50% 50%",})
    .fromTo("#wave1",{x:'0vw',},{x:'50vw'})
    .fromTo("#wave1",{y:'0vh',},{y:'20vh'},'<')
    .to("#wave1",{rotation:"+=60"},'<')
}
function millAnimation(speed){
    let mill = gsap.timeline({
        defaults:{
            ease: "none",
        },
        repeat: -1,
    })
    mill.set('#millBladesObject',{transformOrigin: "50% 50%",})
    .to("#millBladesObject",{duration:millspeed,rotation:"+=360"})
    
}

function clickWave(){
    let wavejs = document.querySelector(".js-wave");
    wavejs.addEventListener("click", function(){
        console.log("wave clicked");
        waveAnimation();
    })
}
document.addEventListener("DOMContentLoaded", function () {
    console.info("DOM geladen");
    clickWave();
    millAnimation(millspeed);
});
