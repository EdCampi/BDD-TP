# TP de Base de Datos (75.15)
Repositorio dedicado al trabajo practico de la materia Base de datos, 75.15 de la FIUBA.

## Notas
Para correr el backend es necesario antes:
* Tener instalado Node.js.
* Tener instalado MySQL con su shell.
* Tener instalado MongoDB localmente junto con mongosh e inciarlo.
* Asegurarse de iniciar ambas bases de datos localmente antes de de correr el server, ejecutar `node server.js` en la carpeta backend.
* Configurar el archivo `.env` de la carpeta backend.
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=123456
DB_NAME=restaurants_data
MONGO_URI=mongodb://localhost:27017/reviews_data
CORS_ORIGIN=http://localhost:3000
```

Para correr el frontend es necesario:
* Correr `npm start run` dentro de la carpeta frontend para inciar la app React.
* Configurar el archivo `.env` de la carpeta frontend.
```
REACT_APP_MONGO_DB_URI=http://localhost:3001/mongoDbAPI/
REACT_APP_MYSQL_URI=http://localhost:3001/sqlAPI/
```

*Disclaimer:* Los archivos `.env` y/o su contenido nunca deberían ser revelados, acá solo están a modo de ejemplo.
