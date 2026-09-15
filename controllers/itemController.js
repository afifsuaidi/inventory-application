const itemModel = require("../models/itemModel");
const categoryModel = require("../models/categoryModel");

async function index(req, res, next) {
  try {
    const items = await itemModel.getAllItems();

    res.render("items/index", {
      title: "Items",
      items,
    });
  } catch (error) {
    next(error);
  }
}

async function detail(req, res, next) {
  try {
    const item = await itemModel.getItemById(req.params.id);

    if (!item) {
      return res.status(404).render("error", {
        title: "Item Not Found",
        message: "Item yang kamu cari tidak ditemukan.",
      });
    }

    res.render("items/detail", {
      title: item.name,
      item,
    });
  } catch (error) {
    next(error);
  }
}

async function createForm(req, res, next) {
  try {
    const categories = await categoryModel.getAllCategories();

    res.render("items/form", {
      title: "Add Item",
      heading: "Add Item",
      item: null,
      categories,
      errors: [],
    });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const name = req.body.name.trim();
    const description = req.body.description.trim();
    const price = req.body.price;
    const quantity = req.body.quantity;
    const categoryId = req.body.category_id;

    const errors = [];

    if (!name) {
      errors.push("Nama item wajib diisi.");
    }

    if (price === "" || Number(price) < 0) {
      errors.push("Harga harus berupa angka 0 atau lebih.");
    }

    if (
      quantity === "" ||
      !Number.isInteger(Number(quantity)) ||
      Number(quantity) < 0
    ) {
      errors.push("Jumlah harus berupa bilangan bulat 0 atau lebih.");
    }

    if (!categoryId) {
      errors.push("Kategori wajib dipilih.");
    }

    const categories = await categoryModel.getAllCategories();

    if (errors.length > 0) {
      return res.status(400).render("items/form", {
        title: "Add Item",
        heading: "Add Item",
        item: {
          name,
          description,
          price,
          quantity,
          category_id: categoryId,
        },
        categories,
        errors,
      });
    }

    await itemModel.createItem(
      name,
      description,
      Number(price),
      Number(quantity),
      Number(categoryId),
    );

    res.redirect("/items");
  } catch (error) {
    next(error);
  }
}

async function editForm(req, res, next) {
  try {
    const item = await itemModel.getItemById(req.params.id);
    const categories = await categoryModel.getAllCategories();

    if (!item) {
      return res.status(404).render("error", {
        title: "Item Not Found",
        message: "Item yang kamu cari tidak ditemukan.",
      });
    }

    res.render("items/form", {
      title: "Edit Item",
      heading: "Edit Item",
      item,
      categories,
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
    const price = req.body.price;
    const quantity = req.body.quantity;
    const categoryId = req.body.category_id;

    const errors = [];

    if (!name) {
      errors.push("Nama item wajib diisi.");
    }

    if (price === "" || Number(price) < 0) {
      errors.push("Harga harus berupa angka 0 atau lebih.");
    }

    if (
      quantity === "" ||
      !Number.isInteger(Number(quantity)) ||
      Number(quantity) < 0
    ) {
      errors.push("Jumlah harus berupa bilangan bulat 0 atau lebih.");
    }

    if (!categoryId) {
      errors.push("Kategori wajib dipilih.");
    }

    const categories = await categoryModel.getAllCategories();

    if (errors.length > 0) {
      return res.status(400).render("items/form", {
        title: "Edit Item",
        heading: "Edit Item",
        item: {
          id,
          name,
          description,
          price,
          quantity,
          category_id: categoryId,
        },
        categories,
        errors,
      });
    }

    const item = await itemModel.updateItem(
      id,
      name,
      description,
      Number(price),
      Number(quantity),
      Number(categoryId),
    );

    if (!item) {
      return res.status(404).render("error", {
        title: "Item Not Found",
        message: "Item yang kamu cari tidak ditemukan.",
      });
    }

    res.redirect(`/items/${id}`);
  } catch (error) {
    next(error);
  }
}

async function deleteForm(req, res, next) {
  try {
    const item = await itemModel.getItemById(req.params.id);

    if (!item) {
      return res.status(404).render("error", {
        title: "Item Not Found",
        message: "Item yang kamu cari tidak ditemukan.",
      });
    }

    res.render("items/delete", {
      title: "Delete Item",
      item,
    });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const item = await itemModel.getItemById(req.params.id);

    if (!item) {
      return res.status(404).render("error", {
        title: "Item Not Found",
        message: "Item yang kamu cari tidak ditemukan.",
      });
    }

    await itemModel.deleteItem(req.params.id);

    res.redirect("/items");
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
