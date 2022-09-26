class flappy implements Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    public image:HTMLImageElement = new Image();
    public player:bird;
    public ias:bird[] = [];
    public floor:floor;
    public back:background;
    public pipes:pipe[] = [];

    public tickToPipe:number = 30;
     
    setup() {
        this.image.src = "../../flappy bird/sprites.png";

        this.floor = new floor(this);
        this.back = new background(this);
        this.player = new bird(this);
        
    }

    tick() {
        this.pipes.forEach((v, i) => {
            v.tick()
        
            if (v.x + v.w < 0) this.pipes.splice(i, 1);
        });

        this.player.tick();

        if (this.tickToPipe >= 90) {
            var lp = this.pipes[this.pipes.length];
            var min = this.player.h * 2.5;
            var max = this.floor.y - this.player.h * 2.5;

            this.pipes.push(new pipe(
                this, 
                this.canvas.width + pipe.pipes.w, 
                Connection.mathUtils.generate_random_number(
                    Math.min(min, lp ? lp.h - 50 : min),
                    Math.max(lp ? lp.h + 50 : max, max),
                )
            ));

            this.tickToPipe = 0;
        }

        this.tickToPipe++;
    }

    draw() {
        this.ctx.fillStyle = "#70C5CE";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.back.draw();
        this.player.draw();
        this.pipes.forEach(v => v.draw());
        this.floor.draw();
    }
}

class bird extends rect {
    public f:flappy;

    public sx:number = 0;
    public sy:number = 0;
    public vy:number = 0;
    public gv:number = 0.3;

    public gameover:boolean = false;

    constructor(flappy) {
        super(10, 50, 33, 24);

        this.f = flappy;

        window.onkeydown = this.f.canvas.onclick = () => {
            if (!this.gameover) this.vy = -5;
        }
    }

    tick() {
        this.vy += this.gv;

        this.y += this.vy;

        this.f.pipes.forEach(v => {
            if (this.colides(v)) {
                this.gv = 0;
                this.gameover = true;
                this.x -= v.vx;
            }
        })

        if (this.colides(this.f.floor)) {
            this.y = this.f.floor.y - this.h + 2; 
            this.vy = 0;
            this.gv = 0;

            this.gameover = true;
        }

        if (this.y < 0) {
            this.y = 0;

            this.gameover = true;
        }
    }

    draw() {
        this.f.ctx.drawImage(
            this.f.image,
            this.sx, this.sy,
            this.w, this.h,
            this.x, this.y,
            this.w, this.h
        );
    }
}

class floor extends rect {
    public f:flappy;

    public sx:number = 0;
    public sy:number = 610;

    constructor(flappy) {
        super(0, 0, 224, 112);
        
        this.f = flappy;

        this.y = this.f.canvas.height - this.h;
    }

    draw() {
        this.f.ctx.drawImage(
            this.f.image,
            this.sx, this.sy,
            this.w, this.h,
            this.x, this.y,
            this.w, this.h
        );
         
        this.f.ctx.drawImage(
            this.f.image,
            this.sx, this.sy,
            this.w, this.h,
            this.x+this.w, this.y,
            this.w, this.h
        );
    }
}

class background extends rect {
    public f:flappy;

    public sx:number = 390;
    public sy:number = 0;

    constructor(flappy) {
        super(0, 0, 275, 204);

        this.f = flappy;

        this.y = this.f.canvas.height - this.h;
    }

    draw() {
        this.f.ctx.drawImage(
            this.f.image,
            this.sx, this.sy,
            this.w, this.h,
            this.x, this.y,
            this.w, this.h
        );
         
        this.f.ctx.drawImage(
            this.f.image,
            this.sx, this.sy,
            this.w, this.h,
            this.x+this.w, this.y,
            this.w, this.h
        );
    }
}

class pipe extends rect {
    public f:flappy;

    public sx:number = 390;
    public sy:number = 0;

    public vx:number = 3;
    public vy:number = 0;

    public up:rect = new rect(0, 0, 0, 0);
    public down:rect = new rect(0, 0, 0, 0);

    constructor(flappy, x, y) {
        super(x, y, pipe.pipes.w, pipe.pipes.h);

        this.f = flappy;

        this.tick();
    }

    tick() {
        this.x -= this.vx;

        this.up.y = this.y + this.f.player.h * 2.5;
        this.up.x = this.x;

        this.down.y = this.y - this.h;
        this.down.x = this.x;
    }

    draw() {
        this.f.ctx.drawImage(
            this.f.image,
            pipe.pipes.up.x, pipe.pipes.y,
            this.w, this.h,
            this.up.x, this.up.y,
            this.w, this.h
        );

        this.f.ctx.drawImage(
            this.f.image,
            pipe.pipes.down.x, pipe.pipes.y,
            this.w, this.h,
            this.down.x, this.down.y,
            this.w, this.h
        );
    }

    colides(r:rect) {
        return r.colides(this.up) || r.colides(this.down);
    }

    static pipes = Object.freeze({
        y: 169,
        w: 52,
        h: 400,
        up: {
            x: 0
        },
        down: {
            x: 52,
        }
    });
}

handle(new flappy());