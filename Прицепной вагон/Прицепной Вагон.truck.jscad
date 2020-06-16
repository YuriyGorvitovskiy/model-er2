var WALL_DEPTH     = 0.160;
var WHEEL_RADIUS   = 2.75*WALL_DEPTH;
var WHEEL_DISTANCE = 2.600;

var WALL_HALF_DEPTH     = WALL_DEPTH/2;
var WHEEL_HALF_DISTANCE = WHEEL_DISTANCE/2;
var FEATURE_DEPTH       = 2 * WALL_DEPTH;
var WHEEL_HUB_RADIUS    = 0.3 * WHEEL_RADIUS;
var WHEEL_SPIRAL_RADIUS = 0.3 * WHEEL_RADIUS;
var WHEEL_SPIRAL_STEP   = 0.060;

var TRUCK_SPIRAL_RADIUS = 0.240;
var TRUCK_SPIRAL_STEP   = 0.080;

var BREAK_LEGTH       = 0.070;
var BREAK_PUMP_CONNECT= 0.100;
var BREAK_PUMP_CYL_1  = 0.200;
var BREAK_PUMP_CYL_2  = 0.200;
var BREAK_PUMP_LEGTH  = BREAK_PUMP_CONNECT + BREAK_PUMP_CYL_1 + BREAK_PUMP_CYL_2;
var BREAK_HALF_HEIGHT = WHEEL_RADIUS * 0.3;

var TRUCK_LEFT_LENGTH = WHEEL_HALF_DISTANCE + WHEEL_RADIUS + BREAK_PUMP_LEGTH;
var TRUCK_RIGHT_LENGTH= WHEEL_HALF_DISTANCE + WHEEL_RADIUS + BREAK_LEGTH + 0.04 ;
var TRUCK_BAR_WIDTH   = WHEEL_RADIUS * 0.4;

var TRUCK_HALF_LENGTH = WHEEL_HALF_DISTANCE + WHEEL_RADIUS + BREAK_LEGTH;
var TRUCK_TOP         = WHEEL_RADIUS * 0.8;
var TRUCK_BOTTOM      =-WHEEL_RADIUS * 0.6;

var PIVOT_BAR_WIDTH   = 3 * WALL_DEPTH;
var PIVOT_RADIUS      = 3 * WALL_DEPTH;
var AXIS_LENGTH       = (14.34 - 2) * WALL_DEPTH;
var AXIS_HALF_LENGTH  = AXIS_LENGTH / 2;

function main () {
    var left  = truck_side().rotateX(90).translate([0, -AXIS_HALF_LENGTH, 0]);
    var right = left.mirroredY();
    return union(
        left,
        right,
        truck_pivot(),
        support()
    )
    .scale([1000/160, 1000/160, 1000/160])
    .rotateX(180);
}

