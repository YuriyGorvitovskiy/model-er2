var WAGON_HALF_WIDTH  = 1.740;
var WAGON_HALF_LENGTH = 9.800;
var TRANSITION_DEPTH  = 0.150;
var PIVOT_DISTANCE    =13.300;

var WALL_WIDTH       = 0.160;
var WALL_HALF_WIDTH  = WALL_WIDTH / 2;
var BAR_HEIGHT       = WALL_WIDTH / 2;
var BAR_MAIN_HEIGHT  = WALL_WIDTH;
var GAP              = 0.010;
var PIVOT_HEIGHT     = 3 * WALL_WIDTH;
var PIVOT_RADIUS     = 3 * WALL_WIDTH;
var PIVOT_LEFT       =-PIVOT_DISTANCE / 2;
var PIVOT_RIGHT      = PIVOT_DISTANCE / 2;

var PIN_RADIUS       = 1.4 * WALL_WIDTH;
var PIN_HEIGHT       = 3   * WALL_WIDTH;

var PIN_BALL_RADIUS  = PIN_RADIUS;
var PIN_BALL_Z_CENTER= PIVOT_HEIGHT + PIN_HEIGHT;
var PIN_BALL_Y_SHIFT = 0.5 * WALL_WIDTH;

var FRAME_HALF_WIDTH  = WAGON_HALF_WIDTH - WALL_WIDTH - GAP;
var FRAME_HALF_LENGTH = WAGON_HALF_LENGTH - TRANSITION_DEPTH - WALL_WIDTH - GAP;

var FRAME_WIDTH       = 2 * FRAME_HALF_WIDTH;
var FRAME_LENGTH      = 2 * FRAME_HALF_LENGTH;

var FRAME_LEFT        = -FRAME_HALF_LENGTH;
var FRAME_RIGHT       =  FRAME_HALF_LENGTH;
var FRAME_TOP         =  FRAME_HALF_WIDTH;
var FRAME_BOTTOM      = -FRAME_HALF_WIDTH;

var STEP_SUPPORT_BAR_L = 1.10;
var STEP_SUPPORT_BAR_S = 0.50;
var X_SUPPORT_BAR_1 = -WAGON_HALF_LENGTH + 2.325 + 0.55 + 0.50 + 1.10 + 0.50;
var X_SUPPORT_BAR_2 = X_SUPPORT_BAR_1  + STEP_SUPPORT_BAR_L;
var X_SUPPORT_BAR_3 = X_SUPPORT_BAR_2  + STEP_SUPPORT_BAR_S;
var X_SUPPORT_BAR_4 = X_SUPPORT_BAR_3  + STEP_SUPPORT_BAR_L;
var X_SUPPORT_BAR_5 = X_SUPPORT_BAR_4  + STEP_SUPPORT_BAR_S;
var X_SUPPORT_BAR_6 = X_SUPPORT_BAR_5  + STEP_SUPPORT_BAR_L;
var X_SUPPORT_BAR_7 = X_SUPPORT_BAR_6  + STEP_SUPPORT_BAR_S;
var X_SUPPORT_BAR_8 = X_SUPPORT_BAR_7  + STEP_SUPPORT_BAR_L;
var X_SUPPORT_BAR_9 = X_SUPPORT_BAR_8  + STEP_SUPPORT_BAR_S;
var X_SUPPORT_BAR_10= X_SUPPORT_BAR_9  + STEP_SUPPORT_BAR_L;
var X_SUPPORT_BAR_11= X_SUPPORT_BAR_10 + STEP_SUPPORT_BAR_S;
var X_SUPPORT_BAR_12= X_SUPPORT_BAR_11 + STEP_SUPPORT_BAR_L;
var X_SUPPORT_BAR_13=-X_SUPPORT_BAR_1;


function main () {
    return union(
        frame_plane(),
        frame_pivot(PIVOT_LEFT),
        frame_pivot(PIVOT_RIGHT),
        frame_bars(),
        truck_pin(PIVOT_LEFT),
        truck_pin(PIVOT_RIGHT)
        //truck(PIVOT_LEFT),
        //truck(PIVOT_RIGHT)
    ).scale([1000/160, 1000/160, 1000/160]);
}

function truck(xCenter) {
    return difference(
        union(
            CSG.cylinder({
                start: [xCenter, 0, 0],
                end:   [xCenter, 0, 2 * WALL_WIDTH],
                radius: PIVOT_RADIUS,
                resolution: 32
            }),
            CSG.cube({
                corner1: [xCenter - PIN_RADIUS, WAGON_HALF_WIDTH, 0],
                corner2: [xCenter + PIN_RADIUS,-WAGON_HALF_WIDTH, 2 * WALL_WIDTH]
            })
        ),
        CSG.cylinder({
            start: [xCenter, 0, 0],
            end:   [xCenter, 0, 2 * WALL_WIDTH],
            radius: 1.6 * WALL_WIDTH,
            resolution: 32
        })
    ).translate([0, 0, PIVOT_HEIGHT + 0.02]);
}

