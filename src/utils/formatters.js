/*=============================================================================
  Nombre responsabilidad: Proveer funciones auxiliares de formato

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 29/Septiembre/2026

  Descripcion responsabilidad:
  Centraliza funciones reutilizables para presentar fechas y otros valores
  de forma homogénea en la aplicación.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

/*
  Presenta la fecha y hora en formato local colombiano.
  Si no existe una fecha válida, devuelve un guion.
*/
export function formatearFecha(fecha) {

    if (!fecha) {
        return '-';
    }

    return new Intl.DateTimeFormat(
        'es-CO',
        {
            dateStyle: 'short',
            timeStyle: 'short'
        }
    ).format(
        new Date(fecha)
    );

}