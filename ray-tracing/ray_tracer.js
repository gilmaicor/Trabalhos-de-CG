class esfera {
  constructor(centro, radius, cor, especular) {
    this.centro = centro;
    this.radius = radius;
    this.cor = cor;
    this.especular = especular;
  }

  hit(origem, direcao) {

    var tmin;
    var temp = vec3.sub(vec3.create(), origem, this.centro);
    var a = vec3.dot(direcao, direcao);
    var b = 2.0 * vec3.dot(temp, direcao);
    var c = vec3.dot(temp, temp) - this.radius * this.radius;
    var disc = b * b - 4 * a * c;

    if (disc < 0) {
      return false;
    } else {
      var e = Math.sqrt(disc);
      var denom = 2 * a;

      var t = (-b - e) / denom;
      if (t > kEpsilon) {
        tmin = t;
        var local_hit_ponto = vec3.scaleAndAdd(vec3.create(), origem, direcao, t);
        var normal = vec3.sub(vec3.create(), local_hit_ponto, this.centro);
        return {
          tmin: tmin,
          normal: normal,
          local_hit_ponto: local_hit_ponto
        };
      }

      var t = (-b + e) / denom;
      if (t > kEpsilon) {
        tmin = t;
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

class Triangulo {
  constructor(ponto, normal, cor, especular) {
    this.ponto = ponto;
    this.normal = normal;
    this.cor = cor;
    this.especular = especular;
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

class Plano {
  constructor(ponto, normal, cor, especular) {
    this.ponto = ponto;
    this.normal = normal;
    this.cor = cor;
    this.especular = especular;
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
var camera_pos = vec3.fromValues(0, 0, 0);   // Posição da Camera
var PI = Math.PI;

// luzes
var luz1 = {
  intensidade: 8,
  position: vec3.fromValues(2, 2, 0)
};
var luz2 = {
  intensidade: 8,
  position: vec3.fromValues(0, 0, 10)
};
// objetos
// Esfera Vermelha
var esfera1 = new esfera(vec3.fromValues(-1, 0, 6), 1, vec3.fromValues(9, 0, 0), 600, 2);
// Esfera Azul
var esfera2 = new esfera(vec3.fromValues(2, 1, 8), 1, vec3.fromValues(0, 0, 9), 600, 5);
// Esfera Verde
var esfera3 = new esfera(vec3.fromValues(-3, 1, 8), 1, vec3.fromValues(0, 9, 0), 9, 4);
// Plano base Amarelo
var plano1 = new Plano(vec3.fromValues(0, -1, 0), vec3.fromValues(0, 1, 0), vec3.fromValues(9, 9, 0), 600, 0);
// Plano Escuro do Fundo
var plano2 = new Plano(vec3.fromValues(0, 0, 20), vec3.fromValues(0, 0, -1), vec3.fromValues(2, 2, 2), 600, 5);

function main() {
  objetos.push(esfera1);
  objetos.push(esfera2);
  objetos.push(esfera3);
  objetos.push(plano1);
  objetos.push(plano2);
  luzes.push(luz1);

  render();
}

function render() {

  var canvas = document.getElementById('canvas');
  var context2d = canvas.getContext("2d");
  var altura = canvas.height;
  var largura = canvas.width;
  var image_data = context2d.getImageData(0, 0, largura, altura);
  var raw_data = image_data.data;

  var z = 0;
  var	left = -largura/2
  var	right = largura/2
  var	bottom = -altura/2
  var	topp = altura/2

  for (var x = 0; x < largura; x++) {
    for (var y = 0; y < altura; y++) {

      // /* the corresponding x in the view plane */
      // var viewX = left + x * (right - left) / largura;
      // /* the corresponding y in the view plane */
      // var viewY = bottom + y * (topp - bottom) / altura;

      // // var viewX = left + (right - left) * (x + 0.5) / largura
      // // var viewY = bottom +  (topp - bottom) * (y + 0.5) / altura

      // var direcao = vec3.fromValues(viewX, viewY, z);
      // var origem = vec3.fromValues(0, 0, -1);

      // var cor = trace_ray(origem, direcao, kEpsilon, largura);

      var viewX = (y - (largura / 2)) / altura;
      var viewY = ((altura / 2) - x) / largura;

      var direcao = vec3.fromValues(viewX, viewY, 1);

      var cor = trace_ray(camera_pos, direcao, kEpsilon, largura);
      
      atribuir_cor(raw_data, x, y, largura, cor);
    }
  }

  context2d.putImageData(image_data, 0, 0);
}


function atribuir_cor(raw_data, x, y, largura, cor) {
  var index = x * largura * 4 + y * 4;
  raw_data[index+0] = cor[0];    // R
  raw_data[index+1] = cor[1];    // G
  raw_data[index+2] = cor[2];    // B
  raw_data[index+3] = 255;       // Alpha: 255
}

function trace_ray(origem, direcao, t_min, t_max) {

  var sombra_rec = intersecao_mais_proxima(origem, direcao, t_min, t_max);

  if (!sombra_rec)
    return vec3.fromValues(0, 0, 0);

  var normal = sombra_rec.normal;

  var n = vec3.dot(normal, normal);

  var  intensidade_da_luz = luz_ambiente;
  for (var i = 0; i < luzes.length; i++) {

    var intersecao_da_luz = vec3.sub(vec3.create(), luzes[i].position, sombra_rec.local_hit_ponto);

    var relacao_de_frente = vec3.dot(normal, intersecao_da_luz);
    var shadow_rec = intersecao_mais_proxima(sombra_rec.local_hit_ponto, intersecao_da_luz, kEpsilon, 1);

    if (!shadow_rec) {

      var difuso = relacao_de_frente / Math.sqrt(vec3.dot(intersecao_da_luz, intersecao_da_luz) * n);

      var especular_comp = objetos[sombra_rec.idx].especular;

      var M = vec3.scaleAndAdd(vec3.create(), intersecao_da_luz, normal, -2*relacao_de_frente/n);
 
      var especular = Math.max(0, Math.pow(vec3.dot(M, direcao) / Math.sqrt(vec3.dot(M, M) * vec3.dot(direcao, direcao)), especular_comp));

      intensidade_da_luz += luzes[i].intensidade * (difuso + especular);
    }
  }

  var local_cor = vec3.scale(vec3.create(), objetos[sombra_rec.idx].cor,  intensidade_da_luz*2.8);

  return local_cor;
}

function intersecao_mais_proxima(origem, direcao, t_min, t_max) {
  var tmin = 1000;
  var objeto_idx = -1;
  var sombra_rec = null;

  for (var i = 0; i < objetos.length; i++) {
    var rec = objetos[i].hit(origem, direcao);

    if (rec && rec.tmin > t_min && rec.tmin < t_max && rec.tmin < tmin) {
      tmin = rec.tmin;
      objeto_idx = i;
      sombra_rec = rec;
    }
  }
  // if there is a hit
  if (sombra_rec)
    sombra_rec.idx = objeto_idx;
  // return shading record
  return sombra_rec;
}

function setup_scene() {

  var l1 = document.getElementById("luz1").checked;
  var l2 = document.getElementById("luz2").checked;
  var rs = document.getElementById("esferaVermelha").checked;
  var bs = document.getElementById("esferaAzul").checked;
  var gs = document.getElementById("esferaVerde").checked;
  var yp = document.getElementById("planoAmarelo").checked;
  var gp = document.getElementById("planoVerde").checked;

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
  if (yp)
    objetos.push(plano1);
  if (gp)
    objetos.push(plano2);
  
  render();
}