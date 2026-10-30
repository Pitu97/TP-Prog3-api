import { Videojuego } from "../models/Videojuego.js";

// ENCONTRAR JUEGO/JUEGOS

export const findGames = async (req, res) => {
  try {
    const games = await Videojuego.findAll();
    res.json(games);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error retrieving games",
    });
  }
};

export const findGame = async (req, res) => {
  try {
    const { id } = req.params;
    const game = await Videojuego.findByPk(id);

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    res.json(game);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error retrieving game",
    });
  }
};

// CREAR JUEGO

export const createGame = async (req, res) => {
  try {
    const { nombre, descripcion, precio, plataforma, imagenUrl, categoriaId } =
      req.body;

    if (!nombre || !plataforma) {
      return res
        .status(400)
        .json({ message: "Nombre and plataforma fields are required" });
    }

    const newGame = await Videojuego.create({
      nombre,
      descripcion,
      precio,
      plataforma,
      imagenUrl,
      categoriaId,
    });
    res.json(newGame);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error retrieving games",
    });
  }
};

// ACTUALIZAR JUEGO

export const updateGame = async (req, res) => {
  try {
    const { nombre, descripcion, precio, plataforma, imagenUrl, categoriaId } =
      req.body;
    const { id } = req.params;

    const game = await Videojuego.findByPk(id);

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    await game.update({
      nombre,
      descripcion,
      precio,
      plataforma,
      imagenUrl,
      categoriaId,
    });

    res.json(game);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Error updating game" });
  }
};

// BORRAR JUEGO

export const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;

    const game = await Videojuego.findByPk(id);

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    await game.destroy();

    res.send(`Juego con id: ${id} borrado`);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Error deleting game" });
  }
};
