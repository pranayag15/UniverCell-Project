module.exports = function Cart(oldCart) {
    let totalPrice =0;
    items.forEach(item => {
        console.log(typeof(item.price));
        totalPrice += item.price
    });
    if(typeof(item=='undefined')){
        var item = "maal s"
    } else {
        console.log(item);
        
    }
    console.log(totalPrice);


    
}