function truck_pin(xCenter) {
    return difference(
        union(
            CSG.cylinder({
                start: [xCenter, 0, PIVOT_HEIGHT],
                end:   [xCenter, 0, PIVOT_HEIGHT + PIN_HEIGHT],
                radius: PIN_RADIUS,
                resolution: 32
            }),
            CSG.sphere({
              center: [xCenter, PIN_BALL_Y_SHIFT, PIN_BALL_Z_CENTER],
              radius: PIN_BALL_RADIUS,
              resolution: 64
            }),
            CSG.sphere({
              center: [xCenter,-PIN_BALL_Y_SHIFT, PIN_BALL_Z_CENTER],
              radius: PIN_BALL_RADIUS,
              resolution: 64
            })
        ),
        CSG.cube({
            corner1: [xCenter - PIN_RADIUS, PIN_BALL_Y_SHIFT, PIVOT_HEIGHT],
            corner2: [xCenter + PIN_RADIUS,-PIN_BALL_Y_SHIFT, PIN_BALL_Z_CENTER + PIN_BALL_RADIUS]
        })
    );
}

function frame_bars() {
    return union(
         xBar(FRAME_LEFT, FRAME_RIGHT, FRAME_TOP    - WALL_HALF_WIDTH, 1, BAR_MAIN_HEIGHT),
         xBar(FRAME_LEFT, FRAME_RIGHT, FRAME_BOTTOM + WALL_HALF_WIDTH, 1, BAR_MAIN_HEIGHT),
         xBar(FRAME_LEFT,  PIVOT_LEFT,  0, 2, BAR_MAIN_HEIGHT),
         xBar(PIVOT_RIGHT, FRAME_RIGHT, 0, 2, BAR_MAIN_HEIGHT),

         xBar(X_SUPPORT_BAR_3,  X_SUPPORT_BAR_4, -FRAME_HALF_WIDTH * 2 / 7, 1),
         xBar(X_SUPPORT_BAR_3,  X_SUPPORT_BAR_5, -FRAME_HALF_WIDTH * 4 / 7, 1),
         xBar(X_SUPPORT_BAR_5,  X_SUPPORT_BAR_6,  FRAME_HALF_WIDTH * 5 / 7, 1),
         xBar(X_SUPPORT_BAR_5,  X_SUPPORT_BAR_6,  FRAME_HALF_WIDTH * 4 / 7, 1),
         xBar(X_SUPPORT_BAR_6,  X_SUPPORT_BAR_7, -FRAME_HALF_WIDTH * 4 / 7, 1),
         xBar(X_SUPPORT_BAR_6,  X_SUPPORT_BAR_7, -FRAME_HALF_WIDTH * 5 / 7, 1),
         xBar(X_SUPPORT_BAR_7,  X_SUPPORT_BAR_8,  FRAME_HALF_WIDTH * 5 / 7, 2),
         xBar(X_SUPPORT_BAR_7,  X_SUPPORT_BAR_8,  FRAME_HALF_WIDTH * 3 / 7, 2),
         xBar(X_SUPPORT_BAR_8,  X_SUPPORT_BAR_9, -FRAME_HALF_WIDTH * 4 / 7, 1),
         xBar(X_SUPPORT_BAR_8,  X_SUPPORT_BAR_9, -FRAME_HALF_WIDTH * 5 / 7, 1),
         xBar(X_SUPPORT_BAR_9,  X_SUPPORT_BAR_10,-FRAME_HALF_WIDTH * 1 / 7, 1),
         xBar(X_SUPPORT_BAR_11, X_SUPPORT_BAR_12, FRAME_HALF_WIDTH * 1 / 7, 1),
         xBar(X_SUPPORT_BAR_11, X_SUPPORT_BAR_12,-FRAME_HALF_WIDTH * 1 / 7, 1),


         yBar(PIVOT_LEFT, 3, BAR_MAIN_HEIGHT),
         yBar(PIVOT_RIGHT, 3, BAR_MAIN_HEIGHT),
         yBar((PIVOT_LEFT  + FRAME_LEFT ) / 2, 1),
         yBar((PIVOT_RIGHT + FRAME_RIGHT) / 2, 1),

         yBar(X_SUPPORT_BAR_1,  1),
         yBar(X_SUPPORT_BAR_2,  1),
         yBar(X_SUPPORT_BAR_3,  1),
         yBar(X_SUPPORT_BAR_4,  1),
         yBar(X_SUPPORT_BAR_5,  1),
         yBar(X_SUPPORT_BAR_6,  1),
         yBar(X_SUPPORT_BAR_7,  1),
         yBar(X_SUPPORT_BAR_8,  1),
         yBar(X_SUPPORT_BAR_9,  1),
         yBar(X_SUPPORT_BAR_10, 1),
         yBar(X_SUPPORT_BAR_11, 1),
         yBar(X_SUPPORT_BAR_12, 1),
         yBar(X_SUPPORT_BAR_13, 1),

         diagonalBars(PIVOT_LEFT, X_SUPPORT_BAR_1, 1),
         diagonalBars(PIVOT_RIGHT, X_SUPPORT_BAR_13, 1),

         bumperBar(FRAME_LEFT, FRAME_LEFT + 2 * WALL_WIDTH, FRAME_LEFT + 3 * WALL_WIDTH),
         bumperBar(FRAME_RIGHT, FRAME_RIGHT - 2 * WALL_WIDTH, FRAME_RIGHT - 3 * WALL_WIDTH)

    );
}

