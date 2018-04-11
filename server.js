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

//SERVER INSTATIATION
const server = new Hapi.Server();
server.connection({
    host: data.server.host,
    port: data.server.port
});
server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('Servidor ejecutandose en: ', server.info.uri);
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
    }
});
//metodo que recupera los distintos codigos de dietas en la bd, ordenados de menor a mayor
server.route({
    method: data.server.typeGET,
    path: data.server.methods.dietasCodigo,
    handler: function (request, reply) {
        connection.query(data.database.querying.dietasCodigo,
            function (error, results, fields) {
                if (error) throw error;
                console.log(data.database.querying.dietasCodigo, "solicito codigos de dietas");
                reply(results);
            }
        );
    }
});
//metodo que recupera el detalle de una dieta segun su codigo de dieta
server.route({
    method: data.server.typeGET,
    path: data.server.methods.dietasPorId,
    handler: function (request, reply) {
        connection.query(data.database.querying.dietasPorId,
            [request.params.codigoDieta],
            function (error, results, fields) {
                if (error) throw error;
                console.log(data.server.methods.dietasPorId, "solicito detalle de dieta:", request.params.codigoDieta);
                reply(results);
            }
        );
    },
    config: {
        validate: {
            params: {//params
                codigoDieta: Joi.number().integer()
            }
        }
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
            origin: ['http://localhost:4200'],
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
            origin: ['http://localhost:4200'],
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
            origin: ['http://localhost:4200'],
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
            origin: ['http://localhost:4200'],
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
            origin: ['http://localhost:4200'],
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
            origin: ['http://localhost:4200'],
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
            origin: ['http://localhost:4200'],
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
        }
    }
});
