/* exported GPE, UI */
/* global dat */

class GPE {
    getShader(id){
        var gl = this.gl;
        var shaderScript = document.getElementById(id);
        var str = shaderScript.firstChild.textContent;
        var shader;
        if (shaderScript.type == 'x-shader/x-fragment')
            shader = gl.createShader ( gl.FRAGMENT_SHADER );
        else if (shaderScript.type == 'x-shader/x-vertex')
            shader = gl.createShader(gl.VERTEX_SHADER);
        else return null;
        gl.shaderSource(shader, str);
        gl.compileShader(shader);
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) == 0)
            console.log(gl.getShaderInfoLog(shader));
        return shader;
    }
    
    makeTexture(gl_tex){
        var gl = this.gl;
        var t = gl.createTexture();
        gl.activeTexture(gl_tex);
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.N, this.N, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.pix);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        this.setReflective(gl_tex);
        return t;
    }

    makeFBO(texture){
        var gl = this.gl;
        var fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        return fbo;
    }

    setReflective(gl_tex){
        var gl = this.gl;
        gl.activeTexture(gl_tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    }

    setPeriodic(gl_tex){
        var gl = this.gl;
        gl.activeTexture(gl_tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    }

    initShaders(){
        var gl = this.gl;
        var prog_rk4 = this.prog_rk4 = gl.createProgram();
        var prog_step = this.prog_step = gl.createProgram();
        var prog_show = this.prog_show = gl.createProgram();

        // Compile, attach and link shaders
        gl.attachShader(prog_rk4, this.getShader('shader-vs'));
        gl.attachShader(prog_rk4, this.getShader('shader-fs-dpsi'));
        gl.linkProgram(prog_rk4);
        gl.attachShader(prog_step, this.getShader('shader-vs'));
        gl.attachShader(prog_step, this.getShader('shader-fs-step'));
        gl.linkProgram(prog_step);
        gl.attachShader(prog_show, this.getShader('shader-vs'));
        gl.attachShader(prog_show, this.getShader('shader-fs-show'));
        gl.linkProgram(prog_show);

        // Initialise the RK4 substep shader parameters
        gl.useProgram(prog_rk4);
        var aPosLoc = gl.getAttribLocation(prog_rk4, 'aPos');
        var aTexLoc = gl.getAttribLocation(prog_rk4, 'aTexCoord');
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 0,0,  1,-1, 1,0,  -1,1, 0,1, 1,1, 1,1]), gl.STATIC_DRAW);
        gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, gl.FALSE, 16, 0);
        gl.vertexAttribPointer(aTexLoc, 2, gl.FLOAT, gl.FALSE, 16, 8);
        gl.enableVertexAttribArray(aPosLoc);
        gl.enableVertexAttribArray(aTexLoc);
        // Store some uniform locations for use in the draw loop later
        this.prog_rk4_psi = gl.getUniformLocation(prog_rk4, 's_psi');
        this.prog_rk4_k  = gl.getUniformLocation(prog_rk4, 's_k');
        this.prog_rk4_kstep  = gl.getUniformLocation(prog_rk4, 'kstep');
        gl.uniform1f(gl.getUniformLocation(prog_rk4, 'dt'), this.opts['dt']);
        gl.uniform1f(gl.getUniformLocation(prog_rk4, 'dx2'), this.opts['dx2']);
        gl.uniform1f(gl.getUniformLocation(prog_rk4, 'gamma'), this.opts['gamma']);
        gl.uniform1i(gl.getUniformLocation(prog_rk4, 'addTrap'), false);
        gl.uniform1i(gl.getUniformLocation(prog_rk4, 'addPot'), this.opts['addPot']['acive']);
        gl.uniform1f(gl.getUniformLocation(prog_rk4, 'addPot_x'), this.opts['addPot']['x']);
        gl.uniform1f(gl.getUniformLocation(prog_rk4, 'addPot_y'), this.opts['addPot']['y']);
        gl.uniform1f(gl.getUniformLocation(prog_rk4, 'addPot_r'), this.opts['addPot']['r']);
        gl.uniform1f(gl.getUniformLocation(prog_rk4, 'ang_mom'), 5.);

        // Initialise the RK4 overall time stepp shader parameters
        gl.useProgram(prog_step);
        var aPosLoc_step = gl.getAttribLocation(prog_step, 'aPos');
        var aTexLoc_step = gl.getAttribLocation(prog_step, 'aTexCoord');
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 0,0,  1,-1, 1,0,  -1,1, 0,1, 1,1, 1,1]), gl.STATIC_DRAW);
        gl.vertexAttribPointer(aPosLoc_step, 2, gl.FLOAT, gl.FALSE, 16, 0);
        gl.vertexAttribPointer(aTexLoc_step, 2, gl.FLOAT, gl.FALSE, 16, 8);
        gl.enableVertexAttribArray(aPosLoc_step);
        gl.enableVertexAttribArray(aTexLoc_step);

        // Store some uniform locations for use in the draw loop later
        this.prog_step_psi  = gl.getUniformLocation(prog_step, 's_psi');
        this.prog_step_addVortex  = gl.getUniformLocation(prog_step, 'addVortex');
        this.prog_step_reset  = gl.getUniformLocation(prog_step, 'reset');
        this.prog_step_quench  = gl.getUniformLocation(prog_step, 'quench');
        this.prog_step_randVort  = gl.getUniformLocation(prog_step, 'randVort');
        gl.uniform1i(gl.getUniformLocation(prog_step, 's_k1'), 2);
        gl.uniform1i(gl.getUniformLocation(prog_step, 's_k2'), 3);
        gl.uniform1i(gl.getUniformLocation(prog_step, 's_k3'), 4);
        gl.uniform1i(gl.getUniformLocation(prog_step, 's_k4'), 5);
        gl.uniform1f(gl.getUniformLocation(prog_step, 'addVortex'), this.opts['addVortex']['active']);
        gl.uniform1f(gl.getUniformLocation(prog_step, 'addVortex_x'), this.opts['addVortex']['x']);
        gl.uniform1f(gl.getUniformLocation(prog_step, 'addVortex_y'), this.opts['addVortex']['y']);
        gl.uniform1i(this.prog_step_addVortex, 0);
        gl.uniform1i(this.prog_step_reset, 1);
        gl.uniform1i(this.prog_step_quench, 0);
        gl.uniform1i(this.prog_step_randVort, Math.floor(Math.random() * 256));
        
        // Initialise the display output shader parameters
        gl.useProgram(prog_show);
        gl.uniform1i(gl.getUniformLocation(prog_show, 'psi'), 1);
        gl.uniform1i(gl.getUniformLocation(prog_show, 'showPhase'), this.opts['showPhase']);
    }

    stepAndDraw(){
        var gl = this.gl;
        // Take multiple small timesteps per draw as a balance between simulation speed and numerical stability
        for(var i=0; i<10;i++){
            // First RK4 pass
            gl.useProgram(this.prog_rk4);
            gl.uniform1i(this.prog_rk4_psi, 1);
            gl.uniform1i(this.prog_rk4_kstep, 1);
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.FBO_K1);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            gl.uniform1i(this.prog_rk4_k, 2);
            gl.uniform1i(this.prog_rk4_kstep, 2);
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.FBO_K2);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            gl.uniform1i(this.prog_rk4_k, 3);
            gl.uniform1i(this.prog_rk4_kstep, 3);
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.FBO_K3);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            gl.uniform1i(this.prog_rk4_k, 4);
            gl.uniform1i(this.prog_rk4_kstep, 4);
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.FBO_K4);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            
            gl.useProgram(this.prog_step);
            gl.uniform1i(this.prog_step_psi, 1);
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.FBO_PSI1);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            gl.uniform1i(this.prog_step_addVortex, 0);
            gl.uniform1i(this.prog_step_reset, 0);
            gl.uniform1i(this.prog_step_quench, 0);
            gl.uniform1i(this.prog_step_randVort, 0);

            // Second RK4 pass
            gl.useProgram(this.prog_rk4);
            gl.uniform1i(this.prog_rk4_psi, 0);
            gl.uniform1i(this.prog_rk4_kstep, 1);
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.FBO_K1);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            gl.uniform1i(this.prog_rk4_k, 2);
            gl.uniform1i(this.prog_rk4_kstep, 2);
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.FBO_K2);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            gl.uniform1i(this.prog_rk4_k, 3);
            gl.uniform1i(this.prog_rk4_kstep, 3);
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.FBO_K3);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            gl.uniform1i(this.prog_rk4_k, 4);
            gl.uniform1i(this.prog_rk4_kstep, 4);
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.FBO_K4);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            
            gl.useProgram(this.prog_step);
            gl.uniform1i(this.prog_step_psi, 0);
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.FBO_PSI2);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }

        // Draw the wavefunction...
        gl.useProgram(this.prog_show);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        // ...and loop
        requestAnimationFrame(this.stepAndDraw.bind(this));
    }

    changeBoundary(value){
        var gl = this.gl;
        if(value == 'Periodic'){
            this.setPeriodic(gl.TEXTURE0);
            this.setPeriodic(gl.TEXTURE1);
            this.setPeriodic(gl.TEXTURE2);
            this.setPeriodic(gl.TEXTURE3);
            this.setPeriodic(gl.TEXTURE4);
            this.setPeriodic(gl.TEXTURE5);
        } else { 
            this.setReflective(gl.TEXTURE0);
            this.setReflective(gl.TEXTURE1);
            this.setReflective(gl.TEXTURE2);
            this.setReflective(gl.TEXTURE3);
            this.setReflective(gl.TEXTURE4);
            this.setReflective(gl.TEXTURE5);
        }
    }

    constructor() {
        var gl;
        this.canvas = document.getElementById('GPE');
        this.gl = gl = this.canvas.getContext('webgl');

        // Scale up the canvas display to fit the window
        this.scale = ((window.innerHeight < window.innerWidth)?window.innerHeight/1.1:window.innerWidth)/1.1;
        this.canvas.style.height = this.scale + 'px';

        // Set initial simulation parameters
        this.N = 256;
        this.opts = {
            'addPot': {
                'active': false,
                'x': 0,
                'y': 0,
                'r': 2,
            },
            'addTrap': false,
            'addVortex': {
                'active': false,
                'x': 0,
                'y': 0
            },
            'boundary': 'Reflective',
            'preset': 'Box',
            'dt': 0.1,
            'dx2': 0.5*0.5,
            'gamma': 0.01,
            'omega': 0,
            'showPhase': false,
        };

        // Setup webgl shaders
        this.initShaders();

        // Setup webgl texture storage
        this.pix = new Uint8Array(4*this.N*this.N);
        this.FBO_PSI1 = this.makeFBO(this.makeTexture(gl.TEXTURE0));
        this.FBO_PSI2 = this.makeFBO(this.makeTexture(gl.TEXTURE1));
        this.FBO_K1   = this.makeFBO(this.makeTexture(gl.TEXTURE2));
        this.FBO_K2   = this.makeFBO(this.makeTexture(gl.TEXTURE3));
        this.FBO_K3   = this.makeFBO(this.makeTexture(gl.TEXTURE4));
        this.FBO_K4   = this.makeFBO(this.makeTexture(gl.TEXTURE5));

        if( gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE)
            console.log('FRAMEBUFFER not complete');

        this.ui = new UI(this);
    }
}

