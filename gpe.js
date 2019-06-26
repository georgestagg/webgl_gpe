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
        gl.useProgram(prog);
        gl.uniform1i(sampLoc, 1);
        gl.uniform1i(samp_kLoc, 0);
        gl.uniform1i(kstepLoc, 2);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_RK4_K1);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.uniform1i(sampLoc, 1);
        gl.uniform1i(samp_kLoc, 2);
        gl.uniform1i(kstepLoc, 2);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_RK4_K2);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.uniform1i(sampLoc, 1);
        gl.uniform1i(samp_kLoc, 3);
        gl.uniform1i(kstepLoc, 3);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_RK4_K3);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.uniform1i(sampLoc, 1);
        gl.uniform1i(samp_kLoc, 4);
        gl.uniform1i(kstepLoc, 4);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_RK4_K4);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        
        gl.useProgram(prog_step);
        gl.uniform1i(samp_stepLoc, 1);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.uniform1i(gl.getUniformLocation(prog_step, "addVortex"), 0);
        gl.uniform1i(gl.getUniformLocation(prog_step, "reset"), 0);

        gl.useProgram(prog);
        gl.uniform1i(sampLoc, 0);
        gl.uniform1i(samp_kLoc, 0);
        gl.uniform1i(kstepLoc, 2);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_RK4_K1);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.uniform1i(sampLoc, 0);
        gl.uniform1i(samp_kLoc, 2);
        gl.uniform1i(kstepLoc, 2);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_RK4_K2);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.uniform1i(sampLoc, 0);
        gl.uniform1i(samp_kLoc, 3);
        gl.uniform1i(kstepLoc, 3);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_RK4_K3);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.uniform1i(sampLoc, 0);
        gl.uniform1i(samp_kLoc, 4);
        gl.uniform1i(kstepLoc, 4);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_RK4_K4);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        
        gl.useProgram(prog_step);
        gl.uniform1i(samp_stepLoc, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, FBO1);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    gl.useProgram(prog_show);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(draw);
}

var n = 256;
var c = document.getElementById("GPE");
var gl = c.getContext("experimental-webgl");
var ext = gl.getExtension("OES_texture_float");
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

var dx = 0.5;

var n1 = n-1, h = 1/n1, t = 0;
pix = new Float32Array(4*n*n);
var p = 0;
for(var i = 0; i < n; i++ )
for(var j = 0; j < n; j++ ){
    var x1 = (j - n/2)*dx - 5., y1 = (i - n/2)*dx, fi1 = Math.atan2(y1,x1);
    var x2 = (j - n/2)*dx + 5., y2 = (i - n/2)*dx, fi2 = Math.atan2(y2,x2);
    var r1 =  1 - Math.exp(-2.*(x1*x1 + y1*y1));
    var r2 =  1 - Math.exp(-2.*(x2*x2 + y2*y2));
    pix[p++] = x = r1*r2*Math.cos(fi1+fi2);
    pix[p++] = y = r1*r2*Math.sin(fi1+fi2);
    pix[p++] = Math.sqrt(x*x + y*y);
    pix[p++] = 0;
}

var texture = gl.createTexture();
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, n, n, 0, gl.RGBA, gl.FLOAT, pix);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);

var texture1 = gl.createTexture();
gl.activeTexture(gl.TEXTURE1);
gl.bindTexture(gl.TEXTURE_2D, texture1);
gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, n, n, 0, gl.RGBA, gl.FLOAT, pix);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);

var texture_rk4_k1 = gl.createTexture();
gl.activeTexture(gl.TEXTURE2);
gl.bindTexture(gl.TEXTURE_2D, texture_rk4_k1);
gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, n, n, 0, gl.RGBA, gl.FLOAT, pix);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
var texture_rk4_k2 = gl.createTexture();
gl.activeTexture(gl.TEXTURE3);
gl.bindTexture(gl.TEXTURE_2D, texture_rk4_k2);
gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, n, n, 0, gl.RGBA, gl.FLOAT, pix);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
var texture_rk4_k3 = gl.createTexture();
gl.activeTexture(gl.TEXTURE4);
gl.bindTexture(gl.TEXTURE_2D, texture_rk4_k3);
gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, n, n, 0, gl.RGBA, gl.FLOAT, pix);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
var texture_rk4_k4 = gl.createTexture();
gl.activeTexture(gl.TEXTURE5);
gl.bindTexture(gl.TEXTURE_2D, texture_rk4_k4);
gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, n, n, 0, gl.RGBA, gl.FLOAT, pix);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);

var FBO = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, FBO);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

var FBO1 = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, FBO1);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture1, 0);

var FBO_RK4_K1 = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_RK4_K1);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture_rk4_k1, 0);
var FBO_RK4_K2 = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_RK4_K2);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture_rk4_k2, 0);
var FBO_RK4_K3 = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_RK4_K3);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture_rk4_k3, 0);
var FBO_RK4_K4 = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_RK4_K4);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture_rk4_k4, 0);

if( gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE)
    alert("FRAMEBUFFER not complete");

//RK4 calculations
gl.useProgram(prog);
var sampLoc  = gl.getUniformLocation(prog, "samp");
var samp_kLoc  = gl.getUniformLocation(prog, "samp_k");
var kstepLoc  = gl.getUniformLocation(prog, "kstep");
gl.uniform1f(gl.getUniformLocation(prog, "dt"), 0.01);
gl.uniform1f(gl.getUniformLocation(prog, "dx2"), dx*dx);
gl.uniform1f(gl.getUniformLocation(prog, "gamma"), 0.03);
gl.uniform1i(gl.getUniformLocation(prog, "addPot"), 0);
gl.uniform1f(gl.getUniformLocation(prog, "addPot_x"), 0);
gl.uniform1f(gl.getUniformLocation(prog, "addPot_y"), 0);
gl.uniform1f(gl.getUniformLocation(prog, "addPot_r"), 3);

//Time step
gl.useProgram(prog_step);
var samp_stepLoc  = gl.getUniformLocation(prog_step, "samp");
gl.uniform1i(gl.getUniformLocation(prog_step, "samp_k1"), 2);
gl.uniform1i(gl.getUniformLocation(prog_step, "samp_k2"), 3);
gl.uniform1i(gl.getUniformLocation(prog_step, "samp_k3"), 4);
gl.uniform1i(gl.getUniformLocation(prog_step, "samp_k4"), 5);
gl.uniform1i(gl.getUniformLocation(prog_step, "addVortex"), 0);
gl.uniform1f(gl.getUniformLocation(prog_step, "addVortex_x"), 0);
gl.uniform1f(gl.getUniformLocation(prog_step, "addVortex_y"), 0);
gl.uniform1i(gl.getUniformLocation(prog_step, "reset"), 0);


var scale = ((window.innerHeight<window.innerWidth)?window.innerHeight:window.innerWidth)/1.5;
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

$("#GPE").css("height",scale);


var gui = new dat.GUI();
var gamma = 0.01;
var dt = 0.05;
var pot_r = 3;
var boundary = 'reflective';
var gammaController = gui.add(window, 'gamma',0,0.5).step(0.001);
var dtController = gui.add(window, 'dt',0,0.06).step(0.001);
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
    }
});
  
draw();