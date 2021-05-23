  
import axios from 'axios'
import Noty from 'noty'

export function placeOrder(formObject) {

axios.post('/orders', formObject).then((res) => {
    // console.log(`${res.data.message}`);
    new Noty({
        type: 'success',
        timeout: 1000,
        text: res.data.message,
        progressBar: false,
    }).show();
    setTimeout(() => {
        window.location.href = '/customer/order';
    }, 1000);
}).catch((err)=> {
    new Noty({
        type: 'error',
        timeout: 1000,
        text: err.response.data.message,
        progressBar: false,
    }).show();
})

}