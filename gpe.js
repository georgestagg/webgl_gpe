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

function draw(){
    for(var i=0; i<10;i++){
        //First pass
        gl.useProgram(prog);
        gl.uniform1i(psi_re, 2);
        gl.uniform1i(psi_im, 3);
        gl.uniform1i(kstep, 1);
        gl.uniform1i(reim, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_K1_RE);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.uniform1i(reim, 1);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_K1_IM);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.uniform1i(k_re, 4);
        gl.uniform1i(k_im, 5);
        gl.uniform1i(kstep, 2);
        gl.uniform1i(reim, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_K2_RE);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.uniform1i(reim, 1);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_K2_IM);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.uniform1i(k_re, 6);
        gl.uniform1i(k_im, 7);
        gl.uniform1i(kstep, 3);
        gl.uniform1i(reim, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_K3_RE);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.uniform1i(reim, 1);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_K3_IM);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.uniform1i(k_re, 8);
        gl.uniform1i(k_im, 9);
        gl.uniform1i(kstep, 4);
        gl.uniform1i(reim, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_K4_RE);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.uniform1i(reim, 1);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_K4_IM);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        
        gl.useProgram(prog_step);
        gl.uniform1i(step_psi_re, 2);
        gl.uniform1i(step_psi_im, 3);
        gl.uniform1i(step_reim, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_PSI1_RE);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.uniform1i(step_reim, 1);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_PSI1_IM);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.uniform1i(gl.getUniformLocation(prog_step, "addVortex"), 0);
        gl.uniform1i(gl.getUniformLocation(prog_step, "reset"), 0);

        //Second pass
        gl.useProgram(prog);
        gl.uniform1i(psi_re, 0);
        gl.uniform1i(psi_im, 1);
        gl.uniform1i(kstep, 1);
        gl.uniform1i(reim, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_K1_RE);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.uniform1i(reim, 1);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_K1_IM);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.uniform1i(k_re, 4);
        gl.uniform1i(k_im, 5);
        gl.uniform1i(kstep, 2);
        gl.uniform1i(reim, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_K2_RE);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.uniform1i(reim, 1);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_K2_IM);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.uniform1i(k_re, 6);
        gl.uniform1i(k_im, 7);
        gl.uniform1i(kstep, 3);
        gl.uniform1i(reim, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_K3_RE);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.uniform1i(reim, 1);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_K3_IM);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.uniform1i(k_re, 8);
        gl.uniform1i(k_im, 9);
        gl.uniform1i(kstep, 4);
        gl.uniform1i(reim, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_K4_RE);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.uniform1i(reim, 1);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_K4_IM);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        
        gl.useProgram(prog_step);
        gl.uniform1i(step_psi_re, 0);
        gl.uniform1i(step_psi_im, 1);
        gl.uniform1i(step_reim, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_PSI2_RE);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.uniform1i(step_reim, 1);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_PSI2_IM);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    gl.useProgram(prog_show);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(draw);
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

var n = 256;
var dx = 0.5;
var gamma = 0.01;
var dt = 0.1;
var pot_r = 3;
var n1 = n-1, h = 1/n1, t = 0;
pix = new Uint8Array(4*n*n);
var p = 0;
for(var i = 0; i < n; i++ )
for(var j = 0; j < n; j++ ){
    var x1 = (j - n/2)*dx - 5., y1 = (i - n/2)*dx, fi1 = Math.atan2(y1,x1);
    var x2 = (j - n/2)*dx + 5., y2 = (i - n/2)*dx, fi2 = Math.atan2(y2,x2);
    var r1 =  1 - Math.exp(-2.*(x1*x1 + y1*y1));
    var r2 =  1 - Math.exp(-2.*(x2*x2 + y2*y2));
    pix[p++] = 0;//x = r1*r2*Math.cos(fi1+fi2);
    pix[p++] = 0;//y = r1*r2*Math.sin(fi1+fi2);
    pix[p++] = 0;//Math.sqrt(x*x + y*y);
    pix[p++] = 0;
}

