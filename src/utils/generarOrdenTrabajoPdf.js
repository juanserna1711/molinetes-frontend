/*=============================================================================
  Nombre responsabilidad: Generar PDF de Orden de Trabajo

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 25/Septiembre/2026

  Descripcion responsabilidad:
  Genera el reporte PDF de una Orden de Trabajo utilizando los datos
  persistidos en ORDEPROD y la información técnica asociada del cálculo.

  Historial_modificaciones:

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha: 26/Septiembre/2026
  Descripcion:
  Se ajusta el reporte a una tabla única, mostrando únicamente las tallas
  utilizadas, resaltando los datos registrados y el tiempo de giro, e
  incorporando la identidad visual de la aplicación.
=============================================================================*/

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const COLORES = {
    primario: [38,54,77],
    rosado: [237,22,133],
    rosadoSuave: [253,238,246],
    grisTexto: [101,115,136],
    grisClaro: [247,249,251],
    borde: [222,228,235],
    blanco: [255,255,255]
};

/*
  Genera el archivo PDF correspondiente a una Orden de Trabajo.
*/
export async function generarOrdenTrabajoPdf(
    datosOrden,
    {
        logoMoliplus = null,
        logoTextiles = null
    } = {}
) {

    if (
        !Array.isArray(datosOrden) || datosOrden.length === 0
    ) {
        throw new Error( 'La Orden de Trabajo no contiene información para imprimir.');
    }

    const orden = datosOrden[0];

    /* =========================================================
       TALLAS UTILIZADAS
       ========================================================= */

    /*
      Obtiene únicamente las tallas que realmente tuvieron rollos dentro de la Orden de Trabajo.
    */
    const tallasUsadas = Array.from(
        new Map(
            datosOrden.filter((detalle) =>Number(detalle.rollos || 0) > 0).map((detalle) => [
                    detalle.codigoTalla,
                    {
                        codigo: detalle.codigoTalla,
                        nombre: detalle.nombreTalla
                    }
                ])
        ).values()
    );

    /* =========================================================
       MOLINETES
       ========================================================= */

    /*
      Obtiene una sola vez cada molinete participante dentro de la Orden de Trabajo.
    */
    const molinetes = Array.from(
        new Map(
            datosOrden.map((detalle) => [
                detalle.codigoMolinete,
                {
                    codigo: detalle.codigoMolinete,
                    nombre: detalle.nombreMolinete,
                    rpm: detalle.rpm,
                    totalRollos: detalle.totalRollosMolinete,
                    totalMetros: detalle.totalMetrosMolinete,
                    tiempoGiro: detalle.tiempoGiroMolinete
                }
            ])
        ).values()
    );

    /* =========================================================
       DETALLE POR MOLINETE Y TALLA
       ========================================================= */

    /*
      Permite localizar rápidamente el detalle correspondiente a una combinación molinete-talla.
    */
    const detallesPorCombinacion = new Map();

    datosOrden.forEach((detalle) => {
        detallesPorCombinacion.set(`${detalle.codigoMolinete}-${detalle.codigoTalla}`, detalle);
    });

    /* =========================================================
       TOTALES
       ========================================================= */

    /*
      Calcula la cantidad total de rollos por talla.
    */
    const totalRollosPorTalla = {};

    tallasUsadas.forEach((talla) => {
        totalRollosPorTalla[talla.codigo] = datosOrden.filter((detalle) => detalle.codigoTalla === talla.codigo).reduce( (total, detalle) =>  total + Number(detalle.rollos || 0), 0 );
    });

    /*
      Calcula la cantidad total de rollos correspondiente a toda la orden.
    */
    const totalRollosOrden = datosOrden.reduce( (total, detalle) => total + Number( detalle.rollos || 0 ), 0 );

    /* =========================================================
       DOCUMENTO
       ========================================================= */

    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });


    const anchoPagina =
        pdf.internal.pageSize.getWidth();

    /* =========================================================
       LOGOS
       ========================================================= */

    if (logoMoliplus) {
        pdf.addImage(
            logoMoliplus,
            'PNG',
            12,
            5,
            43,
            18,
            undefined,
            'FAST'
        );
    }

    if (logoTextiles) {
        pdf.addImage(
            logoTextiles,
            'PNG',
            anchoPagina - 55,
            5,
            43,
            18,
            undefined,
            'FAST'
        );
    }

    /* =========================================================
       ENCABEZADO
       ========================================================= */

    pdf.setTextColor(
        ...COLORES.grisTexto
    );
    pdf.setFont(
        'helvetica',
        'bold'
    );
    pdf.setFontSize(8);
    pdf.text(
        'ORDEN DE TRABAJO No.',
        anchoPagina / 2,
        9,
        {align: 'center'}
    );

    /*
      Número principal de la Orden de Trabajo.
    */
    pdf.setTextColor(
        ...COLORES.primario
    );
    pdf.setFontSize(55);
    pdf.text(
        `${orden.codigoOrden}`,
        anchoPagina / 2,
        26,
        {align: 'center'}
    );

    /*
      Línea decorativa bajo el número.
    */
    pdf.setDrawColor(
        ...COLORES.rosado
    );
    pdf.setLineWidth(.6);
    pdf.line(
        anchoPagina / 2 - 18,
        29,
        anchoPagina / 2 + 18,
        29
    );

