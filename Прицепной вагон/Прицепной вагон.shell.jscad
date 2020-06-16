function main () {
    // return transition();

    var wallRight = wall().rotateX(90);
    var wallLeft = wallRight.mirroredY();

    var roofRight = roof().rotateZ(-90).rotateY(-90);
    var roofLeft = roofRight.mirroredY();
    return  union(
        roofRight,
        roofLeft,
        wallRight.translate([0,-1.74 + 0.160, 0]),
        wallLeft.translate( [0, 1.74 - 0.160, 0]),
        ventilations(),
        transition()
    ).scale([1000/160, 1000/160, 1000/160]);
}
function ventilations() {
    var left = union(
        ventilation(-9.8 + 0.55 + 0.118 + 0.200),
        ventilation(-9.8 + 0.55 + 1.18 / 2 + 0.200)
    );
    var right = left.mirroredY();

    return union(left, right);
}

function ventilation(xCenter) {
/*
A---------B
|       C>D
|        >
|        >
|        >
|        >
E---------F
*/
    var length = 0.400;
    var height = 0.200;
    var step = height/5;

    var xA = 1.740 - 0.320;
    var xB = 1.740 + 0.040;
    var xC = 1.740;

    var yE = 2.540;
    var yA = yE + height;
    var yC = yA - step/2;
    var yD = yA - step;

    var A  = [xA, yA];
    var B  = [xB, yA];
    var C1 = [xC, yC];
    var C2 = [xC, yC - step];
    var C3 = [xC, yC - 2*step];
    var C4 = [xC, yC - 3*step];
    var C5 = [xC, yC - 4*step];
    var D1 = [xB, yD];
    var D2 = [xB, yD - step];
    var D3 = [xB, yD - 2*step];
    var D4 = [xB, yD - 3*step];
    var E  = [xA, yE];
    var F  = [xB, yE];

    var vent = linear_extrude({height: length}, polygon([A,B,C1,D1,C2,D2,C3,D3,C4,D4,C5,F,E], true));
    var side1 = CSG.cube({
        corner1: [xA, yA, 0],
        corner2: [xB, yE, 0.02]
    });
    var side2 = CSG.cube({
        corner1: [xA, yA, length],
        corner2: [xB, yE, length - 0.02]
    });

    return union(vent, side1, side2)
        .translate([0,0,xCenter - length/2])
        .rotateZ(-90)
        .rotateY(-90);
}

function transition() {
    var right = difference(
        union(
            transition_surface(),
            transition_tube(),
            transition_bevel_vertical(0.20),
            transition_bevel_vertical(0.60),
            transition_bevel_vertical(1.00),
            transition_bevel_vertical(1.40),
            transition_bevel_horisontal(0.240),
            transition_bevel_horisontal(0.652),
            transition_bevel_horisontal(1.064),
            transition_bevel_horisontal(1.476),
            transition_bevel_horisontal(1.888),
            transition_bevel_horisontal(2.300)
        ),
        transition_window()
    );
    var left = right.mirroredX();
    var connector1 = transition_connector(0.740 + 0.333*(1.740 - 0.740));
    var connector2 = transition_connector(0.740 + 0.667*(1.740 - 0.740));

    var front = union(left, right, connector1, connector2).rotateX(90);
    var back = front.mirroredY();

    var distance = 9.800 - 0.150 - 0.160;
    return union(front.translate([0,-distance,0]), back.translate([0,distance,0])).rotateZ(90);
}

function transition_bevel_vertical(xCenter) {
    var radius = 5.000 - 0.080;
    var yTop = 3.163 - 5.000 + Math.sqrt(radius * radius - xCenter * xCenter);
    var yBottom = 2.480;

    return CSG.cylinder({
        start: [xCenter, yTop, 0.160],
        end:   [xCenter, yBottom, 0.160],
        radius: 0.02,
        resolution: 16
    });
}

function transition_bevel_horisontal(yCenter) {
    var xRight = 1.740 - 0.080;
    var xLeft = 0.580;

    return CSG.cylinder({
        start: [xLeft, yCenter, 0.160],
        end:   [xRight, yCenter, 0.160],
        radius: 0.02,
        resolution: 16
    });
}

