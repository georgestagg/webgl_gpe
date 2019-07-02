//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getShader ( gl, id ){
    var shaderScript = document.getElementById ( id );
    var str = "";
    var k = shaderScript.firstChild;
    while ( k ){
        if ( k.nodeType == 3 ) str += k.textContent;
        k = k.nextSibling;
    }
    var shader;
    if ( shaderScript.type == "x-shader/x-fragment" )
            shader = gl.createShader ( gl.FRAGMENT_SHADER );
    else if ( shaderScript.type == "x-shader/x-vertex" )
            shader = gl.createShader(gl.VERTEX_SHADER);
    else return null;
    gl.shaderSource(shader, str);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) == 0)
        alert(gl.getShaderInfoLog(shader));
    return shader;
}
var c = document.getElementById("GPE");
var gl = c.getContext("webgl");
var prog  = gl.createProgram();
gl.attachShader(prog, getShader( gl, "shader-vs" ));
gl.attachShader(prog, getShader( gl, "shader-fs-dpsi" ));
gl.linkProgram(prog);

var prog_step  = gl.createProgram();
gl.attachShader(prog_step, getShader( gl, "shader-vs" ));
gl.attachShader(prog_step, getShader( gl, "shader-fs-step" ));
gl.linkProgram(prog_step);

var prog_show  = gl.createProgram();
gl.attachShader(prog_show, getShader( gl, "shader-vs" ));
gl.attachShader(prog_show, getShader( gl, "shader-fs-show" ));
gl.linkProgram(prog_show);

gl.useProgram(prog);
var aPosLoc = gl.getAttribLocation(prog, "aPos");
var aTexLoc = gl.getAttribLocation(prog, "aTexCoord");
gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 0,0,  1,-1, 1,0,  -1,1, 0,1, 1,1, 1,1]), gl.STATIC_DRAW);
gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, gl.FALSE, 16, 0);
gl.vertexAttribPointer(aTexLoc, 2, gl.FLOAT, gl.FALSE, 16, 8);
gl.enableVertexAttribArray( aPosLoc );
gl.enableVertexAttribArray( aTexLoc );

gl.useProgram(prog_step);
var aPosLoc_step = gl.getAttribLocation(prog_step, "aPos");
var aTexLoc_step = gl.getAttribLocation(prog_step, "aTexCoord");
gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 0,0,  1,-1, 1,0,  -1,1, 0,1, 1,1, 1,1]), gl.STATIC_DRAW);
gl.vertexAttribPointer(aPosLoc_step, 2, gl.FLOAT, gl.FALSE, 16, 0);
gl.vertexAttribPointer(aTexLoc_step, 2, gl.FLOAT, gl.FALSE, 16, 8);
gl.enableVertexAttribArray( aPosLoc_step );
gl.enableVertexAttribArray( aTexLoc_step );
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function draw(){
    for(var i=0; i<10;i++){
        //First pass
        gl.useProgram(prog);
        gl.uniform1i(prog_psi, 1);
        gl.uniform1i(kstep, 1);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_K1);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.uniform1i(prog_k, 2);
        gl.uniform1i(kstep, 2);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_K2);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.uniform1i(prog_k, 3);
        gl.uniform1i(kstep, 3);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_K3);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.uniform1i(prog_k, 4);
        gl.uniform1i(kstep, 4);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_K4);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        
        gl.useProgram(prog_step);
        gl.uniform1i(step_psi, 1);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_PSI1);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.uniform1i(gl.getUniformLocation(prog_step, "addVortex"), 0);
        gl.uniform1i(gl.getUniformLocation(prog_step, "reset"), 0);

        //Second pass
        gl.useProgram(prog);
        gl.uniform1i(prog_psi, 0);
        gl.uniform1i(kstep, 1);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_K1);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.uniform1i(prog_k, 2);
        gl.uniform1i(kstep, 2);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_K2);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.uniform1i(prog_k, 3);
        gl.uniform1i(kstep, 3);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_K3);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.uniform1i(prog_k, 4);
        gl.uniform1i(kstep, 4);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_K4);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        
        gl.useProgram(prog_step);
        gl.uniform1i(step_psi, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_PSI2);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    gl.useProgram(prog_show);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(draw);
}

