interface Game {
    canvas:HTMLCanvasElement;
    ctx:CanvasRenderingContext2D;

    setup();
    tick();
    draw();
}

class rect {
    x: any;
    y: any;
    h: any;
    w: any;
    
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    colides(r:rect) {
        return this.x < r.x + r.w &&
        this.x + this.w > r.x &&
        this.y < r.y + r.h &&
        this.h + this.y > r.y
    }
}

const handle = (g: Game) => {
    g.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    g.ctx = g.canvas.getContext('2d');

    g.setup();

    var func = () => {
        requestAnimationFrame(func);

        g.tick();
        g.draw();
    }

    func();
};