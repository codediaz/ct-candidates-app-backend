# Sistema de Reserva de Tickets - Backend

Este proyecto corresponde a la **parte backend** del sistema de reserva de tickets. El backend está gestionado de manera **separada** utilizando **Docker Compose**, lo que facilita su despliegue y mantenimiento independiente.

---

## **Configuración Inicial**

Antes de iniciar, asegúrate de configurar un archivo `.env` dentro de la carpeta `backend`. Este archivo debe contener las siguientes variables de entorno:

```env
BACK_PORT=5000
DB_PORT=3306
DB_HOST=db
DB_USER=root
DB_ROOT_PASSWORD=12345
MYSQL_DATABASE=ticket_system
JWT_SECRET=esto_no_es_muy_secreto
```

### **Estructura de Carpetas**

Verifica que tu proyecto tenga la siguiente estructura:

```
your_path/
│
├── backend/
│   ├── Dockerfile
│   ├── .env
│   ├── package.json
│   ├── ... (otros archivos)
├── db/
│   └── init.sql
│   
├── docker-compose.yml
```

---

## **Iniciar el Backend con Docker Compose**

### **Requisitos Previos**

- **Docker**: Asegúrate de tener Docker instalado y en funcionamiento en tu sistema.
- **Estructura Completa del Proyecto**: Asegúrate de tener clonados tanto el backend como el frontend en la estructura de carpetas correcta.

### **Comandos para Iniciar el Backend**

Ejecuta el siguiente comando desde la raíz del proyecto para construir y levantar el contenedor del backend:

```bash
docker compose --env-file ./backend/.env up --build
```

Este comando realizará lo siguiente:

- **Construcción de la Imagen**: Compilará la imagen Docker utilizando el `Dockerfile` ubicado en `./backend`.
- **Levantar el Contenedor**: Iniciará el contenedor del backend en modo *detached* (`-d`), permitiendo que el backend esté accesible en el puerto especificado (`BACK_PORT`).

### **Resolución de Problemas**

Si encuentras inconvenientes al iniciar el backend, puedes reiniciar el contenedor asegurando una configuración limpia:

```bash
docker compose --env-file ./backend/.env down -v
docker compose --env-file ./backend/.env up --build
```

Estos comandos:

1. **Apagan y eliminan** el contenedor actual del backend, junto con los volúmenes asociados.
2. **Reconstruyen y levantan** nuevamente el contenedor, garantizando una configuración fresca.

---

## **Usuarios de Prueba**

La base de datos contiene usuarios predefinidos para pruebas:

### Usuario Regular

- **Username:** finn
- **Email:** [finnelhumano@adventure.com](mailto:finnelhumano@adventure.com)
- **Password:** password
- **Admin:** No

### Usuario Administrador

- **Username:** jake
- **Email:** [jake@adventure.com](mailto:jake@adventure.com)
- **Password:** password
- **Admin:** Yes

---

## **Datos Iniciales de Eventos**

La base de datos también contiene eventos de ejemplo para pruebas. Puedes consultarlos mediante los endpoints descritos a continuación.

---

## **Endpoints Disponibles**

### **Autenticación**

- **`POST /api/auth/register`**: Registro de nuevos usuarios.
- **`POST /api/auth/login`**: Inicio de sesión y obtención de un token JWT.

### **Eventos**

- **`GET /api/events`**: Obtener todos los eventos. *(Requiere token JWT)*.
- **`GET /api/events/:id`**: Obtener información de un evento por ID. *(Requiere token JWT)*.

### **Reservaciones**

- **`POST /api/reservations`**: Realizar una reservación para un evento. *(Requiere token JWT)*.
- **`GET /api/reservations`**: Obtener las reservaciones del usuario autenticado. *(Requiere token JWT)*.

### **Administración de Eventos** *(Solo para Administradores)*

- **`POST /api/admin/events`**: Crear un nuevo evento. *(Requiere token JWT y rol de administrador)*.
- **`PUT /api/admin/events/:id`**: Actualizar un evento existente por ID. *(Requiere token JWT y rol de administrador)*.
- **`DELETE /api/admin/events/:id`**: Eliminar un evento existente por ID. *(Requiere token JWT y rol de administrador)*.

---

## **Middleware Utilizados**

- **`verifyToken`**: Verifica la autenticidad del token JWT.
- **`isAdmin`**: Comprueba si el usuario autenticado tiene rol de administrador.

---

## **Pruebas Unitarias**

Este proyecto utiliza **Jest** como herramienta para realizar pruebas unitarias.

### **Ejecución de Pruebas**

#### **Opción 1: Dentro del Contenedor Docker**

1. **Identifica el ID o nombre del contenedor del backend**:

   ```bash
   docker ps
   ```

   Busca el contenedor con el nombre `backend`.

2. **Ejecuta las pruebas dentro del contenedor**:

   ```bash
   docker exec -it backend npm test
   ```

#### **Opción 2: Localmente en tu Máquina**

Si tienes **Node.js** y **npm** instalados en tu máquina local, puedes ejecutar las pruebas directamente desde la carpeta `backend`:

1. **Navega a la carpeta del backend**:

   ```bash
   cd backend
   ```

2. **Instala las dependencias** (si aún no lo has hecho):

   ```bash
   npm install
   ```

3. **Ejecuta las pruebas**:

   ```bash
   npm test
   ```

### **Notas sobre las Pruebas Unitarias**

- **Configuración**: Asegúrate de que todas las dependencias estén correctamente instaladas antes de ejecutar las pruebas.
- **Resultados**: Las pruebas proporcionarán un informe detallado de los casos que han pasado o fallado, ayudándote a identificar y corregir posibles errores en el código.

---

## **Notas Adicionales**

- **Docker en Funcionamiento**: Asegúrate de que Docker esté corriendo correctamente antes de intentar levantar el contenedor del backend.
  
- **Configuración Correcta de `.env`**: Verifica que todas las variables de entorno en `./backend/.env` estén correctamente definidas para evitar errores en la conexión con la base de datos u otros servicios.
  
- **Dependencias Externas**: Asegúrate de que la base de datos esté corriendo y accesible en la URL definida por `DB_HOST` y el puerto `DB_PORT` para que las funcionalidades de reserva y autenticación funcionen correctamente.
  
- **Herramientas de Prueba de API**: Utiliza **Postman** o cualquier otra herramienta similar para realizar pruebas con los endpoints. No olvides incluir el token JWT en el encabezado `Authorization` para las rutas protegidas.

  ```http
  Authorization: Bearer <token>
  ```

- **Logs y Depuración**: Puedes acceder a los logs del contenedor del backend para depurar cualquier problema:

  ```bash
  docker logs backend
  ```

---

## **Comandos Útiles**

- **Levantar el Backend**:

  ```bash
  docker compose --env-file ./backend/.env up --build
  ```

- **Detener el Backend**:

  ```bash
  docker compose --env-file ./backend/.env down -v
  ```

- **Ejecutar Pruebas Unitarias Dentro del Contenedor**:

  ```bash
  docker exec -it backend npm test
  ```

- **Ejecutar Pruebas Unitarias Localmente**:

  ```bash
  cd backend
  npm install
  npm test
  ```