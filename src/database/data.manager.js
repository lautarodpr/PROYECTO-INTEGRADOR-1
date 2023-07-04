const fs   = require("fs");
const path = require("path");

const ruta = path.join(__dirname, "data.json");

function escribir(contenido) {
    return new Promise((resolve, reject) => {
        fs.writeFile(ruta, JSON.stringify(contenido, null, "\t"), "utf8", (error) => {
            if (error) reject(new Error("Error. No se puede escribir"));

            resolve(true);
        });
    });
}

function leer() {
    return new Promise((resolve, reject) => {
        fs.readFile(ruta, "utf8", (error, result) => {
            if (error) reject(new Error("Error. No se puede leer"));

            resolve(JSON.parse(result));
        });
    });
}

function generarId(zapatillas) {
    let mayorId = 0;

    zapatillas.forEach((zapatilla) => {
        if (Number(zapatilla.id) > mayorId) {
            mayorId = Number(zapatilla.id);
        }
    });

    return mayorId + 1;
}

async function findOneById(id) {
    if (!id) throw new Error("Error. El Id está indefinido.");

    const zapatillas = await leer();
    const zapatilla  = zapatillas.find((element) => element.id === id);

    if (!zapatilla) throw new Error("Error. El Id no corresponde a un calzado en existencia.");

    return zapatilla;
}

async function findAll() {
    const zapatillas = await leer();
    return zapatillas;
}

async function create(zapatilla) {
    if (!zapatilla?.marca || !zapatilla?.color || !zapatilla?.anio) throw new Error("Error. Datos incompletos.");

    let zapatillas = await leer();
    const zapatillaConId = { id: generarId(zapatillas), ...zapatilla };

    zapatillas.push(zapatillaConId);
    await escribir(zapatillas);

    return zapatillaConId;
}

async function update(zapatilla) {
    if (!zapatilla?.id || !zapatilla?.marca || !zapatilla?.color || !zapatilla?.anio) throw new Error("Error. Datos incompletos.");

    let zapatillas   = await leer();
    const indice = zapatillas.findIndex((element) => element.id === zapatilla.id);

    if (indice < 0) throw new Error("Error. El Id no corresponde a un calzado en existencia.");

    zapatillas[indice] = zapatilla;
    await escribir(zapatillas);

    return zapatillas[indice];
}

async function destroy(id) {
    if (!id) throw new Error("Error. El Id está indefinido.");

    let zapatillas   = await leer();
    const indice = zapatillas.findIndex((element) => element.id === id);

    if (indice < 0) throw new Error("Error. El Id no corresponde a un calzado en existencia.");

    const zapatilla = zapatillas[indice];
    zapatillas.splice(indice, 1);
    await escribir(zapatillas);

    return zapatilla;
}

module.exports = { findOneById, findAll, create, update, destroy };