import express from 'express';
import fs from 'fs';

const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

/* Responda en la ruta raíz un mensaje de acuerdo a la hora actual: si dicha hora se encuentra entre
las 6 y las 12hs será 'Buenos dias!', entre las 13 y las 19hs 'Buenas tardes!' y de 20 a 5hs 'Buenas
noches!'.*/

app.get('/', (req, res) => {

    let hours = new Date().getHours().toLocaleString();
    let saludo = '';
    if (hours > 6 && hours < 12) {
        saludo = 'Buenos Dias';
    } else if (hours > 13 && hours < 19) {
        saludo = 'Buenas Tardes';
    } else {
        saludo = 'Buenas Noches';
    }
    res.status('200').send(`<h1> ${saludo} </h1>`);
});

/* ruta get ‘/random’ la cuál iniciará un cálculo de 10000 números
aleatorios en el rango del 1 al 20. Luego de dicho proceso, el servidor retornará un objeto cuyas
claves sean los números salidos y el valor asociado a cada clave será la cantidad de veces que salió
dicho número.*/
app.get('/random', (req, res) => {
    let arrayNumbersRandom = [];
    let repetidos = {};
    for (let i = 0; i < 10000; i++) {
        arrayNumbersRandom.push(Math.floor(Math.random() * (21 - 1)) + 1);
    }
    arrayNumbersRandom.forEach(numero => {
        repetidos[numero] = (repetidos[numero] || 0) + 1;
    });
    res.status(200).send(repetidos);
});

/*Definir otra ruta get llamada ‘/info’ que sea capaz de leer el archivo package.json y devuelva un
objeto con el siguiente formato y datos:
Esta ruta será capaz de:
• Mostrar por consola el objeto info luego de leer el archivo.
• Guardar el objeto info en un archivo llamado info.txt dentro de la misma carpeta de
package.json, preservando el formato de representación del objeto en el archivo
(tabuladores, saltos de línea, etc)
• Utilizar la lectura y escritura de archivos en modo asincrónico con async await. */

app.get('/info', async(req, res) => {
    let pathArchivo = './package.json';
    try {
        let datos = await fs.promises.readFile(pathArchivo, 'utf-8');
        let info = {
            "contenidoStr": datos.toString(),
            "contenidoObj": JSON.parse(datos),
            "size": datos.length
        }
        await fs.promises.writeFile('./info.txt', JSON.stringify(info))
        res.send(info);
    } catch (error) {
        console.log(`error ${error} `);
    }

});

/*Por último, declarar una ruta get ‘/operaciones’, que reciba por query-params dos números y la
operación a realizar entre ellos. Ejemplo: …./operaciones?num1=5&num2=6&operacion=suma
Las operaciones válidas serán: suma, resta, multiplicación y división.
Si no se ingresa alguno de estos parámetros, si los tipos de datos no corresponden ó si operación no
es válida, se devolverá un error mediante un objeto con la siguiente estructura:
{
 error: {
 num1: { valor: x, tipo: y },
 num2: { valor: x, tipo: y },
 operacion: { valor: x, tipo: y }
 }
}
Si todo está correcto, devolver un objeto que contenga los dos números ingresados, la operación y el
resultado. */

app.get('/operaciones', (req, res) => {
    const { num1, num2, operacion } = req.query;
    const arrayOperaciones = ['suma', 'resta', 'multiplicacion', 'division'];
    console.log(typeof num1);
    console.log(typeof num2);
    console.log(arrayOperaciones.indexOf(operacion.toLowerCase()));
    if (isNaN(num1) || isNaN(num2) || arrayOperaciones.indexOf(operacion.toLowerCase()) == -1) {
        let error = {
            num1: num1,
            num2: num2,
            operacion: operacion
        }

        res.status(404).send(error);
    } else {
        let tarea = operacion.toLowerCase();
        let result;
        if (tarea == 'suma') {
            result = Number(num1) + Number(num2);
        } else if (tarea == 'resta') {
            result = num1 - num2;
        } else if (tarea == 'division' && num2 != 0) {
            result = num1 / num2;
        } else {
            result = num1 * num2;
        }
        let objResultado = {
            num1: num1,
            num2: num2,
            operacion: operacion,
            resultado: result
        }
        res.send(objResultado);
    }
});


/*- Utilizar import (ES Modules) para todos los procesos y separar en módulos el desarrollo.
- Considerar lo necesario para que este proyecto puede funcionar de forma local o hosteado en
glitch.com.
- Subir el ejercicio a github (ignorar la subida de node_modules) y hacer el deploy en glitch desde
dicho repo. Fijar la versión mínima de Node.js para que glitch instale la versión correcta de node y
funcionen los import de ES Modules. */




/*(se mostrará por consola cuando
el servidor esté listo para operar y en que puerto lo está haciendo*/
const PORT = process.env.PORT || 8081;
app.set('PUERTO', PORT);
const server = app.listen(PORT, () => {
    console.log(`Servidor express escuchando en ${server.address().port}`);
});

server.on('error', error => {
    console.log(`Error en Servidor:  ${error}`);
});