/* =========================================================
   INFORMACIÓN GENERAL
   ========================================================= */

pdf.setFontSize(8);
pdf.setFont(
    'helvetica',
    'normal'
);
pdf.setTextColor(
    ...COLORES.grisTexto
);

/* Tipo de Hilaza - izquierda */
pdf.text(
    'Tipo de Hilaza',
    14,
    36,
    {align: 'left'}
);

/* Fecha - centro */
pdf.text(
    'Fecha',
    anchoPagina / 2,
    36,
    {align: 'center'}
);

/* Usuario - derecha */
pdf.text(
    'Usuario',
    anchoPagina - 14,
    36,
    {align: 'right'}
);
pdf.setFont(
    'helvetica',
    'bold'
);
pdf.setTextColor(
    ...COLORES.primario
);

/* Valor Tipo de Hilaza - izquierda */
pdf.text(
    orden.nombreTipoHilaza || '-',
    14,
    40,
    {align: 'left'}
);

/* Valor Fecha - centro */
pdf.text(
    orden.fechaGeneracion
        ? new Date(
            orden.fechaGeneracion
        ).toLocaleDateString(
            'es-CO'
        )
        : '-',
    anchoPagina / 2,
    40,
    {align: 'center'}
);

/* Valor Usuario - derecha */
pdf.text(
    orden.nombreUsuario || '-',
    anchoPagina - 14,
    40,
    {align: 'right'}
);

    /* =========================================================
       ENCABEZADOS DE TABLA
       ========================================================= */
    /*
      Molinete, RPM y los totales utilizan rowSpan porque ocupan las dos filas del encabezado.
      Cada talla genera dos columnas: Rollos y Metros.
    */
    const encabezadoSuperior = [
        {
            content: 'Molinete',
            rowSpan: 2,
            styles: {valign: 'middle'}
        },
        {
            content: 'RPM',
            rowSpan: 2,
            styles: {valign: 'middle'}
        }
    ];


    tallasUsadas.forEach((talla) => {
        encabezadoSuperior.push({
            content: talla.nombre,
            colSpan: 2,
            styles: { halign: 'center' }
        });
    });


    encabezadoSuperior.push(
        {
            content: 'Total\nMetros',
            rowSpan: 2,
            styles: { valign: 'middle'}
        },
        {
            content: 'Tiempo\nGiro min',
            rowSpan: 2,
            styles: { valign: 'middle'}
        },
        {
            content: 'Total\nRollos',
            rowSpan: 2,
            styles: { valign: 'middle' }
        }
    );

    /*
      IMPORTANTE:
      No se agregan columnas vacías para Molinete, RPM ni los totales porque estas ya utilizan rowSpan.
    */
    const encabezadoDetalle = [];
    tallasUsadas.forEach(() => {
        encabezadoDetalle.push(
            'Rollos',
            'Metros'
        );
    });

    /* =========================================================
       CUERPO DE TABLA
       ========================================================= */

    const body =
        molinetes.map((molinete) => {
            const fila = [
                {
                    content: molinete.nombre,
                    styles: {
                        fontStyle: 'bold',
                        textColor:COLORES.primario
                    }
                },
                formatearNumero(
                    molinete.rpm,
                    0
                )
            ];

            /*
              Agrega las columnas dinámicas de cada talla.
            */
            tallasUsadas.forEach((talla) => {
                const detalle =
                    detallesPorCombinacion.get(
                        `${molinete.codigo}-${talla.codigo}`
                    );

                const tieneDatos =
                    detalle &&
                    Number(
                        detalle.rollos || 0
                    ) > 0;

                /*
                  Cuando existe producción, resalta suavemente Rollos y Metros.
                  Cuando no existe producción para esa talla en el molinete se muestra únicamente "-".
                */
                fila.push(

                    tieneDatos
                        ? {
                            content:
                                formatearNumero(
                                    detalle.rollos,
                                    1
                                ),
                            styles: {
                                textColor: COLORES.primario,
                                fontStyle: 'bold'
                            }
                        }
                        : {
                            content: '-',
                            styles: {
                                textColor: COLORES.grisTexto
                            }
                        },

                    tieneDatos
                        ? {
                            content:
                                formatearNumero(
                                    detalle.totalMetrosTalla,
                                    1
                                ),
                            styles: {
                                textColor: COLORES.primario
                            }
                        }
                        : {
                            content: '-',
                            styles: {
                                textColor: COLORES.grisTexto
                            }
                        }
                );
            });

            /*
              Totales correspondientes únicamente al molinete de esta fila.
            */
            fila.push(
                {
                    content:
                        formatearNumero(
                            molinete.totalMetros,
                            1
                        ),
                    styles: {
                        fontStyle: 'bold',
                        textColor: COLORES.primario
                    }
                },
                {
                    content:
                        formatearNumero(
                            molinete.tiempoGiro,
                            1
                        ),
                    styles: {
                        fillColor: COLORES.rosadoSuave,
                        textColor: COLORES.rosado,
                        fontStyle: 'bold'
                    }
                },
                {
                    content:
                        formatearNumero(
                            molinete.totalRollos,
                            1
                        ),
                    styles: {
                        fontStyle: 'bold',
                        textColor: COLORES.primario
                    }
                }
            );

            return fila;

        });

    /* =========================================================
       FILA TOTAL
       ========================================================= */

    const filaTotales = [
        {
            content: 'CANT. ROLLOS',
            styles: {
                fontStyle: 'bold',
                textColor: COLORES.primario
            }
        },
        ''
    ];

    /*
      En cada talla únicamente se muestra el total correspondiente a la subcolumna Rollos.
    */
    tallasUsadas.forEach((talla) => {
        filaTotales.push(
            {
                content:
                    formatearNumero(
                        totalRollosPorTalla[
                            talla.codigo
                        ],
                        1
                    ),
                styles: {
                    fontStyle: 'bold',
                    textColor: COLORES.rosado
                }
            },
            ''
        );
    });

    /*
      Las columnas Total Metros y Tiempo no requieren un total general. La última columna muestra la cantidad total de rollos de la orden.
    */
    filaTotales.push(
        '',
        '',
        {
            content:
                formatearNumero(
                    totalRollosOrden,
                    1
                ),
            styles: {
                fontStyle: 'bold',
                textColor: COLORES.rosado
            }
        }
    );
    body.push(
        filaTotales
    );

    /* =========================================================
       TAMAÑO DINÁMICO
       ========================================================= */
    /*
      Reduce ligeramente el tamaño cuando existen muchas tallas para intentar mantener el reporte en una sola página.
    */
    let tamanioFuente = 7.2;
    let paddingCelda = 1.5;

    if (tallasUsadas.length >= 6) {
        tamanioFuente = 6.4;
        paddingCelda = 1.2;
    }

    if (tallasUsadas.length >= 9) {
        tamanioFuente = 5.7;
        paddingCelda = 1;
    }

    /* =========================================================
       TABLA
       ========================================================= */
    autoTable(
        pdf,
        {
            startY: 46,
            head: [encabezadoSuperior, encabezadoDetalle], body,
            theme: 'grid',
            styles: {
                font:'helvetica',
                fontSize: tamanioFuente,
                cellPadding: paddingCelda,
                halign: 'center',
                valign: 'middle',
                textColor: COLORES.grisTexto,
                lineColor: COLORES.borde,
                lineWidth: .15
            },
            headStyles: {
                fillColor: COLORES.primario,
                textColor: COLORES.blanco,
                fontStyle: 'bold',
                lineColor: COLORES.blanco,
                lineWidth: .15
            },
            alternateRowStyles: {
                fillColor: COLORES.grisClaro
            },
            columnStyles: {
                0: {
                    halign: 'left',
                    cellWidth: 34
                },
                1: {
                    cellWidth: 14
                }
            },
            /*
              Resalta uniformemente la fila final de totales.
            */
            didParseCell(data) {
                if (
                    data.section === 'body' && data.row.index === body.length - 1
                ) {
                    data.cell.styles.fillColor = COLORES.grisClaro;
                    data.cell.styles.lineWidth = .25;
                }
            },
            margin: {
                left: 7,
                right: 7
            }
        }
    );

    /* =========================================================
       PIE DEL REPORTE
       ========================================================= */

    const finalY = pdf.lastAutoTable?.finalY || 40;

    pdf.setFont(
        'helvetica',
        'normal'
    );
    pdf.setFontSize(7);
    pdf.setTextColor(
        ...COLORES.grisTexto
    );
    pdf.text(
        `Orden generada el ${orden.fechaGeneracion ? new Date(orden.fechaGeneracion).toLocaleString('es-CO'): '-'}`,
        10,
        finalY + 7
    );

    /* =========================================================
       ABRIR PDF
       ========================================================= */

    const urlPdf =
        pdf.output(
            'bloburl'
        );

    window.open(
        urlPdf,
        '_blank'
    );
/*
    const numeroOrden =
        String(
            orden.codigoOrden
        ).padStart(
            4,
            '0'
        );

    pdf.save(
        `Orden_Trabajo_${numeroOrden}.pdf`
    );*/
}

/*
  Da formato numérico a los valores mostrados en el reporte.
*/
function formatearNumero(
    valor,
    decimales = 1
) {
    return Number( valor || 0 ).toLocaleString('es-CO',
        {
            minimumFractionDigits: decimales,
            maximumFractionDigits: decimales
        }
    );
}