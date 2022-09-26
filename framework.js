var rect = /** @class */ (function () {
    function rect(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    rect.prototype.colides = function (r) {
        return this.x < r.x + r.w &&
            this.x + this.w > r.x &&
            this.y < r.y + r.h &&
            this.h + this.y > r.y;
    };
    return rect;
}());
var handle = function (g) {
    g.canvas = document.getElementById('canvas');
    g.ctx = g.canvas.getContext('2d');
    g.setup();
    var func = function () {
        requestAnimationFrame(func);
        g.tick();
        g.draw();
    };
    func();
};
