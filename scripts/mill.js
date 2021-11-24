var millspeed = 5 //Lower = faster --- use range .7-50


let tl = gsap.timeline({
    defaults:{
        ease: "none",
    },
    repeat: -1,
})
tl.set('#millBladesObject',{
    transformOrigin: "50% 50%",
}).to("#millBladesObject",{duration:millspeed,rotation:"+=360"})
