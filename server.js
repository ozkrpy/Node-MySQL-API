'use strict';
const Hapi = require('hapi');
const MySQL = require('mysql');
const Joi = require('joi');
const Bcrypt = require('bcrypt');
var data = require('./data');

/*
    Author: ozkrpy
    Date: 08/01/2017
    Last modification: 21/12/2017 16:48    
*/
//CORS for IP
const IP = [
    '*'
];

//SERVER INSTATIATION
const server = new Hapi.Server();
server.connection({
    host: data.server.host,
    port: data.server.port,
    routes: { cors: true }
});
server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('Servidor ejecutandose en:', server.info.uri);
    console.log('IP for CORS:', IP);
});

// DATABASE INSTATIATION
const connection = MySQL.createConnection({
    host: data.database.host,
    user: data.database.user,
    password: data.database.pass,
    database: data.database.name
});
connection.connect();

//SERVICES
//metodo dummy para pruebas
server.route({
    method: data.server.typeGET,
    path: data.server.methods.helloWorld,
    handler: function (request, reply) {
        console.log(data.server.methods.helloWorld, "metodohola mundo");
        return reply({ "id": 1, "message": "OK a holaMundo" });
    }
});
//metodo para recuperar todos los pacientes
server.route({
    method: data.server.typeGET,
    path: data.server.methods.pacientes,
    handler: function (request, reply) {
        connection.query(data.database.querying.pacientes,
            function (error, results, fields) {
                if (error) throw error;
                console.log(data.server.methods.pacientes, "solicito toda la lista de pacientes");
                reply(results);
            }
        );
    },
    //configuracion que permite la llamada dentro del mismo servidor para el error 
    config: {
        cors: {
            origin: IP,
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
});
//metodo para recuperar un paciente especifico
server.route({
    method: data.server.typeGET,
    path: data.server.methods.pacientePorId,
    handler: function (request, reply) {
        connection.query(data.database.querying.pacientePorId,
            [request.params.busqueda],
            function (error, results, fields) {
                if (error) throw error;
                console.log(data.server.methods.pacientePorId, "solicito datos paciente por Id:", request.params.busqueda);
                reply(results);
            }
        );
    },
    config: {
        validate: {
            params: {//params
                busqueda: Joi.number().integer()
            }
        },
        cors: {
            origin: IP,
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
});
//metodo para recuperar un paciente especifico
server.route({
    method: data.server.typeGET,
    path: data.server.methods.pacienteHistorial,
    handler: function (request, reply) {
        connection.query(data.database.querying.pacienteHistorial,
            [request.params.busqueda],
            function (error, results, fields) {
                if (error) throw error;
                console.log(data.server.methods.pacienteHistorial, "solicito historial paciente por Id:", request.params.busqueda);
                reply(results);
            }
        );
    },
    config: {
        validate: {
            params: {//params
                busqueda: Joi.number().integer()
            }
        },
        cors: {
            origin: IP,
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
});
//metodo que se encarga de recuperar los alimentos segun un texto criterio
server.route({
    method: data.server.typeGET,
    path: data.server.methods.alimentosBusqueda,
    handler: function (request, reply) {
        connection.query(data.database.querying.alimentosBusqueda,
            ['%' + request.params.busqueda + '%'],
            function (error, results, fields) {
                if (error) throw error;
                console.log(data.server.alimentosBusqueda, "solicito alimento por ref.:", request.params.busqueda);
                reply(results);
            }
        );
    },
    //configuracion que permite la llamada dentro del mismo servidor para el error 
    config: {
        cors: {
            origin: IP,
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
});
// metodo POST actualizar info del paciente
server.route({
    method: data.server.typePOST,
    path: data.server.methods.pacienteEditarInfo,
    handler: function (request, reply) {
        console.log("entro al POST de", data.server.methods.pacienteEditarInfo);
        connection.query(data.database.querying.pacienteEditarInfo,
            [request.payload.sexo,
            request.payload.estadoCivil,
            request.payload.fechaNacimiento,
            request.payload.codigoPaciente],
            function (error, results, fields) {
                console.log(request.payload);
                if (error) {
                    console.log('[ERROR]', data.server.methods.pacienteEditarInfo, error.message);
                    throw error.message;
                } else {
                    // console.log(results);
                    reply(results);
                }
            }
        );
    },
    //configuracion que permite la llamada dentro del mismo servidor para el error 
    config: {
        cors: {
            origin: IP,
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
});
// metodo POST actualizar informacion de peso del paciente
server.route({
    method: data.server.typePOST,
    path: data.server.methods.pacienteEditarPeso,
    handler: function (request, reply) {
        console.log("entro al POST de", data.server.methods.pacienteEditarPeso);
        connection.query(data.database.querying.pacienteEditarPeso,
            [request.payload.nuevoActual,
            request.payload.nuevoHabitual,
            request.payload.codigoPaciente],
            function (error, results, fields) {
                console.log(request.payload);
                if (error) {
                    console.log('[ERROR]', data.server.methods.pacienteEditarPeso, error.message);
                    throw error.message;
                } else {
                    // console.log(results);
                    reply(results);
                }
            }
        );
    },
    //configuracion que permite la llamada dentro del mismo servidor para el error 
    config: {
        cors: {
            origin: IP,
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
});
// metodo POST actualizar informacion de talla del paciente
server.route({
    method: data.server.typePOST,
    path: data.server.methods.pacienteEditarTalla,
    handler: function (request, reply) {
        console.log("entro al POST de", data.server.methods.pacienteEditarTalla);
        connection.query(data.database.querying.pacienteEditarTalla,
            [request.payload.talla,
            request.payload.muneca,
            request.payload.brazo,
            request.payload.cintura1,
            request.payload.cintura2,
            request.payload.codigoPaciente],
            function (error, results, fields) {
                console.log(request.payload);
                if (error) {
                    console.log('[ERROR]', data.server.methods.pacienteEditartalla, error.message);
                    throw error.message;
                } else {
                    // console.log(results);
                    reply(results);
                }
            }
        );
    },
    //configuracion que permite la llamada dentro del mismo servidor para el error 
    config: {
        cors: {
            origin: IP,
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
});
// metodo POST actualizar informacion de antecedentes del paciente
server.route({
    method: data.server.typePOST,
    path: data.server.methods.pacienteEditarAntecedentes,
    handler: function (request, reply) {
        console.log("entro al POST de", data.server.methods.pacienteEditarAntecedentes);
        connection.query(data.database.querying.pacienteEditarAntecedentes,
            [request.payload.obesidad,
            request.payload.cardiopatias,
            request.payload.hta,
            request.payload.diabetes,
            request.payload.medicacion,
            request.payload.medico,
            request.payload.nutricionista,
            request.payload.codigoPaciente],
            function (error, results, fields) {
                console.log(request.payload);
                if (error) {
                    console.log('[ERROR]', data.server.methods.pacienteEditartalla, error.message);
                    throw error.message;
                } else {
                    // console.log(results);
                    reply(results);
                }
            }
        );
    },
    //configuracion que permite la llamada dentro del mismo servidor para el error 
    config: {
        cors: {
            origin: IP,
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
});
// metodo POST actualizar informacion de laboratorio del paciente
server.route({
    method: data.server.typePOST,
    path: data.server.methods.pacienteEditarLaboratorio,
    handler: function (request, reply) {
        console.log("entro al POST de", data.server.methods.pacienteEditarLaboratorio);
        connection.query(data.database.querying.pacienteEditarLaboratorio,
            [request.payload.glicemia,
            request.payload.creatinina,
            request.payload.proteinasTotales,
            request.payload.urea,
            request.payload.acidoUrico,
            request.payload.proteinura,
            request.payload.albumina,
            request.payload.trigliceridos,
            request.payload.ldl,
            request.payload.hdl,
            request.payload.colesterolTotal,
            request.payload.glucosa,
            request.payload.hb,
            request.payload.hematocrito,
            request.payload.globulosRojos,
            request.payload.globulosBlancos,
            request.payload.potasio,
            request.payload.ci,
            request.payload.sodio,
            request.payload.hba,
            request.payload.codigoPaciente],
            function (error, results, fields) {
                if (error) {
                    console.log('[ERROR]', data.server.methods.pacienteEditarLaboratorio, error.message);
                    throw error.message;
                } else {
                    // console.log(results);
                    reply(results);
                }
            }
        );
    },
    //configuracion que permite la llamada dentro del mismo servidor para el error 
    config: {
        cors: {
            origin: IP,
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
});
//metodo POST para recuperar pesos ideales segun talla y sexo
server.route({
    method: data.server.typePOST,
    path: data.server.methods.pacientePesoIdeal,
    handler: function (request, reply) {
        connection.query(data.database.querying.pacientePesoIdeal,
            [request.payload.talla,
            request.payload.sexo],
            function (error, results, fields) {
                if (error) throw error;
                console.log(data.server.methods.pacientePesoIdeal, "solicito pesos ideales segun parametros: ", request.payload.talla, request.payload.sexo, "resultado: ", results);
                reply(results);
            }
        );
    },
    config: {
        validate: {
            params: {//params
                talla: Joi.number().integer()
            }
        },
        cors: {
            origin: IP,
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
});
//metodo PUT para insertar un nuevo registro de paciente
server.route({
    method: data.server.typePUT,
    path: data.server.methods.pacienteAlta,
    handler: function (request, reply) {
        connection.query(data.database.querying.pacienteAlta,
            [request.payload.codigoParam,
            request.payload.nombreParam,
            request.payload.apellidoParam,
            request.payload.sexoParam,
            request.payload.tallaParam,
            request.payload.civilParam,
            request.payload.nacimientoParam,
            request.payload.actualParam,
            request.payload.habitualParam,
            request.payload.pesoAjustadoParam,
            request.payload.pesoSaludableParam,
            request.payload.porcentajePesoIdealParam,
            request.payload.imcParam,
            request.payload.munecaParam,
            request.payload.brazoParam,
            request.payload.biotipoParam,
            request.payload.obesidadParam,
            request.payload.cardiopatiasParam,
            request.payload.htaParam,
            request.payload.diabetesParam,
            request.payload.medicacionParam,
            request.payload.medicoParam,
            request.payload.nutricionistaParam,
            request.payload.glicemiaBasalParam,
            request.payload.creatininaParam,
            request.payload.proteinasTotalesParam,
            request.payload.ureaParam,
            request.payload.acidoUricoParam,
            request.payload.proteinuraParam,
            request.payload.albuminaParam,
            request.payload.trigliceridosParam,
            request.payload.ldlParam,
            request.payload.hdlParam,
            request.payload.colesterolTotalParam,
            request.payload.glucosaParam,
            request.payload.hbParam,
            request.payload.hematocritoParam,
            request.payload.globulosRojosParam,
            request.payload.globulosBlancosParam,
            request.payload.potasioParam,
            request.payload.ciParam,
            request.payload.sodioParam,
            request.payload.hbaParam,
            request.payload.cintura1Param,
            request.payload.cintura2Param],
            function (error, results, fields) {
                console.log(data.server.methods.pacienteAlta, "insercion de un nuevo paciente", request.payload, "resultado: ", results);
                if (error) throw error;
                reply(results);
            }
        );
    },
    config: {
        cors: {
            origin: IP,
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
});
//metodo DELETE para borrar registro de un paciente
server.route({
    method: data.server.typePOST,
    path: data.server.methods.pacienteEliminar,
    handler: function (request, reply) {
        connection.query(data.database.querying.pacienteEliminar,
            [request.payload.codigoParam],
            function (error, results, fields) {
                console.log(data.server.methods.pacienteEliminar, "eliminar paciente", request.payload.codigoParam, "resultado: ", results);
                if (error) {
                    console.log(error);
                    reply(error);
                } else {
                    reply(results);
                }
            }
        );
    },
    config: {
        cors: {
            origin: IP,
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
});
//metodo para recuperar todos los alimentos
server.route({
    method: data.server.typeGET,
    path: data.server.methods.alimentos,
    handler: function (request, reply) {
        connection.query(data.database.querying.alimentos,
            function (error, results, fields) {
                if (error) throw error;
                console.log(data.server.methods.alimentos, "solicito toda la lista de alimentos");
                reply(results);
            }
        );
    },
    //configuracion que permite la llamada dentro del mismo servidor para el error 
    config: {
        cors: {
            origin: IP,
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
});
//metodo para recuperar un alimento especifico
server.route({
    method: data.server.typeGET,
    path: data.server.methods.alimentoPorId,
    handler: function (request, reply) {
        connection.query(data.database.querying.alimentoPorId,
            [request.params.busqueda],
            function (error, results, fields) {
                if (error) throw error;
                console.log(data.server.methods.alimentoPorId, "solicito datos alimento por Id:", request.params.busqueda);
                reply(results);
            }
        );
    },
    config: {
        validate: {
            params: {//params
                busqueda: Joi.number().integer()
            }
        },
        cors: {
            origin: IP,
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
});
// metodo POST actualizar informacion de un alimento
server.route({
    method: data.server.typePOST,
    path: data.server.methods.alimentoActualizar,
    handler: function (request, reply) {
        console.log("entro al POST de", data.server.methods.alimentoActualizar);
        connection.query(data.database.querying.alimentoActualizar,
               [request.payload.descripcion,
                request.payload.tipo,
                request.payload.medidaCasera,
                request.payload.medidaReal,
                request.payload.hidratosCarbono,
                request.payload.proteinas,
                request.payload.grasas,
                request.payload.sodio,
                request.payload.potasio,
                request.payload.fosforo,
                request.payload.calcio,
                request.payload.hierro,
                request.payload.colesterol,
                request.payload.purinas,
                request.payload.fibras,
                request.payload.agua,
                request.payload.calorias,
                request.payload.codigoAlimento],
            function (error, results, fields) {
                if (error) {
                    console.log('[ERROR]', data.server.methods.alimentoActualizar, error.message);
                    throw error.message;
                } else {
                    reply(results);
                }
            }
        );
    },
    //configuracion que permite la llamada dentro del mismo servidor para el error 
    config: {
        cors: {
            origin: IP,
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
});
//metodo PUT para insertar un nuevo alimento
server.route({
    method: data.server.typePUT,
    path: data.server.methods.alimentoAgregar,
    handler: function (request, reply) {
        connection.query(data.database.querying.alimentoAgregar,
            [request.payload.codigoParam,
             request.payload.descripcionParam,
             request.payload.tipoParam,
             request.payload.caseraParam,
             request.payload.caseraMedidaParam,
             request.payload.realParam,
             request.payload.realMedidaParam,
             request.payload.hidratosParam,
             request.payload.hidratosMedidaParam,
             request.payload.proteinaParam,
             request.payload.proteinaMedidaParam,
             request.payload.grasaParam,
             request.payload.grasaMedidaParam,
             request.payload.sodioParam,
             request.payload.sodioMedidaParam,
             request.payload.potasioParam,
             request.payload.potasioMedidaParam,
             request.payload.fosforoParam,
             request.payload.fosforoMedidaParam,
             request.payload.calcioParam,
             request.payload.calcioMedidaParam,
             request.payload.hierroParam,
             request.payload.hierroMedidaParam,
             request.payload.colesterolParam,
             request.payload.colesterolMedidaParam,
             request.payload.purinaParam,
             request.payload.purinasMedidaParam,
             request.payload.fibraParam,
             request.payload.fibraMedidaParam,
             request.payload.aguaParam,
             request.payload.aguaMedidaParam,
             request.payload.caloriasParam],
            function (error, results, fields) {
                console.log(data.server.methods.alimentoAgregar, "insercion de un nuevo alimento", request.payload, "resultado: ", results);
                if (error) throw error;
                reply(results);
            }
        );
    },
    config: {
        cors: {
            origin: IP,
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
});
//metodo DELETE para borrar registro de un alimento
server.route({
    method: data.server.typePOST,
    path: data.server.methods.alimentoEliminar,
    handler: function (request, reply) {
        connection.query(data.database.querying.alimentoEliminar,
            [request.payload.codigoParam],
            function (error, results, fields) {
                console.log(data.server.methods.alimentoEliminar, "eliminar alimento", request.payload.codigoParam, "resultado: ", results);
                if (error) {
                    console.log(error);
                    reply(error);
                } else {
                    reply(results);
                }
            }
        );
    },
    config: {
        cors: {
            origin: IP,
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
});
//metodo para recuperar todas las referencias de dietas
server.route({
    method: data.server.typeGET,
    path: data.server.methods.dietasReferencia,
    handler: function (request, reply) {
        connection.query(data.database.querying.dietasReferencia,
            function (error, results, fields) {
                if (error) throw error;
                console.log(data.server.methods.dietasReferencia, "solicito listado de dietas");
                reply(results);
            }
        );
    },
    //configuracion que permite la llamada dentro del mismo servidor para el error 
    config: {
        cors: {
            origin: IP,
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
});
//metodo para recuperar una referencia de dieta especifica
server.route({
    method: data.server.typeGET,
    path: data.server.methods.dietasReferenciaPorId,
    handler: function (request, reply) {
        connection.query(data.database.querying.dietasReferenciaPorId,
            [request.params.busqueda],
            function (error, results, fields) {
                if (error) throw error;
                console.log(data.server.methods.dietasReferenciaPorId, "solicito referencia de dieta por Id:", request.params.busqueda);
                reply(results);
            }
        );
    },
    config: {
        validate: {
            params: {//params
                busqueda: Joi.number().integer()
            }
        },
        cors: {
            origin: IP,
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
});
//metodo para recuperar alimentos de una dieta especifica
server.route({
    method: data.server.typeGET,
    path: data.server.methods.dietasAlimentosPorId,
    handler: function (request, reply) {
        connection.query(data.database.querying.dietasAlimentosPorId,
            [request.params.busqueda],
            function (error, results, fields) {
                if (error) throw error;
                console.log(data.server.methods.dietasAlimentosPorId, "solicito alimentos de dieta por Id:", request.params.busqueda);
                reply(results);
            }
        );
    },
    config: {
        validate: {
            params: {//params
                busqueda: Joi.number().integer()
            }
        },
        cors: {
            origin: IP,
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
});
//metodo PUT para insertar un nuevo alimento a una dieta especifica
server.route({
    method: data.server.typePUT,
    path: data.server.methods.dietasInsertarAlimento,
    handler: function (request, reply) {
        connection.query(data.database.querying.dietasInsertarAlimento,
            [request.payload.codigoDieta,
             request.payload.codigoAlimento,
             request.payload.cantidad],
            function (error, results, fields) {
                console.log(data.server.methods.dietasInsertarAlimento, "insercion de un nuevo alimento a la dieta", request.payload, "resultado: ", results);
                if (error) throw error;
                reply(results);
            }
        );
    },
    config: {
        cors: {
            origin: IP,
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
});
// metodo POST actualizar referencias de dieta
server.route({
    method: data.server.typePOST,
    path: data.server.methods.dietasActualizarReferencias,
    handler: function (request, reply) {
        console.log("entro al POST de", data.server.methods.dietasActualizarReferencias);
        connection.query(data.database.querying.dietasActualizarReferencias,
            [request.payload.hidratos,
             request.payload.proteinas,
             request.payload.grasas,
             request.payload.fibras,
             request.payload.codigoDieta],
            function (error, results, fields) {
                if (error) {
                    console.log('[ERROR]', data.server.methods.dietasActualizarReferencias, error.message);
                    throw error.message;
                } else {
                    // console.log(results);
                    reply(results);
                }
            }
        );
    },
    //configuracion que permite la llamada dentro del mismo servidor para el error 
    config: {
        cors: {
            origin: IP,
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
});
//metodo DELETE para borrar registro de un alimento
server.route({
    method: data.server.typePOST,
    path: data.server.methods.dietasEliminarAlimento,
    handler: function (request, reply) {
        connection.query(data.database.querying.dietasEliminarAlimento,
            [request.payload.codigoDietaParam,
             request.payload.itemParam],
            function (error, results, fields) {
                console.log(data.server.methods.dietasEliminarAlimento, "eliminar alimento de la dieta", request.payload.codigoDietaParam, "resultado: ", results);
                if (error) {
                    console.log(error);
                    reply(error);
                } else {
                    reply(results);
                }
            }
        );
    },
    config: {
        cors: {
            origin: IP,
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
});
//metodo DELETE para borrar una dieta completamente
server.route({
    method: data.server.typePOST,
    path: data.server.methods.dietasEliminar,
    handler: function (request, reply) {
        connection.query(data.database.querying.dietasEliminar,
            [request.payload.codigoDietaParam],
            function (error, results, fields) {
                console.log(data.server.methods.dietasEliminar, "eliminar la dieta", request.payload.codigoDietaParam, "resultado: ", results);
                if (error) {
                    console.log(error);
                    reply(error);
                } else {
                    reply(results);
                }
            }
        );
    },
    config: {
        cors: {
            origin: IP,
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
});
//metodo PUT para insertar un nuevo alimento
server.route({
    method: data.server.typePUT,
    path: data.server.methods.dietasAgregar,
    handler: function (request, reply) {
        connection.query(data.database.querying.dietasAgregar,
            [request.payload.codigoDietaParam,
             request.payload.hidratosParam,
             request.payload.proteinasParam,
             request.payload.grasasParam,
             request.payload.fibrasParam,
             request.payload.pacienteParam],
            function (error, results, fields) {
                console.log(data.server.methods.dietasAgregar, "insercion de un nueva dieta", request.payload, "resultado: ", results);
                if (error) throw error;
                reply(results);
            }
        );
    },
    config: {
        cors: {
            origin: IP,
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
});
//metodo para recuperar la secuencia de la ultima dieta
server.route({
    method: data.server.typeGET,
    path: data.server.methods.dietasSecuencia,
    handler: function (request, reply) {
        connection.query(data.database.querying.dietasSecuencia,
            function (error, results, fields) {
                if (error) throw error;
                console.log(data.server.methods.dietasSecuencia, "dietas numero MAX", results);
                reply(results);
            }
        );
    },
    //configuracion que permite la llamada dentro del mismo servidor para el error 
    config: {
        cors: {
            origin: IP,
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
});
// metodo POST actualizar cantidad de alimento de dieta
server.route({
    method: data.server.typePOST,
    path: data.server.methods.dietasEditarCantidad,
    handler: function (request, reply) {
        console.log("entro al POST de", data.server.methods.dietasEditarCantidad);
        connection.query(data.database.querying.dietasEditarCantidad,
            [request.payload.cantidad,
             request.payload.codigoDieta,
             request.payload.item],
            function (error, results, fields) {
                if (error) {
                    console.log('[ERROR]', data.server.methods.dietasEditarCantidad, error.message);
                    throw error.message;
                } else {
                    // console.log(results);
                    reply(results);
                }
            }
        );
    },
    //configuracion que permite la llamada dentro del mismo servidor para el error 
    config: {
        cors: {
            origin: IP,
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
});



/*
    //metodo que recupera todos los usuarios
    server.route({
        method: data.server.typeGET,
        path: data.server.methods.usuarios,
        handler: function (request, reply) {
            connection.query(data.database.querying.usuarios,
                function (error, results, fields) {
                    if (error) throw error;
                    console.log(data.server.methods.usuarios, "solicito usuarios");
                    reply(results);
                }
            );
        },
        config: {
            validate: {
                params: {//params
                    uid: Joi.number().integer()
                }
            }
        }
    });
    //metodo para recuperar informacion de un usuario especifico
    server.route({
        method: data.server.typeGET,
        path: data.server.methods.usuariosPorUsuario,
        handler: function (request, reply) {
            connection.query(data.database.querying.usuariosUserPassByUsuario,
                [request.params.usuarioId],
                function (error, results, fields) {
                    if (error) throw error;
                    console.log(data.server.methods.usuariosPorUsuario, "solicito usuario:", request.params.usuario);
                    reply(results);
                }
            );
        },
        config: {
            validate: {
                params: {//params
                    uid: Joi.number().integer()
                }
            }
        }
    });
    //metodo para actualizar password de un usuario especifico
    server.route({
        method: data.server.typePOST,
        path: data.server.methods.usuariosActualizaClave,
        handler: function (request, reply) {
            connection.query(data.database.querying.usuariosActualizaClave,
                [request.payload.nuevaClave, request.payload.usuarioId],
                function (error, results, fields) {
                    if (error) throw error;
                    reply(results);
                }
            );
        }
    });
    // metodo POST para validar login 
    server.route({
        method: data.server.typePOST,
        path: data.server.methods.usuariosValidacion,
        handler: function (request, reply) {
            var orgPassword = false;
            connection.query(data.database.querying.usuariosPorUsuario,
                [request.payload.usuarioId],
                function (error, results, fields) {
                    if (error) {
                        console.log('[ERROR]', data.server.methods.usuariosValidacion, error.message);
                        throw error;
                    } else {
                        console.log(results);
                        if (typeof results[0] !== 'undefined') {
                            orgPassword = Bcrypt.compareSync(request.payload.password, results[0].palabra_clave);
                        }
                    }
                    reply(orgPassword);
                }
            );
        },
        config: {
            validate: {
                payload: {//payload
                    usuarioId: Joi.string().alphanum().min(3).max(30).required(),
                    password: Joi.string().regex(/^[a-zA-Z0-9]{4,30}$/).required()
                }
            },
            cors: {
                origin: IP,
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        }
    });
    // metodo POST para insertar usuario login: recibe password como texto plano
    server.route({
        method: data.server.typePOST,
        path: data.server.methods.usuariosCrear,
        handler: function (request, reply) {
            //encryption
            var salt = Bcrypt.genSaltSync();
            var encryptedPassword = Bcrypt.hashSync(request.payload.palabraClave, salt);
            connection.query(data.database.querying.usuariosCrear,
                [request.payload.usuarioId,
                    encryptedPassword,
                request.payload.email],
                function (error, results, fields) {
                    if (error) {
                        console.log('[ERROR]', data.server.methods.usuariosCrear, error.message);
                        throw error;
                    } else {
                        console.log(results);
                        reply(results);
                    }
                }
            );
        },
        config: {
            validate: {
                payload: {//payload
                    usuarioId: Joi.string().alphanum().min(3).max(30).required(),
                    email: Joi.string().email(),
                    palabraClave: Joi.string().regex(/^[a-zA-Z0-9]{4,30}$/).required()
                }
            }
        }
    });
    // metodo POST para insertar usuario login: recibe password como texto encriptado
    server.route({
        method: data.server.typePOST,
        path: data.server.methods.usuariosCrearSinValidacion,
        handler: function (request, reply) {
            connection.query(data.database.querying.usuariosCrear,
                [request.payload.usuarioId,
                request.payload.palabraClave,
                request.payload.email],
                function (error, results, fields) {
                    if (error) {
                        console.log('[ERROR]', data.server.methods.usuariosCrearSinValidacion, error.message);
                        throw error.message;
                    } else {
                        console.log(results);
                        reply(results);
                    }
                }
            );
        },
        config: {
            validate: {
                payload: {//payload
                    usuarioId: Joi.string().alphanum().min(3).max(30).required(),
                    email: Joi.string().email(),
                    palabraClave: Joi.string().regex(/^[a-zA-Z0-9]{4,30}$/).required()
                }
            }
        }
    });

*/