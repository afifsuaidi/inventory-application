const categoryModel = require("../models/categoryModel");

async function index(req, res, next) {
  try {
    const categories = await categoryModel.getAllCategories();

    res.render("categories/index", {
      title: "Categories",
      categories,
    });
  } catch (error) {
    next(error);
  }
}

async function detail(req, res, next) {
  try {
    const category = await categoryModel.getCategoryWithItems(req.params.id);

    if (!category) {
      return res.status(404).render("error", {
        title: "Category Not Found",
        message: "Category yang kamu cari tidak ditemukan.",
      });
    }

    res.render("categories/detail", {
      title: category.name,
      category,
    });
  } catch (error) {
    next(error);
  }
}

function createForm(req, res) {
  res.render("categories/form", {
    title: "Add Category",
    heading: "Add Category",
    category: null,
    errors: [],
  });
}

async function create(req, res, next) {
  try {
    const name = req.body.name.trim();
    const description = req.body.description.trim();

    const errors = [];

    if (!name) {
      errors.push("Nama kategori wajib diisi.");
    }

    if (name.length > 100) {
      errors.push("Nama kategori maksimal 100 karakter.");
    }

    if (errors.length > 0) {
      return res.status(400).render("categories/form", {
        title: "Add Category",
        heading: "Add Category",
        category: {
          name,
          description,
        },
        errors,
      });
    }

    await categoryModel.createCategory(name, description);

    res.redirect("/categories");
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).render("categories/form", {
        title: "Add Category",
        heading: "Add Category",
        category: {
          name: req.body.name,
          description: req.body.description,
        },
        errors: ["Nama kategori sudah digunakan."],
      });
    }

    next(error);
  }
}

async function editForm(req, res, next) {
  try {
    const category = await categoryModel.getCategoryById(req.params.id);

    if (!category) {
      return res.status(404).render("error", {
        title: "Category Not Found",
        message: "Category yang kamu cari tidak ditemukan.",
      });
    }

    res.render("categories/form", {
      title: "Edit Category",
      heading: "Edit Category",
      category,
      errors: [],
    });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const name = req.body.name.trim();
    const description = req.body.description.trim();

    const errors = [];

    if (!name) {
      errors.push("Nama kategori wajib diisi.");
    }

    if (name.length > 100) {
      errors.push("Nama kategori maksimal 100 karakter.");
    }

    if (errors.length > 0) {
      return res.status(400).render("categories/form", {
        title: "Edit Category",
        heading: "Edit Category",
        category: {
          id,
          name,
          description,
        },
        errors,
      });
    }

    const category = await categoryModel.updateCategory(id, name, description);

    if (!category) {
      return res.status(404).render("error", {
        title: "Category Not Found",
        message: "Category yang kamu cari tidak ditemukan.",
      });
    }

    res.redirect(`/categories/${id}`);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).render("categories/form", {
        title: "Edit Category",
        heading: "Edit Category",
        category: {
          id: req.params.id,
          name: req.body.name,
          description: req.body.description,
        },
        errors: ["Nama kategori sudah digunakan."],
      });
    }

    next(error);
  }
}

async function deleteForm(req, res, next) {
  try {
    const category = await categoryModel.getCategoryWithItems(req.params.id);

    if (!category) {
      return res.status(404).render("error", {
        title: "Category Not Found",
        message: "Category yang kamu cari tidak ditemukan.",
      });
    }

    res.render("categories/delete", {
      title: "Delete Category",
      category,
    });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const category = await categoryModel.getCategoryById(req.params.id);

    if (!category) {
      return res.status(404).render("error", {
        title: "Category Not Found",
        message: "Category yang kamu cari tidak ditemukan.",
      });
    }

    await categoryModel.deleteCategory(req.params.id);

    res.redirect("/categories");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  index,
  detail,
  createForm,
  create,
  editForm,
  update,
  deleteForm,
  remove,
};