function transition_connector(xCenter) {
/*
        ---------
       /         \
    A-+-B       C-+-D
    | E=+===o===+=F |
    G-+-H       I-+-J
      \          /
       ---------
*/
    var radius = 0.12;
    var xO = xCenter;
    var xA = xO - 0.14;
    var xB = xA + 0.04;
    var xD = xO + 0.14;
    var xC = xD - 0.04;
    var xE = xO - radius;
    var xF = xO + radius;

    var yO = 0.470;
    var yA = yO + 0.04;
    var yG = yO - 0.04;


    var zOback = 0.160;
    var zOfront = zOback + 0.160;

    var zAback = zOback;
    var zAfront = zAback + 0.210;

    var block =  CSG.cylinder({
        start: [xO, yO, 0.160],
        end:   [xO, yO, 0.160 + 0.160],
        radius: 0.12,
        resolution: 16
    });

    var handle =  CSG.cylinder({
        start: [xE, yO, zOfront],
        end:   [xF, yO, zOfront],
        radius: 0.02,
        resolution: 16
    });

    var support1 = CSG.cube({
        corner1: [xA, yA, zAback],
        corner2: [xB, yG, zAfront]
    });

    var support2 = CSG.cube({
        corner1: [xC, yA, zAback],
        corner2: [xD, yG, zAfront]
    });

    return union(block, handle, support1, support2);
}

function transition_window() {
/*
A--------B
|          \
|        O   C
|            |
|        P   D
|          /
E--------F
*/
     var radius = 0.070;
     var xA = 0;
     var xC = xA + 0.210;
     var xB = xC - radius;

     var yE = 1.621;
     var yA = yE + 0.279;
     var yC = yA - radius;
     var yD = yE + radius;

     var A = [xA, yA];
     var E = [xA, yE];
     var O = [xB, yC];
     var P = [xB, yD];

     var path = CSG.Path2D.arc({center: O, radius: radius, startangle: 90, endangle: 0, resolution: 16})
        .concat(CSG.Path2D.arc({center: P, radius: radius, startangle: 0, endangle: -90, resolution: 16}))
        .appendPoint(E)
        .appendPoint(A)
        .close();

    return linear_extrude({height: 0.200}, path.innerToCAG());
}
function transition_tube() {
/*
A---------B
|         |
C-----D   E
      |    \
      |    |
      |    |
      |    |
      |     \
F-----G     H
|           |
I---J       |
     \      |
      K-----L
*/
    var xA = 0;
    var xB = xA + 0.580;
    var xH = xA + 0.740;
    var xD = xH - 0.320;
    var xJ = xA + 0.320;

    var yA = 2.480;
    var yC = yA - 0.160;
    var yK = 0.100;
    var yF = yK + 0.320;
    var yI = yF - 0.160;

    var A = [xA, yA];
    var B = [xB, yA];
    var C = [xA, yC];
    var D = [xD, yC];
    var E = [xB, yC];
    var F = [xA, yF];
    var G = [xD, yF];
    var H = [xH, yF];
    var I = [xA, yI];
    var J = [xJ, yI];
    var K = [xD, yK];
    var L = [xH, yK];

    return linear_extrude({height: 0.600}, polygon([A,B,E,H,L,K,J,I,F,G,D,C], true));
}
function transition_surface() {
/*
A-----------\
|           \----\
|                 |
|                 B
|                 |
|                 |
|                 |
|                 |
C-----------------D
*/
    var xC = 0;
    var xD = 1.740 - 0.080;

    var yC = 0;

    var path = roof_line()
            .appendPoint([xD, yC])
            .appendPoint([xC, yC])
            .close();
    return linear_extrude({height: 0.160}, path.innerToCAG());
}

function roof() {
    return union(
        roof_surface(),
        roof_bevel(0.20),
        roof_bevel(0.60),
        roof_bevel(1.00),
        roof_bevel(1.40),
        roof_visor()
    );
}

