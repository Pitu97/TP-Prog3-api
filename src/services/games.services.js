import { Videojuego } from "../models/Videojuego.js";
import { Categoria } from "../models/Categoria.js";
import { isValidCategory, isValidName, isValidPrice } from "../utils/validators.js";
import { Op } from "sequelize";

// ENCONTRAR JUEGO/JUEGOS

export const findGames = async (req, res) => {
  try {
    const {name, platform, categoryId} = req.query;
    const filters = {};

    if(name !== undefined) {
      if(typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          message: "Invalid name filter",
        });
      }

      filters.name = {
        [Op.like]: `%${name.trim()}%`,
      };
    }

    if(platform !== undefined) {
      if(typeof platform !== "string" || !platform.trim()) {
        return res.status(400).json({
          message: "Invalid platform filter",
        });
      }

      filters.platform = {
        [Op.like]: platform.trim(),
      };
    }

    if (categoryId !== undefined) {
      const parseCategoryId = Number(categoryId);

      if (!Number.isInteger(parseCategoryId) || parseCategoryId <= 0) {
        return res.status(400).json({
          message: "Invalid category ID",
        });
      }

      const category = await Categoria.findByPk(parseCategoryId);

      if(!category) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      filters.categoryId = parseCategoryId;
    }

    const games = await Videojuego.findAll({
      where: filters,
    });

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
    const { name, description, price, platform, image, categoryId } = req.body;

    if (!isValidName(name) || !isValidName(platform)) {
      return res
        .status(400)
        .json({ message: "Name and platform fields are required" });
    }

    if (!isValidPrice(price)) {
      return res
        .status(400)
        .json({ message: "Price must be a positive number" });
    }

    if (!isValidCategory(categoryId)) {
      return res
        .status(400)
        .json({ message: "A valid category ID is required" });
    }

    const category = await Categoria.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const newGame = await Videojuego.create({
      name,
      description,
      price,
      platform,
      image,
      categoryId,
    });
    res.status(201).json(newGame);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error creating game",
    });
  }
};

// ACTUALIZAR JUEGO

export const updateGame = async (req, res) => {
  try {
    const { name, description, price, platform, image, categoryId } = req.body;

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "At least one field is required",
      });
    }
    
    const { id } = req.params;

    const game = await Videojuego.findByPk(id);

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    if (name !== undefined && !isValidName(name)) {
      return res.status(400).json({ message: "Name cannot be empty" });
    }

    if (platform !== undefined && !isValidName(platform)) {
      return res.status(400).json({ message: "Platform cannot be empty" });
    }

    if (price !== undefined && !isValidPrice(price)) {
      return res
        .status(400)
        .json({ message: "Price must be a positive number" });
    }

    if (categoryId !== undefined) {
      if (!isValidCategory(categoryId)) {
        return res.status(400).json({ message: "Invalid Category ID" });
      }

      const category = await Categoria.findByPk(categoryId);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    await game.update({
      name,
      description,
      price,
      platform,
      image,
      categoryId,
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

    res.send(`Game deleted succesfully. id: ${id}`);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Error deleting game" });
  }
};
