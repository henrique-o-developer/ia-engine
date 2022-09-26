// this file is the main ia file
var Neural = /** @class */ (function () {
    function Neural(f, m, e) {
        this.f = f;
        this.m = m;
        this.e = e;
    }
    Neural.prototype.predict = function (na) {
        var n = this.f.predict(na);
        this.m.forEach(function (v) {
            n = v.predict(n);
        });
        return this.e.predict(n);
    };
    Neural.prototype.mutate = function (rmin, rmax) {
        if (rmin === void 0) { rmin = -7; }
        if (rmax === void 0) { rmax = 7; }
        this.f.mutate(rmin, rmax);
        this.m.forEach(function (v) { return v.mutate(rmin, rmax); });
        this.e.mutate(rmin, rmax);
    };
    return Neural;
}());
;
var Layer = /** @class */ (function () {
    function Layer() {
        this.unic = false;
    }
    Layer.prototype.automaticConstruct = function (c, f) {
        this.auto = true;
        this.n = [];
        this.autoConn = c;
        this.autoFuncc = f;
    };
    Layer.prototype.manualConstruct = function (n) {
        this.auto = false;
        this.n = n;
    };
    Layer.prototype.setUnic = function (v) { this.unic = v; };
    Layer.prototype.predict = function (na) {
        var _this = this;
        var ret = [];
        while (na.length > this.n.length && this.auto) {
            this.n.push(new Neuron(this.autoConn, this.autoFuncc));
        }
        this.n.forEach(function (v, i) {
            if (_this.unic)
                ret.push(v.predict([na[i]]));
            else
                ret.push(v.predict(na));
        });
        return ret;
    };
    Layer.prototype.mutate = function (rmin, rmax) {
        if (rmin === void 0) { rmin = -7; }
        if (rmax === void 0) { rmax = 7; }
        this.n.forEach(function (v) { v.mutate(rmin, rmax); });
    };
    return Layer;
}());
;
var Neuron = /** @class */ (function () {
    function Neuron(c, f) {
        this.c = c;
        this.f = f;
    }
    Neuron.prototype.predict = function (na) {
        var _this = this;
        var ret = 0;
        na.forEach(function (v, i) {
            if (!_this.c[i])
                _this.c[i] = new Connection(Connection.mathUtils.generate_random_number(-1000, 1000));
            ret += _this.c[i].multiply(v);
        });
        ret = this.f(ret);
        return ret;
    };
    Neuron.prototype.mutate = function (rmin, rmax) {
        if (rmin === void 0) { rmin = -7; }
        if (rmax === void 0) { rmax = 7; }
        this.c.forEach(function (v) { v.mutate(rmin, rmax); });
    };
    Neuron.functions = Object.freeze({
        relu: function (n) { return Math.max(0, n); }
    });
    return Neuron;
}());
;
var Connection = /** @class */ (function () {
    function Connection(v) {
        this.v = v;
        this.check();
    }
    Connection.prototype.multiply = function (n) { return n * this.v; };
    ;
    Connection.prototype.check = function () {
        if (this.v > 1000)
            this.v = 1000;
        if (this.v < -1000)
            this.v = -1000;
    };
    Connection.prototype.mutate = function (rmin, rmax) {
        if (rmin === void 0) { rmin = -7; }
        if (rmax === void 0) { rmax = 7; }
        this.v += Connection.mathUtils.generate_random_number(rmin, rmax);
        this.check();
    };
    Connection.mathUtils = Object.freeze({
        generate_random_number: function (rmin, rmax) { return Math.floor(Math.random() * (rmax - rmin + 1) + rmin); }
    });
    return Connection;
}());
;