function roof_bevel(xCenter) {
    var yCenter = 3.163 - 5.000 + Math.sqrt(5.000 * 5.000 - xCenter * xCenter);

    return CSG.cylinder({
        start: [xCenter, yCenter,-9.8],
        end:   [xCenter, yCenter, 9.8],
        radius: 0.04,
        resolution: 16
    });
}

function roof_visor() {
 /*
    A
    | \
    C---B
 */
    var xA = 1.74;
    var xB = xA + 0.04;

    var yA = 2.50 + 0.02;
    var yB = 2.50 - 0.02;

    var A = [xA, yA];
    var B = [xB, yB];
    var C = [xA, yB];

    return linear_extrude({height: 2 * 9.8}, polygon([A,B,C], true)).translate([0,0,-9.8]);
}
function roof_surface() {
    var path = roof_line();
    return path.rectangularExtrude(0.160, 2 * 9.8, 16, false).translate([0,0,-9.8]);
}

function roof_line() {
/*
    A-----\
    :     \-------B---C
    :                 : \
    :                :   \
    :               O     D
    :                     |
    :                     E
    :
    :
    P
*/
    var xA = 0;
    var xD = 1.740 - 0.080;
    var xO = xD - 0.450 + 0.080;

    var yD = 2.526;
    var yE = 2.500;
    var yP = 3.163 - 5.000;

    var rO = 0.450 - 0.080;
    var rP = 5.000 - 0.080;

    var angle = 75;

    return CSG.Path2D.arc({
        center: [xA,yP,0],
        radius: rP,
        startangle: 90,
        endangle:   angle,
        resolution: 128
    }).concat(CSG.Path2D.arc({
        center: [xO,yD,0],
        radius: rO,
        startangle: angle,
        endangle:   0,
        resolution: 64
    })).appendPoint([xD, yE]);
}

function wall() {
    var xDoorLeft = -9.8 + 1.18 / 2  + 0.55;
    var xDoorRight = 9.8 - 1.18 / 2  - 0.55;
    return union(
        difference(
            union(
                wall_surface(),
                wall_drop(xDoorLeft),
                wall_drop(xDoorRight),
                door_support(xDoorLeft),
                door_support(xDoorRight)
            ),
            union(
                windows(),
                doors()
            )
        ),
        wall_bottom(),
        wall_bevels()
    );
}

function doors() {
    return union(
        door(-9.8 + 0.55 + 1.18 / 2),
        door( 9.8 - 0.55 - 1.18 / 2)
    );
}

