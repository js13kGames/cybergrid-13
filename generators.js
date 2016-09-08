const FIELD_SIZE=32
function cb(sx, sy, by, h, type) {
    if (sx < 0) sx = 0; else if (sx > 128) sx = 128
    if (sy < 0) sy = 0; else if (sy > 128) sy = 128
    var shift = sy*128 + sx
    if (blocks[shift]) {
        return blocks[shift]
    }

    var x = sx - 64
    var y = sy - 64
    for (var i = 0; i < h; i++) {
        new WallSegment(x+1, y, x, y, by, 1, type)
        new WallSegment(x, y, x, y+1, by, 1, type)
        new WallSegment(x+1, y+1, x+1, y, by, 1, type)
        new WallSegment(x, y+1, x+1, y+1, by, 1, type)
        by++
    }
}

function cw(sx, sy, dx, dy, y, h, len) {
    var type = randomInt(wallTexture.length)
    for (var i = 0; i < len; i++) {
        cb(sx, sy, y, h, type)
        sx += dx
        sy += dy
    }
}

function generateWalls() {
    for (var i = 0; i < 64; i++) {
        var x = randomInt(FIELD_SIZE)+30
        var y = randomInt(FIELD_SIZE)+30
        var dx = 0, dy = 0
        //var len = Math.random() * 16
        var len = 1
        var rv = Math.random()
        if (rv < 0.25) dx = 1;
        else if (rv < 0.5) dx = -1;
        else if (rv < 0.75) dy = 1;
        else dy = -1

        var by = 0
        if (Math.random() < 0.2) by = -1;
        else if (Math.random() < 0.2) by = 1;
        var h = Math.floor(1 + Math.random()*2)
        cw(x, y, dx, dy, by, h, len)
    }

    for (var i = 0; i < FIELD_SIZE; i++) {
        var x = randomInt(FIELD_SIZE)+64
        var y = randomInt(FIELD_SIZE)+64
        var dx = 0, dy = 0
        var len = Math.random() * 16
        var rv = Math.random()
        if (rv < 0.25) dx = 1;
        else if (rv < 0.5) dx = -1;
        else if (rv < 0.75) dy = 1;
        else dy = -1
        var by = 0
        var h = 1
        cw(x, y, dx, dy, by, h, len)
    }
}

function generateWorld() {
    generateWalls()

    new Obj(1, 0, 0)
    new Obj(-1, 0, 0)
    new Obj(0, 0, 1)
    new Obj(0, 0, -1)
    objects[1].wall = 1
    objects[2].wall = 2
    objects[3].wall = 3

    objects[0].dx = 0.1
    objects[1].dx = -0.1
    objects[2].dz = 0.1
    objects[3].dz = -0.1
}
