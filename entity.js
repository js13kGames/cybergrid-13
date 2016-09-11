function Entity() {

    // executed when spawned
    this.initPos = function(x, y, z) {
        this.alive = true
        this.strip = false
        this.x = x
        this.y = y
        this.z = z
        this.pitch = 0
        this.yaw = 0
        this.roll = 0 
        this.scale = [1, 1, 1]

        this.dx = 0
        this.dy = 0
        this.dz = 0
    }

    this.initBufs = function(vtx, tex, n) {
        this.vposBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vposBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vtx), gl.STATIC_DRAW);
        this.vposBuffer.itemSize = 3;
        this.vposBuffer.numItems = n;

        this.texCoordBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tex), gl.STATIC_DRAW);
        this.texCoordBuf.itemSize = 2;
        this.texCoordBuf.numItems = n;
    }

    // executed when spawned after initPos
    this.init = function() {
        // generate geometry
        var vtxPos = []
        var texCoord = []

        var vtxPos = [
            -1, -1, -1, -1,  1, -1, -1, -1,  1,
            -1,  1, -1, -1, -1,  1, -1,  1,  1,
            
            -1, -1,  1, -1,  1,  1, 1, -1,  1,
            -1,  1,  1,  1, -1,  1, 1,  1,  1,
            
             1, -1,  1, 1,  1,  1, 1, -1, -1,
             1,  1,  1, 1, -1, -1, 1,  1, -1,

             1, -1, -1,  1,  1, -1, -1, -1, -1,
             1,  1, -1, -1, -1, -1, -1,  1, -1,
        ]
        
        var texPos = [
            0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1,
            0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1,
            0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1,
            0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1,
        ]
        this.initBufs(vtxPos, texPos, 24)

        // asign textures
        this.type = 0
        this.textures = textureSets[0]
        this.frame = 0
        this.frameTime = 0
        this.frameSpeed = 0.1 + Math.random()
    }

    this.nextFrame = function(delta) {
        this.frameTime += delta * this.frameSpeed
        if (this.frameTime > 1) {
            this.frameTime = 0
            this.frame++
            if (this.frame >= this.textures.length) {
                this.frame = 0
            }
        }
    }

    this.update = function(delta) {
        // update
        this.x += this.dx*delta
        this.y += this.dy*delta
        this.z += this.dz*delta
        //this.roll += 0.4*delta
        //this.yaw += 0.2*delta
        //this.pitch += 0.1*delta
        this.nextFrame(delta)
    }
    
    this.render = function() {
        // render

        // rotate and translate
        setMatrixUniforms()
        mvPushMatrix()
        mat4.translate(mvMatrix, [-this.x, -this.y, -this.z]);
        mat4.scale(mvMatrix, this.scale);
        mat4.rotate(mvMatrix, -this.roll, [0, 0, 1]);
        mat4.rotate(mvMatrix, -this.pitch, [1, 0, 0]);
        mat4.rotate(mvMatrix, -this.yaw, [0, 1, 0]);

        setMoveUniforms();

        // bind texture 
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.textures[this.frame]);
        gl.uniform1i(shaderProgram.samplerUniform, 0);

        // setup vertex and texture buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuf);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.texCoordBuf.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vposBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vposBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // draw
        if (this.strip) {
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vposBuffer.numItems);
        } else {
            gl.drawArrays(gl.TRIANGLES, 0, this.vposBuffer.numItems);
        }
        if (this.postRender) this.postRender()

        // back to original transformation
        mvPopMatrix()
    }
}
