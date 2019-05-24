Este servidor lo eralicé para montar rapidamente una app frontend para probar la generacion de 
token usando Google Signin

Recordar instalar lite-server desde  https://github.com/johnpapa/lite-server
  npm i lite-server --save-dev


Luego modificar el archivo package.json con
    "scripts": {
      "dev":"lite-server -c ls-config.json"
    },

donde ls-config.json es un archivo donde establezco el puerto que deseo usar para esta app
su contenido es:
    {
      "port":4200
    }

Ejecutar la aplicacion con npm run dev