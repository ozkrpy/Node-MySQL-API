module.exports = {
    server: {
        host: 'localhost',
        port: '9092',
        typeGET: 'GET',
        typePOST: 'POST',
        typePUT: 'PUT',
        typeDELETE: 'DELETE',
        methods: {
            helloWorld: '/helloworld',
            usuarios: '/users',
            usuariosPorUsuario: '/usersByUsuario/{usuario}',
            usuariosValidacion: '/validate',
            usuariosActualizaClave: '/updatePassword',
            usuariosCrear: '/insertUsuario',
            usuariosCrearSinValidacion: '/insertUsuarioNoValidated',
            pacientes: '/pacientes',
            pacientePorId: '/pacientePorId/{busqueda}',
            pacienteEditarInfo: '/pacienteEditarInfo',
            pacienteEditarPeso: '/pacienteEditarPeso',
            pacienteEditarTalla: '/pacienteEditarTalla',
            pacienteEditarAntecedentes: '/pacienteEditarAnteced',
            pacienteEditarLaboratorio: '/pacienteEditarLab',
            pacientePesoIdeal: '/pacientePesoIdeal',
            pacienteAlta: '/pacienteAgregar',
            pacienteEliminar: '/pacienteEliminar',
            alimentosBusqueda: '/alimentosPorDescripcion/{busqueda}',
            dietasCodigo: '/dietas',
            dietasPorId: '/dietas/{codigoDieta}',

        }
    },
    database: {
        host: 'localhost',
        user: 'tester',
        pass: '123456789',
        name: 'nutriciondb',
        querying: {
            usuarios: 'SELECT usuario, palabra_clave, email FROM usuarios',
            usuariosPorUsuario: 'SELECT usuario, palabra_clave, email FROM usuarios WHERE usuario = ?',
            usuariosActualizaClave: 'UPDATE usuarios SET palabra_clave = ? WHERE usuario = ?',
            usuariosCrear: 'INSERT INTO usuarios(usuario, palabra_clave, email) VALUES (?, ?, ?)',
            pacientes: 'SELECT * FROM paciente ORDER BY apellido',
            pacientePorId: 'SELECT * FROM paciente WHERE codigo_paciente = ?',
            pacienteEditarInfo: `UPDATE paciente SET sexo = ?, estado_civil = ?, fecha_nacimiento = ? WHERE codigo_paciente = ?`,
            pacienteEditarPeso: 'UPDATE paciente SET peso_actual = ?, peso_habitual = ? WHERE codigo_paciente = ?',
            pacienteEditarTalla: 'UPDATE paciente SET talla = ?, cia_muneca = ?, cia_brazo = ?, cia_cintura1 = ?, cia_cintura2 = ? WHERE codigo_paciente = ?',
            pacienteEditarAntecedentes: 'UPDATE paciente SET antecedente_obesidad = ?, antecedente_cardiopatias = ?, antecedente_hta = ?, antecedente_diabetes = ?, medicacion = ?, diagnostico_medico = ?, diagnostico_nutricional = ? WHERE codigo_paciente = ?',
            pacienteEditarLaboratorio: 'UPDATE paciente SET laboratorio_glicemia_basal = ?, laboratorio_creatinina = ?, laboratorio_proteinas_totales = ?, laboratorio_urea = ?, laboratorio_acido_urico = ?, laboratorio_proteinuria = ?, laboratorio_albumina = ?, laboratorio_triglicerios = ?, laboratorio_ldl = ?, laboratorio_hdl = ?, laboratorio_colesterol_total = ?, laboratorio_glucosa = ?, laboratorio_hb = ?, laboratorio_hematocrito = ?, laboratorio_globulos_rojos = ?, laboratorio_globulos_blancos = ?, laboratorio_potasio = ?, laboratorio_ci = ?, laboratorio_na = ?, laboratorio_hba = ? WHERE codigo_paciente = ?',
            pacientePesoIdeal: `SELECT p.edad17_19, p.edad20_24, ((p.contextura_pequena_ini+p.contextura_pequena_fin)/2) AS pequena, ((p.contextura_mediana_ini+p.contextura_mediana_fin)/2) AS mediana, ((p.contextura_grande_ini+p.contextura_grande_fin)/2) AS grande
                                FROM peso_ideal p 
                                WHERE p.talla_cm = ?
                                AND p.sexo = ?;`,
            pacienteAlta: `INSERT INTO paciente (codigo_paciente,nombre,apellido,sexo,talla,estado_civil,fecha_nacimiento,peso_actual,peso_habitual,peso_ajusta,peso_saludable,porcentaje_peso_ideal,imc,cia_muneca,cia_brazo,biotipo,antecedente_obesidad,antecedente_cardiopatias,antecedente_hta,antecedente_diabetes,medicacion,diagnostico_medico,diagnostico_nutricional,laboratorio_glicemia_basal,laboratorio_creatinina,laboratorio_proteinas_totales,laboratorio_urea,laboratorio_acido_urico,laboratorio_proteinuria,laboratorio_albumina,laboratorio_triglicerios,laboratorio_colesterol_total,laboratorio_ldl,laboratorio_hdl,laboratorio_glucosa,laboratorio_hb,laboratorio_hematocrito,laboratorio_globulos_rojos,laboratorio_potasio,laboratorio_ci,laboratorio_na,laboratorio_globulos_blancos,laboratorio_hba,cia_cintura1,cia_cintura2)
                           VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
            pacienteEliminar: 'DELETE FROM paciente WHERE codigo_paciente = ?',
            alimentosBusqueda: `SELECT * FROM alimentos WHERE descripcion_alimento LIKE ?`,
            dietasCodigo: 'SELECT DISTINCT (d.codigo_dieta) FROM dieta d ORDER BY 1',
            dietasPorId: `SELECT d.*, a.*, p.* 
                          FROM dieta d, alimentos a, paciente p 
                          WHERE d.codigo_alimento = a.codigo_alimento 
                          AND d.codigo_paciente = p.codigo_paciente 
                          AND codigo_dieta = ?`
        }
    }
};