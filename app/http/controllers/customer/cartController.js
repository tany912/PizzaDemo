const cartController = function () {
    return {
        index(req, res) {
            return res.render('customer/cart')
        },
        update(req, res) {
            //Cart creation for first time
            if (!req.session.cart) {
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                }
            }
            //Now we need to check if any item already present 
            let cart = req.session.cart;

            if (!cart.items[req.body._id]) {
                cart.items[req.body._id] = {
                    item: req.body,
                    qty: 1
                }
                cart.totalQty = cart.totalQty + 1;
                cart.totalPrice = cart.totalPrice + req.body.price;
            } else {
                // cart.items[req.body._id].item = req.body; No need do this as it already done in if loop
                cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1;
                cart.totalQty = cart.totalQty + 1;
                cart.totalPrice = cart.totalPrice + req.body.price;
            }
            // console.log(req.session);
            return res.json(req.session.cart.totalQty);
        }
    }
}


module.exports = cartController;