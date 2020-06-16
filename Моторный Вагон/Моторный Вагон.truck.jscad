var WALL_DEPTH     = 0.160;
var WHEEL_RADIUS   = 0.525;
var WHEEL_DISTANCE = 2.600;

var WALL_HALF_DEPTH     = WALL_DEPTH/2;
var WHEEL_HALF_DISTANCE = WHEEL_DISTANCE/2;
var FEATURE_DEPTH       = 2 * WALL_DEPTH;
var WHEEL_HUB_RADIUS    = WALL_DEPTH;
var WHEEL_SPIRAL_RADIUS = WALL_DEPTH;
var WHEEL_SPIRAL_STEP   = WALL_DEPTH / 3;

var TRUCK_SPIRAL_RADIUS = 3 * WALL_DEPTH / 2;
var TRUCK_SPIRAL_STEP   = WALL_DEPTH / 2;

var BREAK_LEGTH       = 0.300;
var BREAK_HALF_HEIGHT = WHEEL_RADIUS * 0.3;
var TRUCK_HALF_LENGTH = WHEEL_HALF_DISTANCE + WHEEL_RADIUS + BREAK_LEGTH;
var TRUCK_TOP         = WHEEL_RADIUS * 0.8;
var TRUCK_BOTTOM      =-WHEEL_RADIUS * 0.6;


function main () {
    return union(
        wheel(-WHEEL_HALF_DISTANCE),
        wheel( WHEEL_HALF_DISTANCE),
        back_wall(),
        bar(),
        breaks(),
        truck_suspensions(),
        wheel_suspensions(),
        wheel_hub(-WHEEL_HALF_DISTANCE),
        wheel_hub( WHEEL_HALF_DISTANCE)
    );
}
function wheel(xCenter) {
    return CSG.cylinder({
        start: [xCenter, 0, -     WALL_DEPTH],
        end:   [xCenter, 0, - 2 * WALL_DEPTH],
        radius: WHEEL_RADIUS,
        resolution: 32
    });
}

function breaks() {
    return union(
        break_left ( WHEEL_HALF_DISTANCE),
        break_right( WHEEL_HALF_DISTANCE),
        break_left (-WHEEL_HALF_DISTANCE),
        break_right(-WHEEL_HALF_DISTANCE)
    )
}

function break_left(xCenter) {
    var arc1 = CSG.Path2D.arc({
        center: [xCenter, 0, 0],
        radius: WHEEL_RADIUS,
        startangle: 165,
        endangle:   195,
        resolution:  64
    });
    var arc2 = CSG.Path2D.arc({
        center: [xCenter, 0, 0],
        radius: WHEEL_RADIUS + WALL_HALF_DEPTH/2,
        startangle: 194,
        endangle:   166,
        resolution:  64
    });

    var depth = FEATURE_DEPTH - WALL_HALF_DEPTH;
    return union(
        linear_extrude(
            {height: depth},
            arc1.concat(arc2)
                .close()
                .innerToCAG()
        ),
        linear_extrude(
            {height: depth - WALL_HALF_DEPTH / 4},
            arc2.appendPoint([xCenter - WHEEL_RADIUS - WALL_HALF_DEPTH , 0])
                .close()
                .innerToCAG()
        )
    );
}

function break_right(xCenter) {
    var arc1 = CSG.Path2D.arc({
        center: [xCenter, 0, 0],
        radius: WHEEL_RADIUS,
        startangle: -15,
        endangle:    15,
        resolution:  64
    });
    var arc2 = CSG.Path2D.arc({
        center: [xCenter, 0, 0],
        radius: WHEEL_RADIUS + WALL_HALF_DEPTH/2,
        startangle:  14,
        endangle:   -14,
        resolution:  64
    });

    var depth = FEATURE_DEPTH - WALL_HALF_DEPTH;
    return union(
        linear_extrude(
            {height: depth},
            arc1.concat(arc2)
                .close()
                .innerToCAG()
        ),
        linear_extrude(
            {height: depth - WALL_HALF_DEPTH / 4},
            arc2.appendPoint([xCenter + WHEEL_RADIUS + WALL_HALF_DEPTH , 0])
                .close()
                .innerToCAG()
        )
    );
}

function back_wall() {
/*
    A--------------------------B
    |                          |
    |                          |
    N   __--K-J      G-F--__   C
     M-L      I------H      E-D
*/
    var xA =-TRUCK_HALF_LENGTH;
    var xM =-WHEEL_HALF_DISTANCE - 1.1 * WHEEL_RADIUS;
    var xL =-WHEEL_HALF_DISTANCE - 0.5 * WHEEL_RADIUS;
    var xK =-WHEEL_HALF_DISTANCE + 0.2 * WHEEL_RADIUS;
    var xJ =-WHEEL_HALF_DISTANCE + 0.9 * WHEEL_RADIUS;

    var yA = TRUCK_TOP;
    var yN =-BREAK_HALF_HEIGHT;
    var yM = TRUCK_BOTTOM;

    var A = [ xA, yA];
    var B = [-xA, yA];
    var C = [-xA, yN];
    var D = [-xM, yM];
    var E = [-xL, yM];
    var F = [-xK, yN];
    var G = [-xJ, yN];
    var H = [-xJ, yM];
    var I = [ xJ, yM];
    var J = [ xJ, yN];
    var K = [ xK, yN];
    var L = [ xL, yM];
    var M = [ xM, yM];
    var N = [ xA, yN];

    return linear_extrude({height: WALL_DEPTH},polygon([A, B, C, D, E, F, G, H, I, J, K, L, M, N], true));
}
function bar() {
/*
    A--------------------------B
    |                          |
    H--------G        D--------C
             |        |
             F--------E
*/
    var TOP_HALF_LENGTH    = WHEEL_HALF_DISTANCE  + WHEEL_RADIUS;
    var BOTTOM_HALF_LENGTH = WHEEL_HALF_DISTANCE  - WHEEL_RADIUS;

    var xA =-TOP_HALF_LENGTH;
    var xB = TOP_HALF_LENGTH;
    var xG =-BOTTOM_HALF_LENGTH;
    var xD = BOTTOM_HALF_LENGTH;

    var yA = TRUCK_TOP;
    var yH = WHEEL_RADIUS * 0.6;
    var yG = WHEEL_RADIUS * 0.5;
    var yF = WHEEL_RADIUS * 0.4;

    var A = [xA, yA];
    var B = [xB, yA];
    var C = [xB, yH];
    var D = [xD, yG];
    var E = [xD, yF];
    var F = [xG, yF];
    var G = [xG, yG];
    var H = [xA, yH];

    return linear_extrude({height: FEATURE_DEPTH},polygon([A, B, C, D, E, F, G, H], true));
}

