/*=============================================================================
  Nombre responsabilidad: Capturar atributos de la orden de producción

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 27/Octubre/2026

  Descripcion responsabilidad:
  Muestra una ventana modal para registrar los lotes y/o hojas de ruta y las
  máquinas asociadas a la orden de producción antes de guardar la programación.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import { useEffect, useState } from 'react';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

import '../../styles/orpratri-modal.css';


function OrpratriModal({
    open,
    onCerrar,
    onConfirmar
}) {

    const [lote, setLote] = useState('');
    const [maquina, setMaquina] = useState('');


    // Limpia los campos cada vez que se abre una nueva captura.
    useEffect(() => {

        if (open) {
            setLote('');
            setMaquina('');
        }

    }, [open]);


    // Entrega los datos al componente padre cuando ambos campos están diligenciados.
    function confirmar() {

        const loteLimpio = lote.trim();
        const maquinaLimpia = maquina.trim();

        if (!loteLimpio || !maquinaLimpia) {
            return;
        }

        onConfirmar({
            lote: loteLimpio,
            maquina: maquinaLimpia
        });

    }


    const datosCompletos = Boolean(
        lote.trim() &&
        maquina.trim()
    );


    if (!open) {
        return null;
    }


    return (

        <div className="orpratri-overlay">

            <div className="orpratri-modal">

                {/* =================================================
                    CABECERA
                    ================================================= */}

                <div className="orpratri-modal-header">

                    <div className="orpratri-modal-title">

                        <span className="orpratri-modal-overline">
                            Orden de Trabajo
                        </span>

                        <h2>
                            Información adicional
                        </h2>

                        <p>
                            Registre los lotes y/o hojas de ruta y las máquinas asociadas a la orden.
                        </p>

                    </div>

                </div>


                {/* =================================================
                    CAMPOS
                    ================================================= */}

                <div className="orpratri-modal-fields">

                    <div className="orpratri-field">

                        <div className="orpratri-field-title">

                            <AssignmentOutlinedIcon />

                            <label htmlFor="orpratri-lote">
                                Lotes / Hojas de ruta
                            </label>

                        </div>

                        <textarea
                            id="orpratri-lote"
                            value={lote}
                            onChange={(event) => setLote(event.target.value)}
                            maxLength={200}
                            rows={4}
                            autoFocus
                        />

                        <span className="orpratri-field-counter">
                            {lote.length}/200
                        </span>

                    </div>


                    <div className="orpratri-field">

                        <div className="orpratri-field-title">

                            <PrecisionManufacturingOutlinedIcon />

                            <label htmlFor="orpratri-maquina">
                                Máquinas
                            </label>

                        </div>

                        <textarea
                            id="orpratri-maquina"
                            value={maquina}
                            onChange={(event) => setMaquina(event.target.value)}
                            maxLength={200}
                            rows={4}
                        />

                        <span className="orpratri-field-counter">
                            {maquina.length}/200
                        </span>

                    </div>

                </div>


                {/* =================================================
                    ACCIONES
                    ================================================= */}

                <div className="orpratri-modal-actions">

                    <button
                        type="button"
                        className="orpratri-secondary-button"
                        onClick={onCerrar}
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        className="orpratri-primary-button"
                        onClick={confirmar}
                        disabled={!datosCompletos}
                    >
                        <SaveOutlinedIcon />

                        Guardar orden
                    </button>

                </div>

            </div>

        </div>

    );

}

export default OrpratriModal;