function frame_plane() {
/*
    A------------+------------B
    |                         |
    +            O            +
    |                         |
    D------------+------------C
*/
    var xAO = FRAME_HALF_LENGTH;
    var yAO = FRAME_HALF_WIDTH;

    var A = [-xAO, yAO];
    var B = [ xAO, yAO];
    var C = [ xAO,-yAO];
    var D = [-xAO,-yAO];

    return linear_extrude({height: WALL_WIDTH},polygon([A, B, C, D], true));
}

function frame_pivot(xCenter) {
/*
    A------------+------------B
    |                         |
    +    P       O       R    +
    |                         |
    D------------+------------C
*/
    return CSG.cylinder({
        start: [xCenter, 0, 0],
        end:   [xCenter, 0, PIVOT_HEIGHT],
        radius: PIVOT_RADIUS,
        resolution: 32
    });
}

function xBar(xLeft, xRight, yCenter, widthFactor, height) {
/*
    A------------+------------B
    |            O            |
    D------------+------------C
*/
    var halfWidth = WALL_HALF_WIDTH * widthFactor;
    var A = [xLeft,  yCenter + halfWidth];
    var B = [xRight, yCenter + halfWidth];
    var C = [xRight, yCenter - halfWidth];
    var D = [xLeft,  yCenter - halfWidth];

    return linear_extrude({height: (height || BAR_HEIGHT)},polygon([A, B, C, D], true)).translate([0, 0, WALL_WIDTH]);
}

function yBar(xCenter, widthFactor, height) {
/*
    A-+-B
    |   |
    | O |
    |   |
    D-+-C
*/
    var halfWidth = WALL_HALF_WIDTH * widthFactor;
    var A = [xCenter - halfWidth, FRAME_HALF_WIDTH];
    var B = [xCenter + halfWidth, FRAME_HALF_WIDTH];
    var C = [xCenter + halfWidth,-FRAME_HALF_WIDTH];
    var D = [xCenter - halfWidth,-FRAME_HALF_WIDTH];

    return linear_extrude({height: (height || BAR_HEIGHT)},polygon([A, B, C, D], true)).translate([0, 0, WALL_WIDTH]);
}

function diagonalBars(xCenter, xSide, widthFactor) {
    /*
      A
     /
    O
     \
      B
    */
    var A = [xSide, FRAME_HALF_WIDTH - WALL_HALF_WIDTH];
    var B = [xSide,-FRAME_HALF_WIDTH + WALL_HALF_WIDTH];
    var O = [xCenter, 0];
    return linear_extrude({height: BAR_HEIGHT},new CSG.Path2D([A, O, B], false).expandToCAG(WALL_HALF_WIDTH)).translate([0, 0, WALL_WIDTH]);
}

function bumperBar(xFrame, xSide, xCenter) {
    /*
     A-B
     |  \
     |   O
     |  /
     D-C
    */
    var A = [xFrame,  FRAME_HALF_WIDTH];
    var B = [xSide,   FRAME_HALF_WIDTH];
    var O = [xCenter, 0];
    var C = [xSide,  -FRAME_HALF_WIDTH];
    var D = [xFrame, -FRAME_HALF_WIDTH];
    return linear_extrude({height: BAR_MAIN_HEIGHT},new CSG.Path2D([A, B, O, C, D], true).innerToCAG()).translate([0, 0, WALL_WIDTH]);
}
