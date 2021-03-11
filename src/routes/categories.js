const router = require('express-promise-router')();
const { checkJWTSign } = require('../middlewares/jwtCheck.middleware')
const { category } = require('../controllers');


router.route("/:id").get(category.get);
router.route("/").get(checkJWTSign, category.getAll);
router.route("/").post(category.create);
router.route("/:id").put(category.update);
router.route("/:id").delete(category.delete);

module.exports = router