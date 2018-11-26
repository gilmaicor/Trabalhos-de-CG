var gl = GL.create();

class Triangulo {

  constructor(a, b, c, cor, especular, reflexividade) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.cor = cor;
    this.especular = especular;
    this.reflexividade = reflexividade;
  }

  hit(origem, direcao){
      var ab = vec3.sub(vec3.create(), this.b, this.a);
      var ac = vec3.sub(vec3.create(), this.c, this.a);
      var normal = vec3.cross(vec3.create(), ab, ac);
      var normalLength = vec3.fromValues(vec3.length(normal), vec3.length(normal), vec3.length(normal));
      normal = vec3.divide(vec3.create(), normal, normalLength);
      var i = vec3.dot(normal, vec3.sub(vec3.create(), this.a, origem));
      var j = vec3.dot(normal, direcao);
      var t = i / j;

    
      if (t > 0) {
        var ts = vec3.fromValues(t, t, t);
        var hitt = vec3.add(vec3.create(), origem, vec3.multiply(vec3.create(), direcao, ts));
        var toHit = vec3.sub(vec3.create(), hitt, this.a);
        var dot00 = vec3.dot(ac, ac);
        var dot01 = vec3.dot(ac, ab);
        var dot02 = vec3.dot(ac, toHit)
        var dot11 = vec3.dot(ab, ab)
        var dot12 = vec3.dot(ab, toHit)
        var divide = dot00 * dot11 - dot01 * dot01;
        var u = (dot11 * dot02 - dot01 * dot12) / divide;
        var v = (dot00 * dot12 - dot01 * dot02) / divide;
        if (u >= 0 && v >= 0 && u + v <= 1) {
          return {
            tmin: t,
            normal: normal,
            local_hit_ponto: hitt
          }
        }
      }
      return false;
  }
};

class Esfera {
  constructor(centro, raio, cor, especular, reflexividade) {
    this.centro = centro;
    this.raio = raio;
    this.cor = cor;
    this.especular = especular;
    this.reflexividade = reflexividade;
  }

  hit(origem, direcao) {
    // see RTFGU page 57
    var tmin;
    var temp = vec3.sub(vec3.create(), origem, this.centro);
    var a = vec3.dot(direcao, direcao);
    var b = 2.0 * vec3.dot(temp, direcao);
    var c = vec3.dot(temp, temp) - this.raio * this.raio;
    var disc = b * b - 4.0 * a * c;     // discriminant

    if (disc < 0) {
      return false;
    } else {
      var e = Math.sqrt(disc);
      var denom = 2.0 * a;

      var t = (-b - e) / denom;         // smaller root
      if (t > kEpsilon) {
        tmin = t;
        // var normal = vec3.scaleAndAdd(vec3.create(), temp, direcao, t);
        var local_hit_ponto = vec3.scaleAndAdd(vec3.create(), origem, direcao, t);
        var normal = vec3.sub(vec3.create(), local_hit_ponto, this.centro);
        return {
          tmin: tmin,
          normal: normal,
          local_hit_ponto: local_hit_ponto
        };
      }

      var t = (-b + e) / denom;         // larger root
      if (t > kEpsilon) {
        tmin = t;
        // var normal = vec3.scaleAndAdd(vec3.create(), temp, direcao, t);
        var local_hit_ponto = vec3.scaleAndAdd(vec3.create(), origem, direcao, t);
        var normal = vec3.sub(vec3.create(), local_hit_ponto, this.centro);
        return {
          tmin: tmin,
          normal: normal,
          local_hit_ponto: local_hit_ponto
        };
      }
    }

    return false;
  }
}

class Plano {
  constructor(ponto, normal, cor, especular, reflexividade) {
    this.ponto = ponto;
    this.normal = normal;
    this.cor = cor;
    this.especular = especular;
    this.reflexividade = reflexividade;
  }

  hit(origem, direcao) {
    var tmin;
    var t = vec3.dot(vec3.sub(vec3.create(), this.ponto, origem), this.normal) / 
            vec3.dot(direcao, this.normal);
    if (t > kEpsilon) {
      var tmin = t;
      var local_hit_ponto = vec3.scaleAndAdd(vec3.create(), origem, direcao, t);
      return {
        tmin: tmin,
        normal: this.normal,
        local_hit_ponto: local_hit_ponto
      }
    }
    return false;
  }
}

