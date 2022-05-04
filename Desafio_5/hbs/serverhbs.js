const express = require("express"); //definir la constante express
const { Router } = express;

const app = express(); //inicializa
const router = Router();

const PORT = 8080;

const handlebars = require("express-handlebars");

app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main.hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials/",
  })
);

app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

//app.use(express.static("public"));
//app.use("/express/url", express.static(__dirname + "/public")); //defino una ruta virtual

const fs = require("fs");

class Contenedor {
  constructor(nombre) {
    this.nombre = nombre;
    this.id = 0;
    this.arreglo = [];
  }

  save(obj) {
    try {
      this.id++;
      obj.id = this.id;
      this.arreglo.push(obj);
      fs.writeFileSync(this.nombre, JSON.stringify(this.arreglo));
    } catch (error) {
      console.log("No se guardó el archivo");
    }
  }

  getAll() {
    try {
      const productos = fs.readFileSync(this.nombre);
      return JSON.parse(productos);
    } catch (error) {
      console.log("No se leyó el archivo");
    }
  }
}

let c = new Contenedor("./productos.json");

let prod1 = { title: "Fatay", price: 100, thumbnail: "./images/fatayc.png" };
let prod2 = {
  title: "Kebbe",
  price: 100,
  thumbnail: "./images/kebbefrito.png",
};
let prod3 = { title: "Falafel", price: 100, thumbnail: "./images/falafel.png" };

c.save(prod1);
c.save(prod2);
c.save(prod3);

let array = c.getAll();
console.log(array);

let contenido = new Contenedor("./productos.json");

router.get("/", (req, res) => {
  let content = c.getAll();
  return res.render("index.hbs", { content });
});

router.get("/productos/form", function (req, resp) {
  resp.sendFile(__dirname + "/public/index.html");
});

router.get("/productos", function (req, res) {
  res.render("productos.hbs", {
    platoSugerido: contenido.getAll(),
    listExists: true,
  });
});

router.post("/productos", (req, resp) => {
  c.save(req.body);
  resp.json({
    result: "add by id",
    id: req.params.id,
    body: req.body,
  });
});

const server = app.listen(8080, () => {
  console.log("La aplicación está escuchando");
});
