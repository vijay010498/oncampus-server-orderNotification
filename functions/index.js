'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const ORDER_DB = functions.config().database.orderdb;
exports.sendOrderStatusNotification = 
functions.database.instance(ORDER_DB).ref('/Orders/{orderId}')
    .onWrite(async (change, context) => {
        
        const snapshot = change.after;
        const order = snapshot.val();
        const userId = order.userId;
        const currentStatus = order.orderStatus;
        const isPickup = order.pickup;
        const userToken = order.userToken;
        const restaurantName = order.restaurantName.toLowerCase();
        const ratingValue = order.ratingValue;
        console.log('userId: ',userId);
        console.log('orderStatus: ',currentStatus);
        console.log('isPickup: ',isPickup);
        console.log('ratingValue',ratingValue);

            var titleSend = 'Order Update';
            var bodySend =  'Order update';
            //Check status
            if(ratingValue == -1){

                if(currentStatus == 0)
                {
                    titleSend = 'Order placed';
                    bodySend = 'Your order from ' +restaurantName+ ' has been Placed waiting for the restaurant confirmation!';

                }
                else if(currentStatus == 1)
                {
                    titleSend = 'Order confirmed';
                    bodySend = 'Your order from ' +restaurantName+ ' has been confirmed and food is being prepared!';


                }
                else if(currentStatus == 2)
                {
                    titleSend = 'Order out for delivery';
                    bodySend = 'Your order from ' +restaurantName+ ' has been Prepared and is out for delivery!';
                    
                }
                else if(currentStatus == -2)
                {
                    titleSend = 'Ready for Pickup';
                    bodySend = 'Your order from ' +restaurantName+ ' has been Prepared and is ready for pickup!';
                    
                }
                else if(currentStatus == 3)
                {
                    if(isPickup == true){
                        titleSend = 'Order PickedUp!';
                        bodySend = 'Your order from ' +restaurantName+ ' was Picked Up Enjoy your food!';

                    }else if(isPickup == false)
                    {
                        titleSend = 'Order Delivered';
                        bodySend = 'Your order from ' +restaurantName+ ' was delivered on Time enjoy your food!';

                    }
                    
                }
                else if(currentStatus == -1)
                {
                    titleSend = 'Order Cancelled by restaurant';
                    bodySend = 'Your order from ' +restaurantName+ ' has been cancelled by restaurant and refund has been initiated contact us for more help!';
                    
                }
                else if(currentStatus == -3)
                {
                    titleSend = 'Order Cancelled by you';
                    bodySend = 'Your order from ' +restaurantName+ ' has been cencelled by you!';
                    
                }
            }
            else{
                titleSend = 'Thanks for your rating!'
                bodySend = 'Your word makes onCampus a better place you are the influence!'
            }
    
            const payload = {
                notification : {
                    title : titleSend,
                    body : bodySend

                }
            };
            try {
                const response = await admin.messaging().sendToDevice(userToken, payload);
                console.log('Notification sent successfully:', response);
            }
            catch (error) {
                console.log('Notification sent failed:', error);
            }
        return null;    
    });