const fs = require('fs');
const bcrypt = require('bcryptjs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/usuarios.json');

// Función para leer usuarios
const leerUsuarios = () => {
    if (!fs.existsSync(dataPath)) return [];
    const data = fs.readFileSync(dataPath);
    return JSON.parse(data);
};

// Función para escribir usuarios
const guardarUsuarios = (usuarios) => {
    fs.writeFileSync(dataPath, JSON.stringify(usuarios, null, 2));
};

// Registrar usuario
const registerUser = (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ mensaje: "Faltan datos." });
    }

    //Verificación de los usuarios, para no tener repetidos, no quiero tener ese problemón
    const usuarios = leerUsuarios();
    const usuarioExistente = usuarios.find(u => u.username === username);
    if (usuarioExistente) {
        return res.status(409).json({ mensaje: "Usuario ya existe." });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    usuarios.push({ username, password: hashedPassword });
    guardarUsuarios(usuarios);

    res.status(201).json({ mensaje: "Usuario registrado exitosamente." });
};

// Iniciar sesión
const loginUser = (req, res) => {
    const { username, password } = req.body;
    const usuarios = leerUsuarios();
    const usuario = usuarios.find(u => u.username === username);

    if (!usuario) {
        return res.status(401).json({ mensaje: "Error en la autenticación." });
    }

    const contrasenaValida = bcrypt.compareSync(password, usuario.password);
    if (!contrasenaValida) {
        return res.status(401).json({ mensaje: "Error en la autenticación." });
    }

    res.status(200).json({ mensaje: "Autenticación satisfactoria." });
};

module.exports = {
    registerUser,
    loginUser
};
