import { Categoria } from "../models/Categoria.js";

// ENCONTRAR CATEGORIAS/CATEGORIA

export const findCategories = async (req, res) => {
  try {
    const categories = await Categoria.findAll();
    res.json(categories);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error retrieving categories",
    });
  }
};

export const findCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Categoria.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error retrieving category",
    });
  }
};

// CREAR CATEGORIA

export const createCategory = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: "Nombre field is required" });
    }

    const newCategory = await Categoria.create({
      nombre,
    });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error creating category",
    });
  }
};

// ACTUALIZAR CATEGORIA

export const updateCategory = async (req, res) => {
  try {
    const { nombre } = req.body;
    const { id } = req.params;

    const category = await Categoria.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if(!nombre) {
        return res.status(400).json({
            message: "Nombre field is required",
        });
    }

    await category.update({ nombre });

    res.json(category);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Error updating category" });
  }
};

// ELIMINAR UNA CATEGORIA

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Categoria.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.destroy();

    res.json({message: `Categoria con el id: ${id} borrado exitosamente`});
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Error deleting Category" });
  }
};