function door(xCenter) {
/*
  B---C---D
 /    |    \
A     |     E
|     |     |
|     |     |
|     |     |
|     |     |
|     |     |
|     |     |
F-----G-----H
|           |
I-----------J
*/
    var xAB = 0.118;
    var xAE = 1.18;

    var yAB = 0.118;
    var yFI = 0.2;

    var xC = xCenter;
    var xA = xC - xAE / 2;
    var xB = xA + xAB;
    var xE = xA + xAE;
    var xD = xE - xAB;

    var yB = 2.243;
    var yA = yB - xAB;
    var yF = -0.372;
    var yI = yF - yFI;

    var A = [xA, yA];
    var B = [xB, yB];
    var D = [xD, yB];
    var E = [xE, yA];
    var F = [xA, yF];
    var H = [xE, yF];
    var I = [xA, yI];
    var J = [xE, yI];

    var door_shape = polygon([A,B,D,E,H,F], true);
    var step_shape = polygon([F,H,J,I], true);

    var door_handle1 = door_handle(0.98 + 0.16/2);
    var door_handle2 = door_handle1.mirroredX();

    var door_handle3 = door_handle(0.24 - 0.16/2);
    var door_handle4 = door_handle3.mirroredX();

    var door_slide1 = door_slide(0.66 + 0.03);
    var door_slide2 = door_slide1.mirroredX();
    var door_slide3 = door_slide(0.03);
    var door_slide4 = door_slide3.mirroredX();

    return difference(
        union(
            linear_extrude({height: 0.1}, door_shape).translate([0,0,0.1]),
            linear_extrude({height: 0.2}, step_shape),
            CSG.cube({
                corner1: [xC - 0.025, yB, 0.08],
                corner2: [xC + 0.025, yF, 0.16]
            }),
            door_handle1.translate([xC,0,0.1 - 0.04]),
            door_handle2.translate([xC,0,0.1 - 0.04]),
            door_handle3.translate([xC,0,0.1 - 0.04]),
            door_handle4.translate([xC,0,0.1 - 0.04])
        ),
        union(
            door_slide1.translate([xC,0,0]),
            door_slide2.translate([xC,0,0]),
            door_slide3.translate([xC,0,0]),
            door_slide4.translate([xC,0,0])
        )
    );
}
function door_slide(yCenter) {
    return union(
        CSG.cube({
            corner1: [-1.18/2, yCenter - 0.03, 0.1],
            corner2: [-0.025,  yCenter + 0.03, 0.12]
        }),
        CSG.cylinder({
            start: [-1.18/2, yCenter + 0.05, 0.1],
            end:   [-1.18/2, yCenter - 0.05, 0.1],
            radius: 0.05,
            resolution: 16
        })
    )
}
function door_handle(yCenter) {
    /*
       B-------C
     ( |       |
    A--P       |
    |          |
    |          |
    |          |
    D--Q       |
     ( |       |
       E-------F
    */
    var xAC = 0.04;
    var yCF = 0.10;
    var radius = 0.02;

    var xC = -0.05;
    var xA = xC - xAC;
    var xB = xA + radius;

    var yB = yCenter + yCF / 2;
    var yE = yCenter - yCF / 2;
    var yA = yB - radius;
    var yD = yE + radius;

    var A = [xA, yA];
    var B = [xB, yB];
    var C = [xC, yB];
    var D = [xA, yD];
    var E = [xB, yE];
    var F = [xC, yE];

    var P = [xB, yA];
    var Q = [xB, yD];

    return linear_extrude({height: 0.14},
            union(
                polygon([A,B,C,F,E,D], true),
                CAG.circle({center: P, radius: radius, resolution: 16}),
                CAG.circle({center: Q, radius: radius, resolution: 16})
            )
    );
}

