// this file is the main ia file

class Neural {
    private f: Layer;
    private m: Layer[];
    private e: Layer;

    constructor(f: Layer, m: Layer[], e: Layer) {
        this.f = f;
        this.m = m;
        this.e = e;
    }

    predict(na: number[]): number[] {
        var n:number[] = this.f.predict(na);
        
        this.m.forEach(v => {
            n = v.predict(n);
        });

        return this.e.predict(n);
    }

    mutate(rmin:number = -7, rmax:number = 7) {
        this.f.mutate(rmin, rmax);

        this.m.forEach(v => v.mutate(rmin, rmax));

        this.e.mutate(rmin, rmax);
    }
};

class Layer {

    private n: Neuron[];
    private auto: boolean;
    private autoConn: Connection[];
    private autoFuncc: (x: number) => number;
    private unic: boolean = false;

    automaticConstruct(c: Connection[], f: (x: number) => number) {
        this.auto = true;
        this.n = [];
        this.autoConn = c;
        this.autoFuncc = f;
    }

    manualConstruct(n: Neuron[]) {
        this.auto = false;
        this.n = n;
    }

    setUnic(v: boolean) { this.unic = v; }

    predict(na: number[]): number[] {
        var ret: number[] = [];

        while (na.length > this.n.length && this.auto) {
            this.n.push(new Neuron(this.autoConn, this.autoFuncc));
        }

        this.n.forEach((v, i) => {
            if (this.unic) ret.push(v.predict([na[i]]));
            else ret.push(v.predict(na));
        });

        return ret;
    }

    mutate(rmin:number = -7, rmax:number = 7) { this.n.forEach(v => { v.mutate(rmin, rmax); }); }
};

class Neuron {
    private c: Connection[];
    private f: (x: number) => number;

    constructor(c: Connection[], f: (x: number) => number) {
        this.c = c;
        this.f = f;
    }

    predict(na: number[]): number {
        var ret = 0;
        
        na.forEach((v, i) => {
            if (!this.c[i]) this.c[i] = new Connection(Connection.mathUtils.generate_random_number(-1000, 1000));

            ret += this.c[i].multiply(v);
        });

        ret = this.f(ret);

        return ret;
    }

    mutate(rmin:number = -7, rmax:number = 7) { this.c.forEach(v => { v.mutate(rmin, rmax); }) }

    static functions = Object.freeze({
        relu: (n: number) => Math.max(0, n)
    });
};

class Connection {
    private v: number;

    constructor(v: number) {
        this.v = v;
        this.check();
    }

    multiply(n: number): number { return n * this.v; };

    check() {
        if (this.v > 1000) this.v = 1000;
        if (this.v < -1000) this.v = -1000
    }

    mutate(rmin: number = -7, rmax: number = 7) { this.v += Connection.mathUtils.generate_random_number(rmin, rmax); this.check(); }

    static mathUtils = Object.freeze({
        generate_random_number: (rmin:number, rmax:number) => Math.floor(Math.random() * (rmax - rmin + 1) + rmin)
    })
};


 