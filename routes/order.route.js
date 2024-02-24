const express =require("express");
const router = express.Router();
const AuthService = require("../services/auth.service");
const {createCashOrder,checkoutSession,filterOrderLoggedUser,findAllOrders,updateOrderToDelivered,updateOrderToPaid} = require("../services/order.service");
const {createOrderValidator} = require("../utils/validators/order.validator");

router.use(AuthService.auth);
router.route("/my").get(filterOrderLoggedUser,findAllOrders);
router.route("/cash").post(createOrderValidator, createCashOrder);
router.route("/checkout-session").post(createOrderValidator,checkoutSession);
router.use(AuthService.allowedTo("admin"));
router.route("/").get(findAllOrders);
router.route("/:id/deliver").put(updateOrderToDelivered);
router.route("/:id/pay").put(updateOrderToPaid);
module.exports = router;