class UI {
    setupControls(canvas){
        var gl = this.ctx.gl;
        var prog_step = this.ctx.prog_step;
        var prog_rk4 = this.ctx.prog_rk4;
        var scale = this.ctx.scale;


        // Handle touch events
        // Take note of touch start time
        canvas.addEventListener('touchstart', function (e) {
            this.isDragging = false;
            this.lastTouch = e.touches[0];
            this.ttc = Date.now();
            if (e.target == canvas) {
                e.preventDefault();
            }
        }, false);

        // If tap and dragging, insert a potential obstacle
        canvas.addEventListener('touchmove', function (e) {
            if(Date.now()-this.ttc > 100) this.isDragging = true;
            this.lastTouch = e.touches[0];
            var rect = canvas.getBoundingClientRect();
            var x =  this.lastTouch.clientX - rect.left;
            var y =  this.lastTouch.clientY - rect.top;
            if(this.isDragging){
                gl.useProgram(prog_rk4);
                gl.uniform1i(gl.getUniformLocation(prog_rk4, 'addPot'), 1);
                gl.uniform1f(gl.getUniformLocation(prog_rk4, 'addPot_x'), x/scale);
                gl.uniform1f(gl.getUniformLocation(prog_rk4, 'addPot_y'), (scale-y)/scale);
            }
            if (e.target == canvas) {
                e.preventDefault();
            }
        }, false);

        // Ensure obstacle is remove. If just tapping, insert a vortex. 
        canvas.addEventListener('touchend', function (e) {
            var rect = canvas.getBoundingClientRect();
            var x =  this.lastTouch.clientX - rect.left;
            var y =  this.lastTouch.clientY - rect.top;
            gl.useProgram(prog_rk4);
            gl.uniform1i(gl.getUniformLocation(prog_rk4, 'addPot'), 0);
            if (!this.isDragging) {
                gl.useProgram(prog_step);
                gl.uniform1i(gl.getUniformLocation(prog_step, 'addVortex'), 1);
                gl.uniform1f(gl.getUniformLocation(prog_step, 'addVortex_x'), x/scale);
                gl.uniform1f(gl.getUniformLocation(prog_step, 'addVortex_y'), (scale-y)/scale);
            }
            this.isDragging = false;
            if (e.target == canvas) {
                e.preventDefault();
            }
        }, false);

        // Take note of mouse click time and type
        document.body.addEventListener('mousedown', function(e) {
            this.isDragging = false;
            this.ttc = Date.now();
            if(e.target == canvas){
                switch(e.button){
                case 0:
                    this.isDown = true;
                    break;
                case 2:
                    this.isRightDown = true;
                    break;
                }
            }
        });

        // Handle inserting potental object on click-and-drag
        document.body.addEventListener('mousemove', function(e) {
            var x = (e.offsetX != null) ? e.offsetX : e.originalEvent.layerX;
            var y = (e.offsetY != null) ? e.offsetY : e.originalEvent.layerY;
            if(Date.now()-this.ttc > 100) this.isDragging = true;
            if(this.isDown && this.isDragging && e.target == canvas){
                gl.useProgram(prog_rk4);
                gl.uniform1i(gl.getUniformLocation(prog_rk4, 'addPot'), 1);
                gl.uniform1f(gl.getUniformLocation(prog_rk4, 'addPot_x'), x/scale);
                gl.uniform1f(gl.getUniformLocation(prog_rk4, 'addPot_y'), (scale-y)/scale);
            }
        });

        // Handle injecting positive vortex on left click and negative vortex on right click
        document.body.addEventListener('mouseup', function(e) {
            gl.useProgram(prog_rk4);
            gl.uniform1i(gl.getUniformLocation(prog_rk4, 'addPot'), 0);
            var x = (e.offsetX != null) ? e.offsetX : e.originalEvent.layerX;
            var y = (e.offsetY != null) ? e.offsetY : e.originalEvent.layerY;
            if (!this.isDragging && this.isDown && e.target == canvas) {
                gl.useProgram(prog_step);
                gl.uniform1i(gl.getUniformLocation(prog_step, 'addVortex'), 1);
                gl.uniform1f(gl.getUniformLocation(prog_step, 'addVortex_x'), x/scale);
                gl.uniform1f(gl.getUniformLocation(prog_step, 'addVortex_y'), (scale-y)/scale);
            }
            if (!this.isDragging && this.isRightDown && e.target == canvas) {
                gl.useProgram(prog_step);
                gl.uniform1i(gl.getUniformLocation(prog_step, 'addVortex'), -1);
                gl.uniform1f(gl.getUniformLocation(prog_step, 'addVortex_x'), x/scale);
                gl.uniform1f(gl.getUniformLocation(prog_step, 'addVortex_y'), (scale-y)/scale);
            }
            this.isRightDown = false;
            this.isDown = false;
            this.isDragging = false;
        });

        // Disable default right click menu on canvas item        
        canvas.addEventListener('contextmenu', function() {
            event.preventDefault();
            return false;
        });
        
    }

