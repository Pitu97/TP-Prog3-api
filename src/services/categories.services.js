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
    const { name } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Name must be a valid text",
      });
    }

    const newCategory = await Categoria.create({
      name: name.trim(),
    });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error(error);

    if(error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "Category already exists",
      });
    }

    res.status(500).json({
      message: "Error creating category",
    });
  }
};

// ACTUALIZAR CATEGORIA

export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const category = await Categoria.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Name must be a valid text",
      });
    }

    await category.update({ name: name.trim() });

    res.json(category);
  } catch (error) {
    console.error(error);

     if(error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "Category already exists",
      });
    }

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

    res.json({message: `Category deleted succesfully. id: ${id}`});
  } catch (error) {
    console.error(error);

    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(409).json({
        message: "Cannot delete category because it has associated games",
      });
    }

    res.status(500).json({ message: "Error deleting Category" });
  }
};