function makeTexture(gl_tex){
    var t = gl.createTexture();
    gl.activeTexture(gl_tex);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, n, n, 0, gl.RGBA, gl.UNSIGNED_BYTE, pix);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    return t;
}

function makeFBO(texture){
    var fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    return fbo;
}

var texture_psi1_re = makeTexture(gl.TEXTURE0);
var texture_psi1_im = makeTexture(gl.TEXTURE1);
var texture_psi2_re = makeTexture(gl.TEXTURE2);
var texture_psi2_im = makeTexture(gl.TEXTURE3);
var texture_k1_re = makeTexture(gl.TEXTURE4);
var texture_k1_im = makeTexture(gl.TEXTURE5);
var texture_k2_re = makeTexture(gl.TEXTURE6);
var texture_k2_im = makeTexture(gl.TEXTURE7);
var texture_k3_re = makeTexture(gl.TEXTURE8);
var texture_k3_im = makeTexture(gl.TEXTURE9);
var texture_k4_re = makeTexture(gl.TEXTURE10);
var texture_k4_im = makeTexture(gl.TEXTURE11);

var FBO_PSI1_RE = makeFBO(texture_psi1_re);
var FBO_PSI1_IM = makeFBO(texture_psi1_im);
var FBO_PSI2_RE = makeFBO(texture_psi2_re);
var FBO_PSI2_IM = makeFBO(texture_psi2_im);
var FBO_K1_RE = makeFBO(texture_k1_re);
var FBO_K1_IM = makeFBO(texture_k1_im);
var FBO_K2_RE = makeFBO(texture_k2_re);
var FBO_K2_IM = makeFBO(texture_k2_im);
var FBO_K3_RE = makeFBO(texture_k3_re);
var FBO_K3_IM = makeFBO(texture_k3_im);
var FBO_K4_RE = makeFBO(texture_k4_re);
var FBO_K4_IM = makeFBO(texture_k4_im);

if( gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE)
    alert("FRAMEBUFFER not complete");

//RK4 calculations
gl.useProgram(prog);
var psi_re = gl.getUniformLocation(prog, "psi_re");
var psi_im = gl.getUniformLocation(prog, "psi_im");
var k_re  = gl.getUniformLocation(prog, "k_re");
var k_im  = gl.getUniformLocation(prog, "k_im");
var kstep  = gl.getUniformLocation(prog, "kstep");
var reim  = gl.getUniformLocation(prog, "reim");
gl.uniform1f(gl.getUniformLocation(prog, "dt"), dt);
gl.uniform1f(gl.getUniformLocation(prog, "dx2"), dx);
gl.uniform1f(gl.getUniformLocation(prog, "gamma"), gamma);
gl.uniform1i(gl.getUniformLocation(prog, "addPot"), 0);
gl.uniform1f(gl.getUniformLocation(prog, "addPot_x"), 0);
gl.uniform1f(gl.getUniformLocation(prog, "addPot_y"), 0);
gl.uniform1f(gl.getUniformLocation(prog, "addPot_r"), 3);

//Time step
gl.useProgram(prog_step);
var step_psi_re  = gl.getUniformLocation(prog_step, "psi_re");
var step_psi_im  = gl.getUniformLocation(prog_step, "psi_im");
var step_reim  = gl.getUniformLocation(prog_step, "reim");
gl.uniform1i(gl.getUniformLocation(prog_step, "k1_re"), 4);
gl.uniform1i(gl.getUniformLocation(prog_step, "k1_im"), 5);
gl.uniform1i(gl.getUniformLocation(prog_step, "k2_re"), 6);
gl.uniform1i(gl.getUniformLocation(prog_step, "k2_im"), 7);
gl.uniform1i(gl.getUniformLocation(prog_step, "k3_re"), 8);
gl.uniform1i(gl.getUniformLocation(prog_step, "k3_im"), 9);
gl.uniform1i(gl.getUniformLocation(prog_step, "k4_re"), 10);
gl.uniform1i(gl.getUniformLocation(prog_step, "k4_im"), 11);
gl.uniform1i(gl.getUniformLocation(prog_step, "addVortex"), 0);
gl.uniform1f(gl.getUniformLocation(prog_step, "addVortex_x"), 0);
gl.uniform1f(gl.getUniformLocation(prog_step, "addVortex_y"), 0);
gl.uniform1i(gl.getUniformLocation(prog_step, "reset"), 0);


