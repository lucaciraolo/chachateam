import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check'

let Stripe = StripeAPI( Meteor.settings.private.stripe );

Meteor.methods({
    processPayment( charge ) {
        console.log('starting');
        check( charge, {
            amount: Number,
            currency: String,
            source: String,
            receipt_email: String
        });
        console.log('checked');
        let handleCharge = Meteor.wrapAsync( Stripe.charges.create, Stripe.charges ),
            payment      = handleCharge( charge );
        
        return payment;
    }
});