    constructor(ctx) {
        this.ctx = ctx;
        this.isDragging = false;
        this.isDown = false;
        this.isRightDown = false;
        var gl = this.ctx.gl;
        var prog_show = this.ctx.prog_show;
        var prog_step = this.ctx.prog_step;
        var prog_rk4 = this.ctx.prog_rk4;

        // Add dat GUI to the DOM. Start full width and closed if on a narrow screen
        var gui = new dat.GUI({width: (window.innerWidth < 600)?window.innerWidth:320, autoPlace: false});
        if(window.innerWidth < 600) gui.close();
        document.getElementById('GUI').appendChild(gui.domElement);

        // Setup the dat GUI parameter controllers
        gui.add(this.ctx.opts, 'preset', ['Box', 'Trapped & Rotating', 'Random Vortices (Phase)']).name('Preset Parameters').onChange(function(value) {
            if(value == 'Box'){
                gl.useProgram(prog_rk4);
                gl.uniform1i(gl.getUniformLocation(prog_rk4, 'addTrap'), 0);
                this.ctx.opts['addTrap'] = false;
                gl.uniform1f(gl.getUniformLocation(prog_rk4, 'gamma'), 0.01);
                this.ctx.opts['gamma'] = 0.01;
                gl.uniform1f(gl.getUniformLocation(prog_rk4, 'ang_mom'), 5);
                this.ctx.opts['omega'] = 0.0;
                gl.useProgram(prog_show);
                gl.uniform1i(gl.getUniformLocation(prog_show, 'showPhase'), false);
                this.ctx.opts['showPhase'] = false;
            } else if (value == 'Trapped & Rotating'){
                gl.useProgram(prog_rk4);
                gl.uniform1i(gl.getUniformLocation(prog_rk4, 'addTrap'), 1);
                this.ctx.opts['addTrap'] = true;
                gl.uniform1f(gl.getUniformLocation(prog_rk4, 'gamma'), 0.15);
                this.ctx.opts['gamma'] = 0.15;
                gl.uniform1f(gl.getUniformLocation(prog_rk4, 'ang_mom'), 1.6 + 5);
                this.ctx.opts['omega'] = 1.6;
            } else if (value == 'Random Vortices (Phase)'){
                gl.useProgram(prog_rk4);
                gl.uniform1i(gl.getUniformLocation(prog_rk4, 'addTrap'), 0);
                this.ctx.opts['addTrap'] = false;
                gl.uniform1f(gl.getUniformLocation(prog_rk4, 'gamma'), 0.01);
                this.ctx.opts['gamma'] = 0.01;
                gl.uniform1f(gl.getUniformLocation(prog_rk4, 'ang_mom'), 5);
                this.ctx.opts['omega'] = 0.0;
                gl.useProgram(prog_step);
                gl.uniform1i(gl.getUniformLocation(prog_step, 'randVort'), Math.floor(Math.random() * 256));
                gl.uniform1i(gl.getUniformLocation(prog_step, 'reset'), 1);
                gl.useProgram(prog_show);
                gl.uniform1i(gl.getUniformLocation(prog_show, 'showPhase'), true);
                this.ctx.opts['showPhase'] = true;
            }
            for (var i in gui.__controllers) {
                gui.__controllers[i].updateDisplay();
            }
        }.bind(this));

        gui.add(this.ctx.opts, 'boundary', ['Periodic', 'Reflective']).name('Boundary Condition').onChange(
            this.ctx.changeBoundary.bind(this.ctx)
        );

        gui.add(this.ctx.opts, 'gamma', 0.0, 0.3).step(0.01).name('Dissipation').onChange(function(value) {
            gl.useProgram(prog_rk4);
            gl.uniform1f(gl.getUniformLocation(prog_rk4, 'gamma'), value);
        });

        gui.add(this.ctx.opts, 'dt', 0, 0.1).step(0.01).name('Time Step').onChange(function(value) {
            gl.useProgram(prog_rk4);
            gl.uniform1f(gl.getUniformLocation(prog_rk4, 'dt'), value);
        });

        gui.add(this.ctx.opts, 'omega', -2 , 2).step(0.05).name('Angular Momentum').onChange(function(value) {
            gl.useProgram(prog_rk4);
            gl.uniform1f(gl.getUniformLocation(prog_rk4, 'ang_mom'), value + 5);
        });

        gui.add(this.ctx.opts.addPot, 'r',0,30).step(0.1).name('Obstacle Radius').onChange(function(value) {
            gl.useProgram(prog_rk4);
            gl.uniform1f(gl.getUniformLocation(prog_rk4, 'addPot_r'), value);
        });

        gui.add(this.ctx.opts, 'addTrap').name('Enable Trap').onChange(function (value) {
            gl.useProgram(prog_rk4);
            gl.uniform1i(gl.getUniformLocation(prog_rk4, 'addTrap'), value);
        });

        gui.add(this.ctx.opts, 'showPhase').name('Show Phase').onChange(function (value) {
            gl.useProgram(prog_show);
            gl.uniform1i(gl.getUniformLocation(prog_show, 'showPhase'), value);
        }); 

        gui.add({
            quench:function(){ 
                gl.useProgram(prog_step);
                gl.uniform1i(gl.getUniformLocation(prog_step, 'quench'), 1);
            }
        }, 'quench').name('Quench Phase');

        gui.add({
            reset:function(){ 
                gl.useProgram(prog_step);
                gl.uniform1i(gl.getUniformLocation(prog_step, 'reset'), 1);
            }
        }, 'reset').name('Reset Simulation');


        this.setupControls(this.ctx.canvas);
    }
}

var gpe = new GPE();
gpe.stepAndDraw();