function windows() {
    return linear_extrude({height: 0.4}, windows_shape()).translate([0,0,-0.2]);
}
function windows_shape() {
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
        window_shape(xG, xGH),
        window_shape(xI, xGH),
        window_shape(xK, xKL),
        window_shape(xM1, xMN),
        window_shape(xM2, xMN),
        window_shape(xM3, xMN),
        window_shape(xM4, xMN),
        window_shape(xM5, xMN),
        window_shape(xM6, xMN),
        window_shape(xM7, xMN),
        window_shape(xM8, xMN),
        window_shape(xM9, xMN),
        window_shape(xO, xGH),
        window_shape(xP, xGH)
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
*/
    var xCH = width;
    var yAF = 0.9;
    var radius = 0.11;

    var xH = position;
    var xA = xH + radius;
    var xC = xH + xCH;
    var xB = xC - radius;

    var yA = 1.145;
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

function wall_bevels() {
    var wBetweenDoors = 2*(9.8 - 0.55 - 1.18);
    var xBetweenDoors = 0;
    var wDoorEnd = 0.55;
    var xDoorLeft   = -9.8 + 0.55 / 2;
    var xDoorLeft2  = -9.8 + 0.55 + 1.18 + 0.55 / 2;
    var xDoorRight  =  9.8 - 0.55 / 2;
    var xDoorRight2 =  9.8 - 0.55 - 1.18 - 0.55 / 2;
    var wBetweenWindows = 0.500;
    var wBetweenDoorWindow = 2.325 - 1.18 - 0.55;
    var xStepWindow = 1.100 + wBetweenWindows;
    var xDoorWindowLeft  = -9.8 + 0.55 + 1.18 + wBetweenDoorWindow / 2;
    var xDoorWindowRight =  9.8 - 0.55 - 1.18 - wBetweenDoorWindow / 2;
    var xWindow1 = -9.8 + 2.325 + 0.55 + wBetweenWindows / 2;
    var xWindow2 = xWindow1 + xStepWindow;
    var xWindow3 = xWindow2 + xStepWindow;
    var xWindow4 = xWindow3 + xStepWindow;
    var xWindow5 = xWindow4 + xStepWindow + xStepWindow;
    var xWindow6 = xWindow5 + xStepWindow;
    var xWindow7 = xWindow6 + xStepWindow;
    var xWindow8 = xWindow7 + xStepWindow;

    var y1 = 2.130;
    var y2 = 1.745;
    var y3 = 1.445;
    var y4 = 1.050;
    var y5 = 0.800;
    var y6 = 0.550;
    var y7 = 0.300;
    var y8 = 0.050;
    var y9 =-0.200;

    return union(
        wall_bevel(xDoorLeft, y1, wDoorEnd, true),wall_bevel(xBetweenDoors, y1, wBetweenDoors, true),wall_bevel(xDoorRight, y1, wDoorEnd, true),
        wall_bevel(xDoorLeft, y2, wDoorEnd),
            wall_bevel(xDoorWindowLeft, y2, wBetweenDoorWindow),
            wall_bevel(xWindow1, y2, wBetweenWindows),
            wall_bevel(xWindow2, y2, wBetweenWindows),
            wall_bevel(xWindow3, y2, wBetweenWindows),
            wall_bevel(xWindow4, y2, wBetweenWindows),
            wall_bevel(xWindow5, y2, wBetweenWindows),
            wall_bevel(xWindow6, y2, wBetweenWindows),
            wall_bevel(xWindow7, y2, wBetweenWindows),
            wall_bevel(xWindow8, y2, wBetweenWindows),
            wall_bevel(xDoorWindowRight, y2, wBetweenDoorWindow),
        wall_bevel(xDoorRight, y2, wDoorEnd),
        wall_bevel(xDoorLeft, y3, wDoorEnd),
        wall_bevel(xDoorWindowLeft, y3, wBetweenDoorWindow),
            wall_bevel(xWindow1, y3, wBetweenWindows),
            wall_bevel(xWindow2, y3, wBetweenWindows),
            wall_bevel(xWindow3, y3, wBetweenWindows),
            wall_bevel(xWindow4, y3, wBetweenWindows),
            wall_bevel(xWindow5, y3, wBetweenWindows),
            wall_bevel(xWindow6, y3, wBetweenWindows),
            wall_bevel(xWindow7, y3, wBetweenWindows),
            wall_bevel(xWindow8, y3, wBetweenWindows),
        wall_bevel(xDoorWindowRight, y3, wBetweenDoorWindow),
        wall_bevel(xDoorRight, y3, wDoorEnd),
        wall_bevel(xDoorLeft, y4, wDoorEnd, true),wall_bevel(xBetweenDoors, y4, wBetweenDoors, true),wall_bevel(xDoorRight, y4, wDoorEnd, true),
        wall_bevel(xDoorLeft, y4, wDoorEnd),wall_bevel(xBetweenDoors, y4, wBetweenDoors),wall_bevel(xDoorRight, y4, wDoorEnd),
        wall_bevel(xDoorLeft, y5, wDoorEnd),wall_bevel(xBetweenDoors, y5, wBetweenDoors),wall_bevel(xDoorRight, y5, wDoorEnd),
        wall_bevel(xDoorLeft, y6, wDoorEnd),wall_bevel(xBetweenDoors, y6, wBetweenDoors),wall_bevel(xDoorRight, y6, wDoorEnd),
        wall_bevel(xDoorLeft, y7, wDoorEnd),wall_bevel(xBetweenDoors, y7, wBetweenDoors),wall_bevel(xDoorRight, y7, wDoorEnd),
        wall_bevel(xDoorLeft, y8, wDoorEnd),wall_bevel(xDoorLeft2, y8, wDoorEnd),wall_bevel(xDoorRight2, y8, wDoorEnd),wall_bevel(xDoorRight, y8, wDoorEnd),
        wall_bevel(xDoorLeft, y9, wDoorEnd),wall_bevel(xDoorLeft2, y9, wDoorEnd),wall_bevel(xDoorRight2, y9, wDoorEnd),wall_bevel(xDoorRight, y9, wDoorEnd)
    );
}

function wall_bevel(xCenter, yCenter, width, isLarge) {
    var radius = isLarge ? 0.03 : 0.02;
    var xLeft = xCenter - width / 2 + radius;
    var xRight = xCenter + width / 2 - radius;
    var left = [xLeft, yCenter, 0.160];
    var right = [xRight, yCenter, 0.160];

    var parts = [
        CSG.cylinder({
            start: left,
            end: right,
            radius: radius,
            resolution: 16
        }),
        CSG.sphere({
            center: left,
            radius: radius,
            resolution: 16
        }),
        CSG.sphere({
            center: right,
            radius: radius,
            resolution: 16
        })
    ];
    if (isLarge) {
        parts.push(
            CSG.cube({
                corner1: [xLeft - radius, yCenter - 0.06, 0.160],
                corner2: [xRight + radius, yCenter + 0.06, 0.180]
            })
        );
    }
    return union(parts);
}

function door_support(xCenter) {
    /*
    A-----------B
    |           |
    |           |
    |           |
    |           |
    C           F
     \         /
      D-------E
    */
    var xAB = 1.18 + 2 * (0.55 - 0.37);
    var xCD = 0.47 - 0.37;

    var yAC = 0.372;
    var yDE = 0.312;

    var xA = xCenter - xAB / 2;
    var xB = xA + xAB;
    var xD = xA + xCD;
    var xE = xB - xCD;

    var yA = 2.500;
    var yC =-0.372;
    var yD = yC - 0.312;

    var A = [xA, yA];
    var B = [xB, yA];
    var C = [xA, yC];
    var D = [xD, yD];
    var E = [xE, yD];
    var F = [xB, yC];

    return linear_extrude({height: 0.160}, polygon([A,B,F,E,D,C], true)).translate([0,0,-0.160]);
}


function wall_drop(xCenter) {
    /*
    A-------------------B
    |                   |
    C---D           G---H
         \         /
          E-------F
    */
    var xAB = 1.18 + 2 * 0.55;
    var xCD = 0.37;
    var xCE = 0.47;
    var xEF = xAB - 2 * xCE;

    var yAC = 0.372;
    var yDE = 0.312;

    var xA = xCenter - xAB / 2;
    var xB = xA + xAB;
    var xD = xA + xCD;
    var xE = xA + xCE;
    var xG = xB - xCD;
    var xF = xB - xCE;

    var yA = 0;
    var yC = yA - yAC;
    var yE = yC - yDE;

    var A = [xA, yA];
    var B = [xB, yA];
    var C = [xA, yC];
    var D = [xD, yC];
    var E = [xE, yE];
    var F = [xF, yE];
    var G = [xG, yC];
    var H = [xB, yC];

    return linear_extrude({height: 0.160}, polygon([A,B,H,G,F,E,D,C], true));
}

function wall_surface() {
/*
A---------------------------------------------------------------------B
|                                                                     |
|                                                                     |
|                                                                     |
|           E---------------------------------------------F           |
C-----------D                      O                      G-----------H
*/
    var xAO = 9.8;
    var xCD = 1.18 + 2 * 0.55;
    var yAO = 2.5;
    var yEO = 0.160;

    var xO = 0;
    var yO = 0;

    var xA = xO - xAO;
    var xB = xO + xAO;
    var xD = xA + xCD;
    var xG = xB - xCD;

    var yA = yO + yAO;
    var yE = yO + yEO;

    var A = [xA, yA];
    var B = [xB, yA];
    var C = [xA, yO];
    var D = [xD, yO];
    var E = [xD, yE];
    var F = [xG, yE];
    var G = [xG, yO];
    var H = [xB, yO];

    return linear_extrude({height: 0.160}, polygon([A,B,H,G,F,E,D,C], true));
}

function wall_bottom() {
    var xLeft = -9.8 + 1.18 + 2 * 0.55;
    var xRight = 9.8 - 1.18 - 2 * 0.55;
    return  difference(
        CSG.cylinder({
            start: [xLeft, 0.160, 0],
            end:   [xRight, 0.160, 0],
            radius: 0.160,
            resolution: 16
        }),
        CSG.cube({
            corner1: [xLeft, 0, -0.160],
            corner2: [xRight, 0.320, 0]
        })
    );
}