function wheel_hub(xCenter) {
    return CSG.cylinder({
        start: [xCenter, 0, 0],
        end:   [xCenter, 0, FEATURE_DEPTH],
        radius: WHEEL_HUB_RADIUS,
        resolution: 32
    });
}

function truck_suspensions() {
    return union(
        truck_suspension(-TRUCK_SPIRAL_RADIUS),
        truck_suspension( TRUCK_SPIRAL_RADIUS),
        truck_suspension_bar( 0.4 * WHEEL_RADIUS,      0.5 * TRUCK_SPIRAL_STEP),
        truck_suspension_bar(-2.5 * TRUCK_SPIRAL_STEP, TRUCK_BOTTOM)
    );
}
function truck_suspension(xCenter) {
    var y1 = 0;
    var y2 = y1 - TRUCK_SPIRAL_STEP;
    var y3 = y2 - TRUCK_SPIRAL_STEP;
    var r  = TRUCK_SPIRAL_RADIUS;
    var z  = FEATURE_DEPTH / 2;

    return union(
        spiral_loop([xCenter, y1, z], r, TRUCK_SPIRAL_STEP),
        spiral_loop([xCenter, y2, z], r, TRUCK_SPIRAL_STEP),
        spiral_loop([xCenter, y3, z], r, TRUCK_SPIRAL_STEP)
    );
}

function truck_suspension_bar(yTop, yBottom) {
    var zCenter = FEATURE_DEPTH / 2;
    return union(
        CSG.cylinder({
            start: [-TRUCK_SPIRAL_RADIUS,    yTop, zCenter],
            end:   [-TRUCK_SPIRAL_RADIUS, yBottom, zCenter],
            radius: TRUCK_SPIRAL_RADIUS,
            resolution: 32
        }),
        CSG.cylinder({
            start: [ TRUCK_SPIRAL_RADIUS,    yTop, zCenter],
            end:   [ TRUCK_SPIRAL_RADIUS, yBottom, zCenter],
            radius: TRUCK_SPIRAL_RADIUS,
            resolution: 32
        }),
        CSG.cube({ // define two opposite corners
            corner1: [-TRUCK_SPIRAL_RADIUS,    yTop, zCenter - TRUCK_SPIRAL_RADIUS],
            corner2: [ TRUCK_SPIRAL_RADIUS, yBottom, zCenter + TRUCK_SPIRAL_RADIUS]
        })
    );
}

function wheel_suspensions() {
    var x1 = -WHEEL_DISTANCE/2 - WHEEL_HUB_RADIUS - WHEEL_SPIRAL_RADIUS;
    var x2 = -WHEEL_DISTANCE/2 + WHEEL_HUB_RADIUS + WHEEL_SPIRAL_RADIUS;
    var x3 =  WHEEL_DISTANCE/2 - WHEEL_HUB_RADIUS - WHEEL_SPIRAL_RADIUS;
    var x4 =  WHEEL_DISTANCE/2 + WHEEL_HUB_RADIUS + WHEEL_SPIRAL_RADIUS;
    var y1 = -2 * WHEEL_SPIRAL_STEP;
    var y2 =  2 * WHEEL_SPIRAL_STEP;
    return union(
        wheel_suspension(x1, y1),
        wheel_suspension(x2, y2),
        wheel_suspension(x3, y2),
        wheel_suspension(x4, y1)
    );
}
function wheel_suspension(xCenter, yCenter) {
    var y1 = yCenter + WHEEL_SPIRAL_STEP * 3 / 2;
    var y2 = yCenter + WHEEL_SPIRAL_STEP * 1 / 2;
    var y3 = yCenter - WHEEL_SPIRAL_STEP * 1 / 2;
    var y4 = yCenter - WHEEL_SPIRAL_STEP * 3 / 2;
    var r1 = WHEEL_SPIRAL_RADIUS;
    var r3 = r1 * 0.88;
    var r4 = r1 * 0.66;
    var z  = FEATURE_DEPTH - r1;

    return union(
        spiral_loop([xCenter, y1, z], r1, WHEEL_SPIRAL_STEP),
        spiral_loop([xCenter, y2, z], r1, WHEEL_SPIRAL_STEP),
        spiral_loop([xCenter, y3, z], r3, WHEEL_SPIRAL_STEP),
        spiral_loop([xCenter, y4, z], r4, WHEEL_SPIRAL_STEP)
    );
}

function spiral_loop(center, radius, step) {
    return torus({ ri: step / 2, ro: radius - step / 2 }).rotateX(90).rotateZ(5).translate(center);
}
