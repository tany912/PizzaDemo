const moment = require('moment');
const Order = require('../../../models/order');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

const orderController = function () {
    return {
        async store(req, res) {
            // console.log(req.session.cart.items);
            const { phone, address, stripeToken, paymentType } = await req.body;
            if (!phone || !address) {
                return res.status(422).json({ message : 'All fields are required' });
            } else {
                const ordersave = new Order({
                    customerID: req.user._id,
                    items: req.session.cart.items,
                    phone,
                    address
                })
                ordersave.save().then(result => {
                    Order.populate(result, { path: 'customerID' }, (err, placedOrder) => {
                        // req.flash('success', 'Order placed successfully')
    
                        // Stripe payment
                        if(paymentType === 'card') {
                            stripe.charges.create({
                                amount: req.session.cart.totalPrice  * 100,
                                source: stripeToken,
                                currency: 'inr',
                                description: `Pizza order: ${placedOrder._id}`
                            }).then(() => {
                                placedOrder.paymentStatus = true
                                placedOrder.paymentType = paymentType
                                placedOrder.save().then((ord) => {
                                    // Emit
                                    const eventEmitter = req.app.get('eventEmitter')
                                    eventEmitter.emit('orderPlaced', ord)
                                    delete req.session.cart
                                    return res.json({ message : 'Payment successful, Order placed successfully' });
                                }).catch((err) => {
                                    console.log(err)
                                })
    
                            }).catch((err) => {
                                delete req.session.cart
                                return res.json({ message : 'OrderPlaced but payment failed, You can pay at delivery time' });
                            })
                        } else {
                            delete req.session.cart
                            return res.json({ message : 'Order placed succesfully' });
                        }
                    })
                }).catch(err => {
                    return res.status(500).json({ message : 'Something went wrong' });
                })
            }
            },
            async index(req, res) {
                const orders = await Order.find({ customerID: req.user._id },
                    null,
                    { sort: { 'createdAt': -1 } } )
                res.header('Cache-Control', 'no-store')
                res.render('customer/order', { orders: orders, moment: moment })
            },
        async show(req, res) {
            
            const order = await Order.findById(req.params.id)
            // console.log(order);
            var a = req.user._id.toString();
            var b = order.customerID.toString();

            // Authorize user
            if(a === b) {
                return res.render('customer/singleOrder', { order })
            }
            // return  res.redirect('/')
            return res.json("Dada");
        }
    }
}


module.exports = orderController;