var objetos = [];
var luzes = [];

var kEpsilon = 0.01;
var luz_ambiente = 2;
var camera_pos = vec3.fromValues(0, 1, 0);
var fov = 90;     // field of vision in degrees
var PI = Math.PI;
var recursion_depth = 4;


// luzes
var luz1 = {
  intencidade: 8,
  posicao: vec3.fromValues(2, 2, 0)
};
var luz2 = {
  intencidade: 8,
  posicao: vec3.fromValues(0, 0, 10)
};
// objetos
// red esfera
var esfera1 = new Esfera(vec3.fromValues(-1, 0, 6), 1, vec3.fromValues(9, 0, 0), 600, 2);
// blue esfera
var esfera2 = new Esfera(vec3.fromValues(2, 1, 8), 1, vec3.fromValues(0, 0, 9), 600, 5);
// green esfera
var esfera3 = new Esfera(vec3.fromValues(-3, 1, 8), 1, vec3.fromValues(0, 9, 0), 9, 4);
// green triangulo
var triangulo1 = new Triangulo(vec3.fromValues(2, 1, 8), vec3.fromValues(-1, 3, 6), vec3.fromValues(1, 2, 4), vec3.fromValues(9, 6, 3), 60, 4);
// yellow ground plano
var plano1 = new Plano(vec3.fromValues(0, -1, 0), vec3.fromValues(0, 1, 0), vec3.fromValues(9, 9, 0), 600, 0);
// dark grey mirror plano
var plano2 = new Plano(vec3.fromValues(0, 0, 20), vec3.fromValues(0, 0, -1), vec3.fromValues(2, 2, 2), 600, 5);

function main() {
  objetos.push(esfera1);
  objetos.push(esfera2);
  objetos.push(esfera3);
  objetos.push(triangulo1);
  objetos.push(plano1);
  objetos.push(plano2);
  luzes.push(luz1);

  render();
}

function render() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('canvas');
  // get 2d context
  var context2d = canvas.getContext("2d");
  // retrieve image data
  var image_data = context2d.getImageData(0, 0, canvas.width, canvas.height);
  // raw pixel cor values
  var raw_data = image_data.data;

  // loop through each pixel
  for (var r = 0; r < canvas.height; r++) {
    for (var c = 0; c < canvas.width; c++) {
      // calculate centro of pixel 
      var y = ((canvas.height / 2) - r) / canvas.width;
      var x = (c - (canvas.width / 2)) / canvas.height;

      // emit a ray from centro of this pixel, direcao is z
      var direcao = project(0,0,1)// vec3.fromValues(x, y, 1);
      var cor = trace_ray(camera_pos, direcao, kEpsilon, canvas.width, /* recursion depth */recursion_depth);
      
      // assign cor to raw_data
      assign_cor(raw_data, r, c, canvas.width, cor);
    }
  }

  // write cor data to canvas
  context2d.putImageData(image_data, 0, 0);
}


function assign_cor(raw_data, r, c, width, cor) {
  var index = r*width*4+c*4;
  raw_data[index+0]   = cor[0];   // R
  raw_data[index+1] = cor[1];     // G
  raw_data[index+2] = cor[2];     // B
  raw_data[index+3] = 255;          // Alpha: default to 255
}