function support() {
    return union(
        CSG.cylinder({
            start: [0, -AXIS_HALF_LENGTH / 2, TRUCK_TOP],
            end:   [0, -AXIS_HALF_LENGTH / 2, TRUCK_TOP + 2 * WALL_DEPTH],
            radius: 0.04,
            resolution: 32
        }),
        CSG.cylinder({
            start: [0, AXIS_HALF_LENGTH / 2, TRUCK_TOP],
            end:   [0, AXIS_HALF_LENGTH / 2, TRUCK_TOP + 2 * WALL_DEPTH],
            radius: 0.04,
            resolution: 32
        })
    );
}
function truck_pivot(xCenter) {
    return difference(
        union(
            CSG.cylinder({
                start: [0, 0, WALL_DEPTH],
                end:   [0, 0, 2 * WALL_DEPTH],
                radius: PIVOT_RADIUS,
                resolution: 32
            }),
            CSG.cylinder({
                start: [0, 0, 0],
                end:   [0, 0, WALL_DEPTH],
                radius: 2.6 * WALL_DEPTH,
                resolution: 32
            }),
            CSG.cube({
                corner1: [-PIVOT_BAR_WIDTH/2, AXIS_HALF_LENGTH, WALL_DEPTH],
                corner2: [ PIVOT_BAR_WIDTH/2,-AXIS_HALF_LENGTH, 2 * WALL_DEPTH]
            }),
            CSG.cube({
                corner1: [-PIVOT_BAR_WIDTH/2, AXIS_HALF_LENGTH, 0],
                corner2: [-PIVOT_BAR_WIDTH/2 + WALL_DEPTH,-AXIS_HALF_LENGTH, WALL_DEPTH]
            }),
            CSG.cube({
                corner1: [ PIVOT_BAR_WIDTH/2, AXIS_HALF_LENGTH, 0],
                corner2: [ PIVOT_BAR_WIDTH/2 - WALL_DEPTH,-AXIS_HALF_LENGTH, WALL_DEPTH]
            })
        ),
        CSG.cylinder({
            start: [0, 0, 0],
            end:   [0, 0, 2 * WALL_DEPTH],
            radius: 1.6 * WALL_DEPTH,
            resolution: 32
        })
    ).translate([0, 0, TRUCK_TOP - 2 * WALL_DEPTH]);
}

