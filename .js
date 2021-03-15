let c, ctx, W, H;
let touchx,touchy;
let camera, e;
let mouse = {x: 0, y: 0};
let move = false;
let dots = [];

const random = (max=1, min=0) => Math.random() * (max - min) + min;

const clear = () => {
    ctx.fillStyle = 'rgba(185,185,185, .5)';
    ctx.fillRect(0, 0, W, H);
};

class Dot {
    constructor(x,y,z){    
        this.x = x 
        this.y = y
        this.z = z
        this.size = 0.2
    }
    projection() {
        this.dx = this.x - camera.x;
        this.dy = this.y - camera.y;
        this.dz = this.z - camera.z;
        this.bx = (e.z * this.dx/this.dz + e.x);
        this.by = (e.z * this.dy/this.dz + e.y);
        return [this.bx+W/2, this.by+H/3];
    }
}


let z=50, a=0
const cerateLines = () => {
    for(let y=0;y<4000; y+=2000){
        for(let x=0;x<4000; x+=2000){
            dots.push(new Dot(x, y+500*Math.sin(a), z));
        }
    }    
    z+=10
    a+=0.4
}

const updateDots = ()=> {
    let cpt = 0
    for(let i=dots.length-1; i>=0; i--){        
        for(let j=i; j<dots.length; j++){
            let dx = dots[i].x - dots[j].x;
            let dy = dots[i].y - dots[j].y;
            let dz = Math.abs(dots[i].z - dots[j].z)
            let d = Math.hypot(dx,dy)
            if(d<2021&&dz < 11){
                ctx.beginPath()
                ctx.strokeStyle = d>1000?'rgba(0,0,0,' + 50/dots[i].z + ')': 'rgba(255,255,255,' + 50/dots[i].z + ')' 
                ctx.lineWidth =  d>1000? dots[i].size*(100/dots[i].dz) : dots[i].size*(800/dots[i].dz)
                ctx.moveTo(dots[i].bx+W/2, dots[i].by+H/3);
                ctx.lineTo(dots[j].bx+W/2, dots[j].by+H/3);
                ctx.stroke();
            }
            
        }
        dots[i].projection();
        dots[i].z-=1
        if(dots[i].z<=1){
            dots.splice(i, 1);
            z = dots[dots.length-1].z+10
            cpt++
            if(cpt==4)cerateLines()
        }
    }
};

const eventsListener = ()=> {
    c.addEventListener("touchstart",function(e){
        touchx = e.touches[0].pageX;
        touchy = e.touches[0].pageY;
    });
    c.addEventListener("touchmove",function(e){
        camera.x += 10*(e.touches[0].pageX-touchx);
        touchx = e.touches[0].pageX;
        camera.y += 10*(e.touches[0].pageY-touchy);
        touchy = e.touches[0].pageY;
    });
    c.addEventListener("mousemove", function(e){
        if(move){
            camera.x += 10*(e.clientX-mouse.x);
            camera.y += 10*(e.clientY-mouse.y);
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }
    });
    c.addEventListener("mousedown", function(e){
        move=true;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    c.addEventListener("mouseup", function(){move=false});
};


const init = () => {
    c = document.getElementById("cnv");
    c.width = W = innerWidth
    c.height = H = innerHeight
    ctx = c.getContext("2d")
    camera = {x:W*1.5, y:H, z:1}
    e = {x:0, y:0, z:-5}
    eventsListener()
    for(let i=0;i<30;i++)cerateLines()
    animate()
};

const animate = () => {
    clear()
    updateDots()
    requestAnimationFrame(animate)
};

onload = init;
