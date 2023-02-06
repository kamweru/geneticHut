let canvas = document.querySelector('canvas')
let ctx = null;
let r=5;

let currCoord = 0
let interval = null
let timing = 3000
let coordinates = [
    {x: 200, y: 50},
    {x: 300, y: 150},
    {x: 300, y: 250},
    {x: 100, y: 250},
    {x: 100, y: 150},
]

let strokes = ['yellow', 'red', 'blue', 'green', 'purple']
let currStroke = 0

const circle=(x,y,r)=>{
    ctx.beginPath()
    ctx.arc(x,y,r, 0, Math.PI * 2, true)
    ctx.fill()
}

const drawLine=(x1,y1,x2,y2,ratio)=>{
    ctx.moveTo(x1,y1);
    x2 = x1 + ratio * (x2-x1);
    y2 = y1 + ratio * (y2-y1);
    ctx.lineTo(x2,y2);
    ctx.lineWidth = 5;
    ctx.stroke();
}

const animate = (ratio, item, next) => {
    ratio = ratio || 0;
    drawLine(item.x,item.y,next.x,next.y,ratio);
    if(ratio<1) {
        requestAnimationFrame(function() {
            animate(ratio + 0.01, item, next);
        });
    }
}

const setupCanvas = () => {
    canvas.width = canvas.width;
    ctx = canvas.getContext("2d")
    coordinates.forEach((item, index) =>{
        ctx.fillStyle = strokes[index]
        circle(item.x,item.y,r)
    })
    if(currStroke === coordinates.length){
        currStroke = 0
    }
    ctx.strokeStyle = strokes[currStroke]
    currStroke++
}

const startInterval = () => {
    interval = setInterval(() => meh(), timing);
};

const meh = () => {
    if(currCoord === coordinates.length){
        window.clearInterval(interval);
        currCoord = 0;
        setupCanvas()
        startInterval()
    }
    console.log(currCoord)
    let  next = currCoord + 1;
    if(currCoord === coordinates.length - 1){
        next = 0
    }
    animate(0, coordinates[currCoord], coordinates[next])
    currCoord++;
}



document.addEventListener('DOMContentLoaded', ()=>{
    setupCanvas()
    setTimeout(()=>{
        meh()
        interval = setInterval(()=>{
            meh()
        }, timing)
    }, 1500)
})