var n = 256;
var dx = 0.5;
var gamma = 0.01;
var dt = 0.1;
var pot_r = 3;
var trap = false;
var pix = new Uint8Array(4*n*n);

function setReflective(gl_tex){
    gl.activeTexture(gl_tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
}
function setPeriodic(gl_tex){
    gl.activeTexture(gl_tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
}

function makeTexture(gl_tex){
    var t = gl.createTexture();
    gl.activeTexture(gl_tex);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, n, n, 0, gl.RGBA, gl.UNSIGNED_BYTE, pix);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    setReflective(gl_tex);
    return t;
}

function makeFBO(texture){
    var fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    return fbo;
}

var texture_psi1 = makeTexture(gl.TEXTURE0);
var texture_psi2 = makeTexture(gl.TEXTURE1);
var texture_k1 = makeTexture(gl.TEXTURE2);
var texture_k2 = makeTexture(gl.TEXTURE3);
var texture_k3 = makeTexture(gl.TEXTURE4);
var texture_k4 = makeTexture(gl.TEXTURE5);

var FBO_PSI1 = makeFBO(texture_psi1);
var FBO_PSI2 = makeFBO(texture_psi2);
var FBO_K1 = makeFBO(texture_k1);
var FBO_K2 = makeFBO(texture_k2);
var FBO_K3 = makeFBO(texture_k3);
var FBO_K4 = makeFBO(texture_k4);

if( gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE)
    alert("FRAMEBUFFER not complete");

//RK4 calculations
gl.useProgram(prog);
var prog_psi = gl.getUniformLocation(prog, "s_psi");
var prog_k  = gl.getUniformLocation(prog, "s_k");
var kstep  = gl.getUniformLocation(prog, "kstep");
gl.uniform1f(gl.getUniformLocation(prog, "dt"), dt);
gl.uniform1f(gl.getUniformLocation(prog, "dx2"), dx*dx);
gl.uniform1f(gl.getUniformLocation(prog, "gamma"), gamma);
gl.uniform1i(gl.getUniformLocation(prog, "addPot"), 0);
gl.uniform1f(gl.getUniformLocation(prog, "addPot_x"), 0);
gl.uniform1f(gl.getUniformLocation(prog, "addPot_y"), 0);
gl.uniform1f(gl.getUniformLocation(prog, "addPot_r"), 3);

//Time step
gl.useProgram(prog_step);
var step_psi  = gl.getUniformLocation(prog_step, "s_psi");
gl.uniform1i(gl.getUniformLocation(prog_step, "s_k1"), 2);
gl.uniform1i(gl.getUniformLocation(prog_step, "s_k2"), 3);
gl.uniform1i(gl.getUniformLocation(prog_step, "s_k3"), 4);
gl.uniform1i(gl.getUniformLocation(prog_step, "s_k4"), 5);
gl.uniform1i(gl.getUniformLocation(prog_step, "addVortex"), 0);
gl.uniform1f(gl.getUniformLocation(prog_step, "addVortex_x"), 0);
gl.uniform1f(gl.getUniformLocation(prog_step, "addVortex_y"), 0);
gl.uniform1i(gl.getUniformLocation(prog_step, "reset"), 1);

gl.useProgram(prog_show);
gl.uniform1i(gl.getUniformLocation(prog_show, "psi"), 1);

var scale = ((window.innerHeight<window.innerWidth)?window.innerHeight/1.3:window.innerWidth)/1.2;
$("#GPE").css("height",scale);

var isDragging = false;
var isDown = false;

c.addEventListener("touchend", function (e) {
    gl.useProgram(prog);
    gl.uniform1i(gl.getUniformLocation(prog, "addPot"), 0);
}, false);

c.addEventListener("touchmove", function (e) {
    var touch = e.touches[0];
    var rect = c.getBoundingClientRect();
    var x =  touch.clientX - rect.left;
    var y =  touch.clientY - rect.top;
    gl.useProgram(prog);
    gl.uniform1i(gl.getUniformLocation(prog, "addPot"), 1);
    gl.uniform1f(gl.getUniformLocation(prog, "addPot_x"), x/scale);
    gl.uniform1f(gl.getUniformLocation(prog, "addPot_y"), (scale-y)/scale);
}, false);

$("#GPE")
.mousedown(function() {
    isDragging = false;
    isDown = true;
})
.mousemove(function(e) {
    isDragging = true;
    if(isDown){
        gl.useProgram(prog);
        gl.uniform1i(gl.getUniformLocation(prog, "addPot"), 1);
        var x = (e.offsetX != null) ? e.offsetX : e.originalEvent.layerX;
        var y = (e.offsetY != null) ? e.offsetY : e.originalEvent.layerY;
        gl.uniform1f(gl.getUniformLocation(prog, "addPot_x"), x/scale);
        gl.uniform1f(gl.getUniformLocation(prog, "addPot_y"), (scale-y)/scale);
    }
 })
.mouseup(function(e) {
    var wasDragging = isDragging;
    isDragging = false;
    isDown = false;
    gl.useProgram(prog);
    gl.uniform1i(gl.getUniformLocation(prog, "addPot"), 0);
    if (!wasDragging) {
        var x = (e.offsetX != null) ? e.offsetX : e.originalEvent.layerX;
        var y = (e.offsetY != null) ? e.offsetY : e.originalEvent.layerY;
        gl.useProgram(prog_step);
        gl.uniform1i(gl.getUniformLocation(prog_step, "addVortex"), 1);
        gl.uniform1f(gl.getUniformLocation(prog_step, "addVortex_x"), x/scale);
        gl.uniform1f(gl.getUniformLocation(prog_step, "addVortex_y"), (scale-y)/scale);
    }
});
$("#GPE").contextmenu(function(e) {
    isDragging = true;
    var x = (e.offsetX != null) ? e.offsetX : e.originalEvent.layerX;
    var y = (e.offsetY != null) ? e.offsetY : e.originalEvent.layerY;
    gl.useProgram(prog_step);
    gl.uniform1i(gl.getUniformLocation(prog_step, "addVortex"), -1);
    gl.uniform1f(gl.getUniformLocation(prog_step, "addVortex_x"), x/scale);
    gl.uniform1f(gl.getUniformLocation(prog_step, "addVortex_y"), (scale-y)/scale);
    return false;
});

var gui = new dat.GUI();
var boundary = 'reflective';
var gammaController = gui.add(window, 'gamma',0,0.3).step(0.001);
var dtController = gui.add(window, 'dt',0,0.14).step(0.01);
var pot_rController = gui.add(window, 'pot_r',0,30).step(1);
var boundaryController = gui.add(window, 'boundary', ['periodic', 'reflective']);

gui.add(window, 'trap').onChange(function (value) {
    gl.useProgram(prog);
    gl.uniform1i(gl.getUniformLocation(prog, "addTrap"), value);
}); 


var obj = { reset:function(){ 
    gl.useProgram(prog_step);
    gl.uniform1i(gl.getUniformLocation(prog_step, "reset"), 1);
}};

gui.add(obj,'reset');


gammaController.onChange(function(value) {
    gl.useProgram(prog);
    gl.uniform1f(gl.getUniformLocation(prog, "gamma"), value);
});

dtController.onChange(function(value) {
    gl.useProgram(prog);
    gl.uniform1f(gl.getUniformLocation(prog, "dt"), value);
});

pot_rController.onChange(function(value) {
    gl.useProgram(prog);
    gl.uniform1f(gl.getUniformLocation(prog, "addPot_r"), value);
});

boundaryController.onChange(function(value) {
    if(value == 'periodic'){
        setPeriodic(gl.TEXTURE0);
        setPeriodic(gl.TEXTURE1);
        setPeriodic(gl.TEXTURE2);
        setPeriodic(gl.TEXTURE3);
        setPeriodic(gl.TEXTURE4);
        setPeriodic(gl.TEXTURE5);
    } else { 
        setReflective(gl.TEXTURE0);
        setReflective(gl.TEXTURE1);
        setReflective(gl.TEXTURE2);
        setReflective(gl.TEXTURE3);
        setReflective(gl.TEXTURE4);
        setReflective(gl.TEXTURE5);
    }
});
  
draw();