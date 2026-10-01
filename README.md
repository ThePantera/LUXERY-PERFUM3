# Luxery Perfum — Beta

Catálogo inicial generado desde `Fragancias .xlsx`.

## Datos importados
- Hojas: Mujer, Diseñador Hombre, Arabes & Nicho Hombre
- Productos normalizados: 634
- Categorías: Mujer / Hombre
- Subcategorías: Diseñador / Árabes & Nicho / Mini / Travel

## Tecnologías de esta beta
- HTML5
- CSS3
- JavaScript vanilla
- JSON como fuente del catálogo
- localStorage para carrito y sesión DEMO

## Funciones actuales
- Catálogo dinámico desde `data/products.json`
- Búsqueda
- Filtros
- Ordenamiento
- Ficha de producto
- Carrito
- Cuenta de usuario DEMO
- Base para checkout por WhatsApp
- Páginas legales iniciales

## Importante antes de producción
El login, permisos de administrador, stock, imágenes, edición de productos y seguridad NO deben depender únicamente del navegador. En la siguiente etapa conviene pasar a un backend con autenticación, base de datos, RBAC ADMIN/CLIENT y almacenamiento de imágenes.

## Próxima arquitectura recomendada
Frontend: HTML/CSS/JS o React
Backend: Node.js + Express
DB: PostgreSQL
Auth: sesiones/JWT + hash Argon2/bcrypt
Imágenes: Cloudinary/S3
Admin: CRUD de productos + stock + imágenes + descripción
Checkout: WhatsApp primero; pagos online después
