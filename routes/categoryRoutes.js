const express = require("express");

const router = express.Router();
const controller = require("../controllers/categoryController");

router.get("/", controller.index);

router.get("/new", controller.createForm);
router.post("/new", controller.create);

router.get("/:id", controller.detail);

router.get("/:id/edit", controller.editForm);
router.post("/:id/edit", controller.update);

router.get("/:id/delete", controller.deleteForm);
router.post("/:id/delete", controller.remove);

module.exports = router;
