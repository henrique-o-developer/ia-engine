var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var flappy = /** @class */ (function () {
    function flappy() {
        this.image = new Image();
        this.ias = [];
        this.pipes = [];
        this.tickToPipe = 30;
    }
    flappy.prototype.setup = function () {
        this.image.src = "../../flappy bird/sprites.png";
        this.floor = new floor(this);
        this.back = new background(this);
        this.player = new bird(this);
    };
    flappy.prototype.tick = function () {
        var _this = this;
        this.pipes.forEach(function (v, i) {
            v.tick();
            if (v.x + v.w < 0)
                _this.pipes.splice(i, 1);
        });
        this.player.tick();
        if (this.tickToPipe >= 90) {
            var lp = this.pipes[this.pipes.length];
            var min = this.player.h * 2.5;
            var max = this.floor.y - this.player.h * 2.5;
            this.pipes.push(new pipe(this, this.canvas.width + pipe.pipes.w, Connection.mathUtils.generate_random_number(Math.min(min, lp ? lp.h - 50 : min), Math.max(lp ? lp.h + 50 : max, max))));
            this.tickToPipe = 0;
        }
        this.tickToPipe++;
    };
    flappy.prototype.draw = function () {
        this.ctx.fillStyle = "#70C5CE";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.back.draw();
        this.player.draw();
        this.pipes.forEach(function (v) { return v.draw(); });
        this.floor.draw();
    };
    return flappy;
}());
var bird = /** @class */ (function (_super) {
    __extends(bird, _super);
    function bird(flappy) {
        var _this = _super.call(this, 10, 50, 33, 24) || this;
        _this.sx = 0;
        _this.sy = 0;
        _this.vy = 0;
        _this.gv = 0.3;
        _this.gameover = false;
        _this.f = flappy;
        window.onkeydown = _this.f.canvas.onclick = function () {
            if (!_this.gameover)
                _this.vy = -5;
        };
        return _this;
    }
    bird.prototype.tick = function () {
        var _this = this;
        this.vy += this.gv;
        this.y += this.vy;
        this.f.pipes.forEach(function (v) {
            if (_this.colides(v)) {
                _this.gv = 0;
                _this.gameover = true;
                _this.x -= v.vx;
            }
        });
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
    };
    bird.prototype.draw = function () {
        this.f.ctx.drawImage(this.f.image, this.sx, this.sy, this.w, this.h, this.x, this.y, this.w, this.h);
    };
    return bird;
}(rect));
var floor = /** @class */ (function (_super) {
    __extends(floor, _super);
    function floor(flappy) {
        var _this = _super.call(this, 0, 0, 224, 112) || this;
        _this.sx = 0;
        _this.sy = 610;
        _this.f = flappy;
        _this.y = _this.f.canvas.height - _this.h;
        return _this;
    }
    floor.prototype.draw = function () {
        this.f.ctx.drawImage(this.f.image, this.sx, this.sy, this.w, this.h, this.x, this.y, this.w, this.h);
        this.f.ctx.drawImage(this.f.image, this.sx, this.sy, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    };
    return floor;
}(rect));
var background = /** @class */ (function (_super) {
    __extends(background, _super);
    function background(flappy) {
        var _this = _super.call(this, 0, 0, 275, 204) || this;
        _this.sx = 390;
        _this.sy = 0;
        _this.f = flappy;
        _this.y = _this.f.canvas.height - _this.h;
        return _this;
    }
    background.prototype.draw = function () {
        this.f.ctx.drawImage(this.f.image, this.sx, this.sy, this.w, this.h, this.x, this.y, this.w, this.h);
        this.f.ctx.drawImage(this.f.image, this.sx, this.sy, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    };
    return background;
}(rect));
var pipe = /** @class */ (function (_super) {
    __extends(pipe, _super);
    function pipe(flappy, x, y) {
        var _this = _super.call(this, x, y, pipe.pipes.w, pipe.pipes.h) || this;
        _this.sx = 390;
        _this.sy = 0;
        _this.vx = 3;
        _this.vy = 0;
        _this.up = new rect(0, 0, 0, 0);
        _this.down = new rect(0, 0, 0, 0);
        _this.f = flappy;
        _this.tick();
        return _this;
    }
    pipe.prototype.tick = function () {
        this.x -= this.vx;
        this.up.y = this.y + this.f.player.h * 2.5;
        this.up.x = this.x;
        this.down.y = this.y - this.h;
        this.down.x = this.x;
    };
    pipe.prototype.draw = function () {
        this.f.ctx.drawImage(this.f.image, pipe.pipes.up.x, pipe.pipes.y, this.w, this.h, this.up.x, this.up.y, this.w, this.h);
        this.f.ctx.drawImage(this.f.image, pipe.pipes.down.x, pipe.pipes.y, this.w, this.h, this.down.x, this.down.y, this.w, this.h);
    };
    pipe.prototype.colides = function (r) {
        return r.colides(this.up) || r.colides(this.down);
    };
    pipe.pipes = Object.freeze({
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
    return pipe;
}(rect));
handle(new flappy());