function truck_side () {
    return difference(
        union(
            bar(),
            breaks(),
            truck_suspensions(),
            wheel_suspensions(),
            wheel_hub(-WHEEL_HALF_DISTANCE),
            wheel_hub( WHEEL_HALF_DISTANCE),
            generator(),
            back_wall_break_cylinder(),
            back_wall()
        ),
        union(
            back_clean(),
            axis_point(-WHEEL_HALF_DISTANCE),
            axis_point( WHEEL_HALF_DISTANCE)
        )
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

function back_clean(xCenter) {
    return CSG.cube({
        corner1: [-TRUCK_LEFT_LENGTH, TRUCK_TOP, -1],
        corner2: [ TRUCK_RIGHT_LENGTH, TRUCK_BOTTOM, 0]
    });
}

function axis_point(xCenter) {
    return CSG.cylinder({
        start: [xCenter, 0, 0],
        end:   [xCenter, 0, WALL_DEPTH + 0.02],
        radiusStart: WALL_DEPTH + 0.02,
        radiusEnd:   0,
        resolution: 32
    });
}

function back_wall() {
/*
    A-----------------------------------a
    |                                   |
    B           I-J       j-i           b
     C-D     G-H  |       |  h-g     d-c
       E-----F    |       |    f-----e
                  K-------k
*/
    var xA =-WHEEL_HALF_DISTANCE - WHEEL_RADIUS - BREAK_LEGTH;
    var xC =-WHEEL_HALF_DISTANCE - WHEEL_RADIUS;
    var xD =-WHEEL_HALF_DISTANCE - WHEEL_HUB_RADIUS - 2 * WHEEL_SPIRAL_RADIUS;
    var xG =-WHEEL_HALF_DISTANCE + WHEEL_HUB_RADIUS + 2 * WHEEL_SPIRAL_RADIUS;
    var xH =-WHEEL_HALF_DISTANCE + WHEEL_RADIUS;
    var xI =-WHEEL_HALF_DISTANCE + WHEEL_RADIUS + BREAK_LEGTH;
    var xJ =-2 * TRUCK_SPIRAL_RADIUS - 0.14;

    var yA = TRUCK_TOP - TRUCK_BAR_WIDTH;
    var yB = 0;
    var yC =-0.140;
    var yE = yA - 7 * WHEEL_SPIRAL_STEP;
    var yK = TRUCK_BOTTOM;

    var A = [xA, yA]; var a = [-xA, yA];
    var B = [xA, yB]; var b = [-xA, yB];
    var C = [xC, yC]; var c = [-xC, yC];
    var D = [xD, yC]; var d = [-xD, yC];
    var E = [xD, yE]; var e = [-xD, yE];
    var F = [xG, yE]; var f = [-xG, yE];
    var G = [xG, yC]; var g = [-xG, yC];
    var H = [xH, yC]; var h = [-xH, yC];
    var I = [xI, yB]; var i = [-xI, yB];
    var J = [xJ, yB]; var j = [-xJ, yB];
    var K = [xJ, yK]; var k = [-xJ, yK];

    return linear_extrude(
        {height: WALL_DEPTH},
        polygon([A, B, C, D, E, F, G, H, I, J, K, k, j, i, h, g, f, e, d, c, b, a], true)
    );
}

function back_wall_break_cylinder() {
/*
    A---------B
    |         |
    |         |
    D---------C
*/
    var xA = -TRUCK_LEFT_LENGTH + 0.060;
    var xB = xA + 0.210 + 0.110 + 0.120 + 0.200;

    var r1 = 0.150;
    var r3 = 0.040;

    var yA = TRUCK_TOP - TRUCK_BAR_WIDTH;
    var yD = yA - r1 - r3;

    var A = [xA, yA];
    var B = [xB, yA];
    var C = [xB, yD];
    var D = [xA, yD];

    return linear_extrude(
        {height: FEATURE_DEPTH - 0.02},
        polygon([A, B, C, D], true)
    );

}

function back_wall_break_cylinder_clear() {
/*
    A--B
    |   C--D
    |      E--F
    H---------G
*/
    var xA = -TRUCK_LEFT_LENGTH + 0.060;
    var xB = xA + 0.210;
    var xC = xB + 0.110;
    var xD = xC + 0.120;
    var xF = xD + 0.200;

    var r1 = 0.150;
    var r2 = 0.080;
    var r3 = 0.040;

    var yA = TRUCK_TOP - TRUCK_BAR_WIDTH;
    var yC = yA - r1 + r2;
    var yE = yA - r1 + r3;
    var yH = yA - r1 - r3;

    var A = [xA, yA];
    var B = [xB, yA];
    var C = [xC, yC];
    var D = [xD, yC];
    var E = [xD, yE];
    var F = [xF, yE];
    var G = [xF, yH];
    var H = [xA, yH];

    return linear_extrude(
        {height: FEATURE_DEPTH - 0.02},
        polygon([A, B, C, D, E, F, G, H], true)
    );
}

function breaks() {
    return union(
        break_cylinder(),
        break_left ( WHEEL_HALF_DISTANCE),
        break_right( WHEEL_HALF_DISTANCE),
        break_left (-WHEEL_HALF_DISTANCE),
        break_right(-WHEEL_HALF_DISTANCE)
    )
}

function break_cylinder() {
/*
              H--G
              |  |
+===+\         | |
A===B=C=D------E-F
+===+/
*/
   var xA =-TRUCK_LEFT_LENGTH + 0.040;
   var xB = xA + 0.230;
   var xC = xB + 0.110;
   var xD = xC + 0.120;
   var xE = xD + 0.200;
   var xF = xE + 0.080;
   var xH = xE - 0.080;

   var r1 = 0.150;
   var r2 = 0.080;
   var r3 = 0.040;

   var yA = TRUCK_TOP - TRUCK_BAR_WIDTH - r1;
   var yH = TRUCK_TOP;

   var E = [xE, yA - r3];
   var F = [xF, yA - r3];
   var G = [xF, yH];
   var H = [xH, yH];

   return union(
       CSG.cylinder({
           start: [xA, yA, FEATURE_DEPTH],
           end:   [xB, yA, FEATURE_DEPTH],
           radius: r1,
           resolution: 32
       }),
       CSG.cylinder({
           start: [xB, yA, FEATURE_DEPTH],
           end:   [xC, yA, FEATURE_DEPTH],
           radiusStart: r1,
           radiusEnd:   r2,
           resolution: 32
       }),
       CSG.cylinder({
           start: [xC, yA, FEATURE_DEPTH],
           end:   [xD, yA, FEATURE_DEPTH],
           radius: r2,
           resolution: 16
       }),
       CSG.cylinder({
           start: [xD, yA, FEATURE_DEPTH],
           end:   [xE, yA, FEATURE_DEPTH],
           radius: r3,
           resolution: 16
       }),
       linear_extrude(
           {height: FEATURE_DEPTH + r3},
           polygon([E, F, G, H], true)
       )
   );
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

    var depth1 = WALL_DEPTH + 0.40 * WALL_HALF_DEPTH;
    var depth2 = WALL_DEPTH + 0.25 * WALL_HALF_DEPTH;
    var A = [xCenter - WHEEL_RADIUS - BREAK_LEGTH - 0.04, TRUCK_TOP, 0];
    var B = [xCenter - WHEEL_RADIUS - BREAK_LEGTH, 0, depth1];
    return union(
        linear_extrude(
            {height: depth1},
            arc1.concat(arc2)
                .close()
                .innerToCAG()
        ),
        linear_extrude(
            {height: depth2},
            arc2.appendPoint([xCenter - WHEEL_RADIUS - BREAK_LEGTH , 0])
                .close()
                .innerToCAG()
        ),
        CSG.cube({ corner1: A, corner2: B})
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

    var depth1 = WALL_DEPTH + 0.40 * WALL_HALF_DEPTH;
    var depth2 = WALL_DEPTH + 0.25 * WALL_HALF_DEPTH;
    var A = [xCenter + WHEEL_RADIUS + BREAK_LEGTH + 0.04, TRUCK_TOP, 0];
    var B = [xCenter + WHEEL_RADIUS + BREAK_LEGTH, 0, depth1];

    return union(
        linear_extrude(
            {height: depth1},
            arc1.concat(arc2)
                .close()
                .innerToCAG()
        ),
        linear_extrude(
            {height: depth2},
            arc2.appendPoint([xCenter + WHEEL_RADIUS + BREAK_LEGTH , 0])
                .close()
                .innerToCAG()
        ),
        CSG.cube({ corner1: A, corner2: B})
    );
}

function bar() {
/*
      A------------------------B
     /                         |
    D--------------------------C
*/
    var TOP_HALF_LENGTH    = WHEEL_HALF_DISTANCE  + WHEEL_RADIUS;
    var BOTTOM_HALF_LENGTH = WHEEL_HALF_DISTANCE  - WHEEL_RADIUS;

    var xD =-TRUCK_LEFT_LENGTH;
    var xA =-TRUCK_LEFT_LENGTH + TRUCK_BAR_WIDTH;
    var xB = TRUCK_RIGHT_LENGTH;

    var yA = TRUCK_TOP;
    var yD = TRUCK_TOP - TRUCK_BAR_WIDTH;

    var A = [xA, yA];
    var B = [xB, yA];
    var C = [xB, yD];
    var D = [xD, yD];

    return linear_extrude({height: FEATURE_DEPTH},polygon([A, B, C, D], true));
}

function wheel_hub(xCenter) {
    var width = 0.9 * WHEEL_HUB_RADIUS;
    return union(
        CSG.cylinder({
            start: [xCenter, 0, 0],
            end:   [xCenter, 0, 1.2*FEATURE_DEPTH],
            radius: WHEEL_HUB_RADIUS,
            resolution: 32
        }),
        CSG.cube({
            corner1: [xCenter - width,-width, 0],
            corner2: [xCenter + width, width, FEATURE_DEPTH]
        })
    );

}
function generator() {
/*
    A=B---------C=D
*/
    var xA =-WHEEL_HALF_DISTANCE - WALL_HALF_DEPTH;
    var xB =-WHEEL_HALF_DISTANCE + WALL_HALF_DEPTH;
    var xC =-TRUCK_SPIRAL_RADIUS - WALL_HALF_DEPTH;
    var xD =-TRUCK_SPIRAL_RADIUS + WALL_HALF_DEPTH;
    var y = TRUCK_TOP - TRUCK_BAR_WIDTH / 2;

    return union(
        CSG.cylinder({
            start: [xA, y, FEATURE_DEPTH],
            end:   [xB, y, FEATURE_DEPTH],
            radius: TRUCK_BAR_WIDTH / 2,
            resolution: 32
        }),
        CSG.cylinder({
            start: [xB, y, FEATURE_DEPTH],
            end:   [xC, y, FEATURE_DEPTH],
            radius: WALL_HALF_DEPTH / 2,
            resolution: 32
        }),
        CSG.cylinder({
            start: [xC, y, FEATURE_DEPTH],
            end:   [xD, y, FEATURE_DEPTH],
            radius: TRUCK_BAR_WIDTH / 2,
            resolution: 32
        })
    );
}
function truck_suspensions() {
    return union(
        truck_suspension(-TRUCK_SPIRAL_RADIUS),
        truck_suspension( TRUCK_SPIRAL_RADIUS),
        truck_suspension_bar( 0.3 * WHEEL_RADIUS, 0.5 * TRUCK_SPIRAL_STEP),
        truck_suspension_bar(-2.5 * TRUCK_SPIRAL_STEP, TRUCK_BOTTOM),
        truck_suspension_hang(-2*TRUCK_SPIRAL_RADIUS - 0.08),
        truck_suspension_hang( 2*TRUCK_SPIRAL_RADIUS + 0.08),
        truck_suspension_cylinder()
    );
}
function truck_suspension(xCenter) {
    var y1 = 0;
    var y2 = y1 - TRUCK_SPIRAL_STEP;
    var y3 = y2 - TRUCK_SPIRAL_STEP;
    var r  = TRUCK_SPIRAL_RADIUS - 0.02;
    var z  = FEATURE_DEPTH / 2;

    return union(
        spiral_loop([xCenter, y1, z], r, TRUCK_SPIRAL_STEP),
        spiral_loop([xCenter, y2, z], r, TRUCK_SPIRAL_STEP),
        spiral_loop([xCenter, y3, z], r, TRUCK_SPIRAL_STEP)
    );
}

function truck_suspension_hang(xCenter) {
/*
    A---B
    |   |
    H---C
    |   |
    G---D
    |   |
    F---E
*/
    var xA = xCenter - 0.060;
    var xB = xCenter + 0.060;
    var yA = 0.4 * WHEEL_RADIUS - 0.02;
    var yF = TRUCK_BOTTOM + 0.02;
    var w = (yA - yF) / 3;
    var yH = yA - w;
    var yG = yF + w;

    var A = [xA, yA];
    var B = [xB, yA];
    var E = [xB, yF];
    var F = [xA, yF];
    return union(
        CSG.cube({
            corner1: [xA, yA, 0],
            corner2: [xB, yH, FEATURE_DEPTH]
        }),
        CSG.cube({
            corner1: [xA, yG, 0],
            corner2: [xB, yF, FEATURE_DEPTH]
        }),
        rectangular_extrude(
            [A, B, E, F],
            {w: 0.04, h: FEATURE_DEPTH - 0.02, closed: true}
        )
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

function truck_suspension_cylinder() {
    var r = 0.5 * WALL_DEPTH;
    var w = 0.5 * WALL_DEPTH;
    var z = FEATURE_DEPTH/2 + TRUCK_SPIRAL_RADIUS;
    return union(
        CSG.cylinder({
            start: [0, TRUCK_TOP,              z],
            end:   [0, 2.5 * TRUCK_SPIRAL_STEP,z],
            radius: r,
            resolution: 32
        }),
        CSG.cylinder({
            start: [0, 2.5 * TRUCK_SPIRAL_STEP,z],
            end:   [0, 0.5 * TRUCK_SPIRAL_STEP,z],
            radius: 0.8 * r,
            resolution: 32
        }),
        CSG.cube({ // define two opposite corners
            corner1: [-r, TRUCK_TOP,     FEATURE_DEPTH],
            corner2: [ r, TRUCK_TOP - w, z + r]
        }),
        CSG.cube({ // define two opposite corners
            corner1: [-r, 0.5 * TRUCK_SPIRAL_STEP + w, FEATURE_DEPTH],
            corner2: [ r, 0.5 * TRUCK_SPIRAL_STEP,     z + r]
        })
    );
}

function wheel_suspensions() {
    var x1 = -WHEEL_DISTANCE/2 - WHEEL_HUB_RADIUS - WHEEL_SPIRAL_RADIUS;
    var x2 = -WHEEL_DISTANCE/2 + WHEEL_HUB_RADIUS + WHEEL_SPIRAL_RADIUS;
    var x3 =  WHEEL_DISTANCE/2 - WHEEL_HUB_RADIUS - WHEEL_SPIRAL_RADIUS;
    var x4 =  WHEEL_DISTANCE/2 + WHEEL_HUB_RADIUS + WHEEL_SPIRAL_RADIUS;
    var y1 = TRUCK_TOP - TRUCK_BAR_WIDTH - 5.5 * WHEEL_SPIRAL_STEP;
    var y2 =  y1 - 1.5 * WHEEL_SPIRAL_STEP;
    var z  = FEATURE_DEPTH - WHEEL_SPIRAL_RADIUS + 0.02;

    return union(
        wheel_suspension(x1),
        wheel_suspension(x2),
        wheel_suspension(x3),
        wheel_suspension(x4),
        CSG.cube({
            corner1: [x1, y1, z - WHEEL_SPIRAL_RADIUS],
            corner2: [x2, y2, z + WHEEL_SPIRAL_RADIUS]
        }),
        CSG.cube({
            corner1: [x3, y1, z - WHEEL_SPIRAL_RADIUS],
            corner2: [x4, y2, z + WHEEL_SPIRAL_RADIUS]
        })
    );
}
function wheel_suspension(xCenter) {
    var yS1= TRUCK_TOP - TRUCK_BAR_WIDTH;
    var y1 = yS1 - 1.5*WHEEL_SPIRAL_STEP;
    var y2 = y1 - WHEEL_SPIRAL_STEP;
    var y3 = y2 - WHEEL_SPIRAL_STEP;
    var y4 = y3 - WHEEL_SPIRAL_STEP;
    var y5 = y4 - WHEEL_SPIRAL_STEP;
    var yS2= y5 - 1.5*WHEEL_SPIRAL_STEP;
    var r  = WHEEL_SPIRAL_RADIUS - 0.02;
    var z  = FEATURE_DEPTH - r;

    return union(
        CSG.cylinder({
            start: [xCenter, yS1, z],
            end:   [xCenter, y1,  z],
            radius: WHEEL_SPIRAL_RADIUS,
            resolution: 32
        }),
        spiral_loop([xCenter, y1, z], r, WHEEL_SPIRAL_STEP),
        spiral_loop([xCenter, y2, z], r, WHEEL_SPIRAL_STEP),
        spiral_loop([xCenter, y3, z], r, WHEEL_SPIRAL_STEP),
        spiral_loop([xCenter, y4, z], r, WHEEL_SPIRAL_STEP),
        spiral_loop([xCenter, y5, z], r, WHEEL_SPIRAL_STEP),
        CSG.cylinder({
            start: [xCenter, y5,  z],
            end:   [xCenter, yS2, z],
            radius: WHEEL_SPIRAL_RADIUS,
            resolution: 32
        })
    );
}

function spiral_loop(center, radius, step) {
    return torus({ ri: 0.5 * step, ro: radius - step / 2 }).rotateX(90).rotateZ(5).translate(center);
}
