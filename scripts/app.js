let tl = gsap.timeline({
    defaults:{
        ease: "none",
        duration: .5,
    },
    repeat: -1,
})
tl.set('#millBladesObject',{
    transformOrigin: "50% 50%",
}).to("#millBladesObject",{duration:3,rotation:"+=360"})