function trace_ray(origem, direcao, t_min, t_max, depth) {
  // find nearest hit, return black cor if no hit
  var shade_rec = closest_intersection(origem, direcao, t_min, t_max);
  // if no intersection, return background cor
  if (!shade_rec)
    return vec3.fromValues(0, 0, 0);   // return black

  // get normal
  var normal = shade_rec.normal;
  // square length of normal vector
  var n = vec3.dot(normal, normal);

  // start with ambient luz
  var luz_intencidade = luz_ambiente;

  // for each luz
  for (var i = 0; i < luzes.length; i++) {
    // vector from intersection to luz
    var intersection_to_luz = vec3.sub(vec3.create(), luzes[i].posicao, shade_rec.local_hit_ponto);
    // facing ratio = normal dot luz
    var facing_ratio = vec3.dot(normal, intersection_to_luz);
    // shoot a shadow ray
    // [t_min, t_max] = [eps, 1] 
    // eps: to avoid self shadow
    // 1:   to stop at the luz itself and not go beyond
    var shadow_rec = closest_intersection(shade_rec.local_hit_ponto, intersection_to_luz, kEpsilon, 1);

    // if no objeto between luz and hitponto (not in shadow of something)
    if (!shadow_rec) {
      // calculate diffuse luz
      var diffuse = facing_ratio / Math.sqrt(vec3.dot(intersection_to_luz, intersection_to_luz) * n);
      // especular component of objeto
      var especular_comp = objetos[shade_rec.idx].especular;
      // TODO: use view dot reflection
      // r = -l + 2(n * l)n
      // m = -r
      var M = vec3.scaleAndAdd(vec3.create(), intersection_to_luz, normal, -2*facing_ratio/n);
      // calculate especular luz
      var especular = Math.max(0, Math.pow(vec3.dot(M, direcao) / Math.sqrt(vec3.dot(M, M) * vec3.dot(direcao, direcao)), especular_comp));

      luz_intencidade += luzes[i].intencidade * (diffuse + especular);
    }
  }

  // compute the cor channel multiplied by the luz intencidade
  var local_cor = vec3.scale(vec3.create(), objetos[shade_rec.idx].cor, luz_intencidade*2.8);

  // recursion
  if (depth > 0) {
    // reflection direcao
    var reflection = vec3.scaleAndAdd(vec3.create(), direcao, normal, -2*vec3.dot(normal, direcao)/n);
    // recursively shoot a reflection ray
    var recur_cor = trace_ray(shade_rec.local_hit_ponto, reflection, kEpsilon, 600, depth-1);
    // reflexividade property of objeto
    var reflexividade = objetos[shade_rec.idx].reflexividade / 9;

    return vec3.add(vec3.create(), 
                    vec3.scale(vec3.create(), recur_cor, reflexividade),
                    vec3.scale(vec3.create(), local_cor, (1 - reflexividade)));
  }
  // if reached max depth
  return local_cor;
}

function closest_intersection(origem, direcao, t_min, t_max) {
  var tmin = 1000;// some large number
  var objeto_idx = -1;
  var shade_rec = null;
  // test all objetos
  for (var i = 0; i < objetos.length; i++) {
    var rec = objetos[i].hit(origem, direcao);
    // if within [t_min, t_max] and smaller than current tmin
    if (rec && rec.tmin > t_min && rec.tmin < t_max && rec.tmin < tmin) {
      tmin = rec.tmin;
      objeto_idx = i;
      shade_rec = rec;
    }
  }
  // if there is a hit
  if (shade_rec)
    shade_rec.idx = objeto_idx;
  // return shading record
  return shade_rec;
}

function setup_scene() {
  recursion_depth = document.getElementById("depth").value;

  var l1 = document.getElementById("luz1").checked;
  var l2 = document.getElementById("luz2").checked;
  var rs = document.getElementById("esfVermelha").checked;
  var bs = document.getElementById("esfazul").checked;
  var gs = document.getElementById("esfVerde").checked;
  var ts = document.getElementById("triVerde").checked;
  var yp = document.getElementById("planoAmarelo").checked;
  var gp = document.getElementById("planoCinza").checked;

  objetos = [];
  luzes = [];

  if (l1)
    luzes.push(luz1);
  if (l2)
    luzes.push(luz2);
  if (rs)
    objetos.push(esfera1);
  if (bs)
    objetos.push(esfera2);
  if (gs)
    objetos.push(esfera3);
  if (ts)
    objetos.push(triangulo1);
  if (yp)
    objetos.push(plano1);
  if (gp)
    objetos.push(plano2);
  
  render();
}

var ortho = mat4.ortho(vec3.create(), -250, 250, -60, 60, 0.1, 1000)

var project = function(objX, objY, objZ, modelview, ortho, viewport) {
  modelview =  gl.modelviewMatrix;
  projection = projection || gl.projectionMatrix;
  viewport = viewport || gl.getParameter(gl.VIEWPORT);
  var point = projection.transformPoint(modelview.transformPoint(new Vector(objX, objY, objZ)));
  return new Vector(
    viewport[0] + viewport[2] * (point.x * 0.5 + 0.5),
    viewport[1] + viewport[3] * (point.y * 0.5 + 0.5),
    point.z * 0.5 + 0.5
  );
};


  //     gl.fullscreen({ fov: 45, near: 0.1, far: 1000 });
  //
  // Adding padding from the edge of the window:
  //
  //     gl.fullscreen({ paddingLeft: 250, paddingBottom: 60 });