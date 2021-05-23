// /admin/order/status

const Order = require('../../../models/order');

const statusController = function () {
    return {
        async updateStatus(req, res) {
            
            Order.updateOne({_id: req.body.orderId}, { status: req.body.status }, (err, data)=> {
                if(err) {
                    console.log(err);
                    return res.redirect('/admin/order');
                }
               const eventEmitter = req.app.get('eventEmitter');
               eventEmitter.emit('orderUpdated', { id: req.body.orderId, status: req.body.status});
                return res.redirect('/admin/order');
            })
        }
    }
}


module.exports = statusController;