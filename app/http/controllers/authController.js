const user = require('../../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

const authController = function () {
    return {
        login(req, res) {
            return res.render('auth/login');
        },
        register(req, res) {
            return res.render('auth/register');
        },
        async postRegister(req, res) {
            try {
                const { name, email, phone, password } = req.body;
                
                //Validate all fields
                if (!name || !email || !phone || !password) {
                    req.flash('name', name);   //Using flash for sending message to View.
                    req.flash('email', email);
                    req.flash('phone', phone);
                    req.flash('error', 'All Fields are required');
                    return res.redirect('register');
                }
                //Check email or phone exist
                const data = await user.findOne({ $or: [{ email }, { phone }] }, { email: 1, phone: 1 });
                // console.log(data);
                // console.log(email);
                if (data) {
                    if (data.email == email) {
                        req.flash('name', name);
                        req.flash('email', email);
                        req.flash('phone', phone);
                        req.flash('error', 'Email already exist');
                        return res.redirect('register');
                    } else if (data.phone == phone) {
                        req.flash('name', name);
                        req.flash('email', email);
                        req.flash('phone', phone);
                        req.flash('error', 'Phone already exist');
                        return res.redirect('register');
                    }
                }
                else {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    const usersave = new user({
                        name,
                        email,
                        phone,
                        password: hashedPassword
                    })

                    const result = await usersave.save();
                    return res.redirect('/')

                }
            }
            catch (err) {
                req.flash('error', 'Something Went Wrong');
                console.log(err);
                return res.redirect('register');
            }


        },
        async postLogin(req,res,next){

           const _getRedirectUrl = (req)=>{
               return req.user.role === "admin" ? '/admin/order' : '/customer/order';
           }

            const { email, password } = req.body;
            if(!email || !password){
                req.flash('error', 'All fields are required');
                return res.redirect('/login');
            }
            passport.authenticate('local', (err, user, info) => {
                if(err){
                    req.flash('error', info.message )
                    return next(err)
                }
                if(!user) {
                    req.flash('error', info.message )
                    return res.redirect('/login')
                }
                req.logIn(user, (err) => {
                    if(err) {
                        req.flash('error', info.message ) 
                        return next(err)
                    }

                    return res.redirect(_getRedirectUrl(req))
                })

            })(req,res,next)
        },
        postLogout(req,res){
        req.logout()
        return res.redirect('/login')  
        }
    }
}

module.exports = authController;