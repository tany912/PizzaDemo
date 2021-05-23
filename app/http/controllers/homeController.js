const menu = require('../../models/menu');

const homeController = function(){
    return {
        async index(req,res){
            const pizzas = await menu.find();
           return res.render('home', {pizzas});
        }
    }
}


module.exports = homeController;