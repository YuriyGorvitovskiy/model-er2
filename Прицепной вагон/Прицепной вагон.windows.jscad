function main () {
    return  union(
        windows_support(),
        windows()
    ).scale([1000/160, 1000/160, 1000/160]);
}

function windows_support() {
    return linear_extrude({height: 0.160}, windows_support_shape());
}

function windows_support_shape() {
    /*
    A-----------B E------------------...-----------F I-----------J
    | +--+ +--+ | | +---+  +------+       +------+ | | +--+ +--+ |
    | |  | |  | C-D |   |  |      |       |      | G-H |  | |  | |
    | |D1| |D2| R-Q | S |  |  W1  |       |  W9  | N-M |D3| |D4| |
    | +--+ +--+ | | +---+  +------+       +------+ | | +--+ +--+ |
    T-----------S P------------------...-----------O L-----------K
    */
    var border = 0.160;
    var door = 1.18;
    var gap = 0.50;
    var xSW = 0.55;
    var xWN = 1.10;

    var xAB = door + 2 * (border - 0.118);
        var xEF = 2 * border + xSW + 9 * xWN + 9 * gap;
    var yAT = 0.9 + 2 * border;

    var xA = -9.8 + 0.55 - (border - 0.118);
    var xB = xA + xAB;
    var xE = -9.8 + 2.325 - border;
    var xF = xE + xEF;

    var xJ = 9.8 - 0.55;
    var xI = xJ - xAB;

    var yT = 1.145 - border;
    var yA = yT + yAT;
    var yC = yT + yAT / 2 + border;
    var yR = yC - 2 * border;

    var A = [xA, yA];
    var B = [xB, yA];
    var C = [xB, yC];
    var D = [xE, yC];
    var E = [xE, yA];
    var F = [xF, yA];
    var G = [xF, yC];
    var H = [xI, yC];
    var I = [xI, yA];
    var J = [xJ, yA];
    var K = [xJ, yT];
    var L = [xI, yT];
    var M = [xI, yR];
    var N = [xF, yR];
    var O = [xF, yT];
    var P = [xE, yT];
    var Q = [xE, yR];
    var R = [xB, yR];
    var S = [xB, yT];
    var T = [xA, yT];

    return polygon([A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T], true);
}

function windows() {
/*
A-------------------------------- ... -------------------------B
| C-----------D                                  E-----------F |
| | G--H I--J |  K---L  M------N       +------+  | O--+ P--+ | |
| | |  | |  | |  |   |  |      |       |      |  | |  | |  | | |
| | |D1| |D2| |  | S |  |  W1  |       |  W9  |  | |D3| |D4| | |
| | +--+ +--+ |  +---+  +------+       +------+  | +--+ +--+ | |
*/
    var xAC = 0.55;
    var xCD = 1.18;
    var xCG = 0.118;
    var xGH = 0.393;

    var xAK = 2.325;
    var xKL = 0.55;
    var xLM = 0.50;
    var xMN = 1.1;

    var xA = -9.8;
    var xB = 9.8;
    var xC = xA + xAC;
    var xD = xC + xCD;
    var xF = xB - xAC;
    var xE = xF - xCD;

    var xG = xC + xCG;
    var xI = xD - xCG - xGH;
    var xO = xE + xCG;
    var xP = xF - xCG - xGH;

    var xK = xA + xAK;
    var xM1 = xK + xKL + xLM;
    var xM2 = xM1 + xMN + xLM;
    var xM3 = xM2 + xMN + xLM;
    var xM4 = xM3 + xMN + xLM;
    var xM5 = xM4 + xMN + xLM;
    var xM6 = xM5 + xMN + xLM;
    var xM7 = xM6 + xMN + xLM;
    var xM8 = xM7 + xMN + xLM;
    var xM9 = xM8 + xMN + xLM;

    return union(
        linear_extrude({height: 0.420}, window_shape(xG, xGH)),
        linear_extrude({height: 0.420}, window_shape(xI, xGH)),
        linear_extrude({height: 0.320}, window_shape(xK, xKL)),
        linear_extrude({height: 0.320}, window_shape(xM1, xMN)),
        linear_extrude({height: 0.320}, window_shape(xM2, xMN)),
        linear_extrude({height: 0.320}, window_shape(xM3, xMN)),
        linear_extrude({height: 0.320}, window_shape(xM4, xMN)),
        linear_extrude({height: 0.320}, window_shape(xM5, xMN)),
        linear_extrude({height: 0.320}, window_shape(xM6, xMN)),
        linear_extrude({height: 0.320}, window_shape(xM7, xMN)),
        linear_extrude({height: 0.320}, window_shape(xM8, xMN)),
        linear_extrude({height: 0.320}, window_shape(xM9, xMN)),
        linear_extrude({height: 0.420}, window_shape(xO, xGH)),
        linear_extrude({height: 0.420}, window_shape(xP, xGH))
    );
}

function window_shape(position, width) {
/*
   F-------E
 ( |       | )
G--S       R--D
|             |
|             |
|             |
H--P       Q--C
 ( |       | )
   A-------B
   We should shrink the size of the window by 0.05mm in the model from each side.
   0.05*160/1000 = 0.008
*/
    var shrink = 0.008;
    var xCH = width - 2 * shrink;
    var yAF = 0.9 - 2 * shrink;
    var radius = 0.11 - shrink;

    var xH = position + shrink;
    var xA = xH + radius;
    var xC = xH + xCH;
    var xB = xC - radius;

    var yA = 1.145 + shrink;
    var yC = yA + radius;
    var yE = yA + yAF;
    var yD = yE - radius;

    var A = [xA, yA];
    var B = [xB, yA];
    var C = [xC, yC];
    var D = [xC, yD];
    var E = [xB, yE];
    var F = [xA, yE];
    var G = [xH, yD];
    var H = [xH, yC];
    var P = [xA, yC];
    var Q = [xB, yC];
    var R = [xB, yD];
    var S = [xA, yD];

    return union(
        polygon([A,B,C,D,E,F,G,H], true),
        CAG.circle({center: P, radius: radius, resolution: 16}),
        CAG.circle({center: Q, radius: radius, resolution: 16}),
        CAG.circle({center: R, radius: radius, resolution: 16}),
        CAG.circle({center: S, radius: radius, resolution: 16})
    );
}