gl.useProgram(prog_show);
gl.uniform1i(gl.getUniformLocation(prog_show, "psi_re"), 2);
gl.uniform1i(gl.getUniformLocation(prog_show, "psi_im"), 3);


var scale = ((window.innerHeight<window.innerWidth)?window.innerHeight:window.innerWidth)/1.5;
$("#GPE").css("height",scale);

var isDragging = false;
var isDown = false;
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
        gl.useProgram(prog_step);
        gl.uniform1i(gl.getUniformLocation(prog_step, "addVortex"), 1);
        var x = (e.offsetX != null) ? e.offsetX : e.originalEvent.layerX;
        var y = (e.offsetY != null) ? e.offsetY : e.originalEvent.layerY;
        gl.uniform1f(gl.getUniformLocation(prog_step, "addVortex_x"), x/scale);
        gl.uniform1f(gl.getUniformLocation(prog_step, "addVortex_y"), (scale-y)/scale);
    }
});
$("#GPE").contextmenu(function(e) {
    isDragging = true;
    gl.useProgram(prog_step);
    gl.uniform1i(gl.getUniformLocation(prog_step, "addVortex"), -1);
    var x = (e.offsetX != null) ? e.offsetX : e.originalEvent.layerX;
    var y = (e.offsetY != null) ? e.offsetY : e.originalEvent.layerY;
    gl.uniform1f(gl.getUniformLocation(prog_step, "addVortex_x"), x/scale);
    gl.uniform1f(gl.getUniformLocation(prog_step, "addVortex_y"), (scale-y)/scale);
    return false;
});

var gui = new dat.GUI();
var boundary = 'reflective';
var gammaController = gui.add(window, 'gamma',0,0.5).step(0.01);
var dtController = gui.add(window, 'dt',0,0.2).step(0.01);
var pot_rController = gui.add(window, 'pot_r',0,30).step(1);
var boundaryController = gui.add(window, 'boundary', ['periodic', 'reflective']);

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
        gl.activeTexture(gl.TEXTURE0);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.activeTexture(gl.TEXTURE1);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.activeTexture(gl.TEXTURE2);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.activeTexture(gl.TEXTURE3);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.activeTexture(gl.TEXTURE4);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.activeTexture(gl.TEXTURE5);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.activeTexture(gl.TEXTURE6);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.activeTexture(gl.TEXTURE7);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.activeTexture(gl.TEXTURE8);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.activeTexture(gl.TEXTURE9);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.activeTexture(gl.TEXTURE10);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.activeTexture(gl.TEXTURE11);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    } else { 
        gl.activeTexture(gl.TEXTURE0);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
        gl.activeTexture(gl.TEXTURE1);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
        gl.activeTexture(gl.TEXTURE2);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
        gl.activeTexture(gl.TEXTURE3);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
        gl.activeTexture(gl.TEXTURE4);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
        gl.activeTexture(gl.TEXTURE5);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
        gl.activeTexture(gl.TEXTURE6);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
        gl.activeTexture(gl.TEXTURE7);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
        gl.activeTexture(gl.TEXTURE8);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
        gl.activeTexture(gl.TEXTURE9);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
        gl.activeTexture(gl.TEXTURE10);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
        gl.activeTexture(gl.TEXTURE11);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    }
});
  
draw();