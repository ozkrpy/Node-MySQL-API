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
            alimentos: '/alimentos',
            alimentoPorId: '/alimentoPorId/{busqueda}',
            alimentosBusqueda: '/alimentosPorDescripcion/{busqueda}',
            alimentoActualizar: '/alimentoActualizar/',
            alimentoAgregar:'/alimentoAgregar',
            alimentoEliminar:'/alimentoEliminar',
            dietasReferencia: '/dietasReferencia',

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
            alimentos: `SELECT a.codigo_alimento, a.descripcion_alimento, b.descripcion_tipo_alimento, a.medida_casera, a.medida_casera_unidad, a.medida_real, a.medida_real_unidad, a.hidratos_carbono, a.unidad_medida_hidratos_carbono, a.proteina, a.unidad_medida_proteina, a.grasa, a.unidad_medida_grasa, a.sodio, a.unidad_medida_sodio, a.potasio, a.unidad_medida_potasio, a.fosforo, a.unidad_medida_fosforo, a.calcio, a.unidad_medida_calcio, a.hierro, a.unidad_medida_hierro, a.colesterol, a.unidad_medida_colesterol, a.purinas, a.unidad_medida_purinas, a.fibra, a.unidad_medida_fibra, a.agua, a.unidad_medida_agua, a.calorias 
                        FROM nutriciondb.alimentos a, nutriciondb.tipo_alimento b 
                        WHERE a.tipo_alimento = b.codigo_tipo_alimento
                        ORDER BY a.codigo_alimento`,
            alimentoPorId: `SELECT a.codigo_alimento, a.descripcion_alimento, a.tipo_alimento, b.descripcion_tipo_alimento, a.medida_casera, a.medida_casera_unidad, a.medida_real, a.medida_real_unidad, a.hidratos_carbono, a.unidad_medida_hidratos_carbono, a.proteina, a.unidad_medida_proteina, a.grasa, a.unidad_medida_grasa, a.sodio, a.unidad_medida_sodio, a.potasio, a.unidad_medida_potasio, a.fosforo, a.unidad_medida_fosforo, a.calcio, a.unidad_medida_calcio, a.hierro, a.unidad_medida_hierro, a.colesterol, a.unidad_medida_colesterol, a.purinas, a.unidad_medida_purinas, a.fibra, a.unidad_medida_fibra, a.agua, a.unidad_medida_agua, a.calorias 
                            FROM alimentos a, tipo_alimento b 
                            WHERE a.tipo_alimento = b.codigo_tipo_alimento 
                            AND a.codigo_alimento = ?`,
            alimentosBusqueda: `SELECT * FROM alimentos WHERE descripcion_alimento LIKE ?`,
            alimentoActualizar: `UPDATE alimentos 
                                 SET descripcion_alimento = ?, tipo_alimento = ?, medida_casera = ?, medida_real = ?,
                                     hidratos_carbono = ?, proteina = ?, grasa = ?, sodio = ?, potasio = ?, fosforo = ?, 
                                     calcio = ?, hierro = ?, colesterol = ?, purinas = ?, fibra = ?, agua = ?, calorias = ?
                                 WHERE codigo_alimento = ?`, 
            alimentoAgregar: `INSERT INTO alimentos (codigo_alimento,descripcion_alimento,tipo_alimento,medida_casera,medida_casera_unidad,medida_real,medida_real_unidad,hidratos_carbono,unidad_medida_hidratos_carbono,proteina,unidad_medida_proteina,grasa,unidad_medida_grasa,sodio,unidad_medida_sodio,potasio,unidad_medida_potasio,fosforo,unidad_medida_fosforo,calcio,unidad_medida_calcio,hierro,unidad_medida_hierro,colesterol,unidad_medida_colesterol,purinas,unidad_medida_purinas,fibra,unidad_medida_fibra,agua,unidad_medida_agua,calorias)
                              VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            alimentoEliminar:'DELETE FROM alimentos WHERE codigo_alimento = ?',
            dietasReferencia: `SELECT a.codigo_referencia_x_dieta, a.codigo_dieta, a.hidratos_carbono, a.proteinas, a.grasas, a.fibras, a.codigo_paciente, b.nombre, b.apellido, a.fecha_creacion, a.fecha_ultima_modificacion 
                               FROM referencia_x_dieta a, paciente b
                               WHERE a.codigo_paciente = b.codigo_paciente
                               ORDER BY a.codigo_dieta`
        }
    }
};