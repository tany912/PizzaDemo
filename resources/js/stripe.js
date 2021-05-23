import {loadStripe} from '@stripe/stripe-js';
import {placeOrder} from './apiService'



export async function initStripe() {

// Stripe.js will not be loaded until `loadStripe` is called
const stripe = await loadStripe('pk_test_51ItUosSEubgWl14bxrt4RBC8C0Se1nWVQVZxNW0JRQh19niuAByRz27YHss8z9HET28FYs7bHgU0L8P0UG3xnWKj00TqDZdt7n');
let card = null;
function mountWidget(){
    const elements = stripe.elements();

    let style = {
                base: {
                color: '#32325d',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4'
                }
                },
                invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
                }
            };


card = elements.create('card',{style, hidePostalCode:true});

card.mount('#card-element');

}


    const paymentType = document.querySelector('#paymentType');
    if(paymentType){
    paymentType.addEventListener("change", (e)=>{
        if(e.target.value==='card'){
            // Display Widget
            mountWidget();
        }else{
            //Destroy Card Here
            card.destroy();
        }

    })
}

const paymentForm = document.querySelector("#payment-form");
if(paymentForm){
  paymentForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    let formData = new FormData(paymentForm);
    let formObject = {}
    for(let [key,value] of formData.entries()){
      formObject[key] = value
    }

    
    if(!card){
        placeOrder(formObject);
        return;
        
    }

    // //Creating token
    // const token = await card.createToken()
    // formObject.stripeToken = token.id;
    // placeOrder(formObject);


    //Verify Card only if card is selected
    stripe.createToken(card).then(function(result) {
        formObject.stripeToken = result.token.id;
         placeOrder(formObject);
        
      }).catch((err) =>{
            console.log(err);
      })
     

    //Ajax Call 
 


})
}





}