const moment = require('moment');
const Order = require('../../../models/order');

const orderController = ()=> {
    return {
        async index(req, res) {
            const orders = await Order.find({ status: { $ne: "completed" } }, null,
                { sort: { 'createdAt': -1 } }).populate('customerID','-password').exec((err,orders)=>{
                    if(req.xhr) {
                        return res.json(orders)
                    } else {
                     return res.render('admin/order')
                    }
                });
        }
    }
}


module.exports = orderController;