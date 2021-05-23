import axios from 'axios'
import Noty from 'noty'
import { initAdmin } from './admin'
import moment from 'moment'
import {initStripe} from './stripe'

var addCart = document.querySelectorAll(".add-to-cart");
var cartCounter = document.querySelector("#cartCounter");

function updateCart(pizza) {
  axios.post('/update-cart', pizza).then(res => {
    cartCounter.textContent = res.data;
    new Noty({
      text: "1 item added to cart",
      type: "success",
      timeout: 1000,
      progressBar: false
    }).show();
  }).catch(err => {
    new Noty({
      text: "Something went wrong",
      type: "error",
      timeout: 1000,
      progressBar: false
    }).show();
  })
}

addCart.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const pizza = JSON.parse(btn.dataset.details);
    updateCart(pizza);
  })
});

// Removing Alert after some seconds
var success_alert = document.querySelector("#success-alert");
if (success_alert) {
  setTimeout(function () {
    success_alert.remove();
  }, 2000);
}



// Change order status
let statuses = document.querySelectorAll(".status_line");
let hiddenInput = document.querySelector("#hiddenInput");
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);
let time = document.createElement('small');

function updateStatus(order) {
  statuses.forEach((status) => {
      status.classList.remove('step-completed')
      status.classList.remove('current')
  })
  let stepCompleted = true;
  statuses.forEach((status) => {
     let dataProp = status.dataset.status

     //for by default order i.e order_placed
     if(stepCompleted) {
          status.classList.add('step-completed')
     }
     //Now check status that if Input data and order status are same 
     if(dataProp === order.status) {
          stepCompleted = false
          time.innerText = moment(order.updatedAt).format('hh:mm A')
          status.appendChild(time)
         if(status.nextElementSibling) {
          status.nextElementSibling.classList.add('current')
         }
     }
  })

}

updateStatus(order)


initStripe()



let socket = io()
initAdmin(socket)

// Join
if(order) {
  socket.emit('join', `order_${order._id}`)
}


//Checking for admin login
let adminAreaPath = window.location.pathname
if(adminAreaPath.includes('admin')) {
    socket.emit('join', 'adminRoom')
}




socket.on('orderUpdated',(data)=>{
  const updatedOrder = { ...order }
  updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
      type: 'success',
      timeout: 1000,
      text: 'Order updated',
      progressBar: false,
  }).show();
})




