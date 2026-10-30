import { Videojuego } from "../models/Videojuego";

export const findGames = async (req, res) => {
    const games = await Videojuego.findAll();
    res.json(games);
};

export const findGame = async (req, res) => {
    const { id } = req.params;
    const game = await Videojuego.findByPk(id);

    if (!game) {
        return res.status(404).json({ message: "Game not found" });
    }
    
    res.json(game);
};

export const createGame = async (req, res) => {
    const { nombre, descripcion, precio, plataforma, imagenUrl, categoriaId } = req.body;

    if (!nombre || !plataforma) {
        return res.status(400).json({ message: "Nombre and plataforma fields are required" });
    }

    const newGame = await Videojuego.create({
        nombre,
        descripcion,
        precio,
        plataforma,
        imagenUrl,
        categoriaId
    })
    res.json(newGame);
};

export const updateGame = async (req, res) => {
    const { nombre, descripcion, precio, plataforma, imagenUrl, categoriaId } = req.body;
    const { id } = req.params;

    const game = await Videojuego.findByPk(id);

    await game.update({
        nombre,
        descripcion,
        precio,
        plataforma,
        imagenUrl,
        categoriaId
    })

    await game.save();

    res.json(game);
};

export const deleteGame = async (req, res) => {
    const { id } = req.params;

    const game = await Videojuego.findByPk(id);

    await game.destroy();

    res.send(`Juego con id: ${id} borrado`);
};