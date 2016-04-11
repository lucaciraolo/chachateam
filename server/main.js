import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check'


let Stripe = StripeAPI( Meteor.settings.private.stripe );

Meteor.methods({
    processPayment( charge, name, display ) {
        check( charge, {
            amount: Number,
            currency: String,
            source: String,
            receipt_email: String
        });

        check(name, {
            first: String,
            last: String
        });

        check(display, Boolean);

        let handleCharge = Meteor.wrapAsync( Stripe.charges.create, Stripe.charges ),
            payment      = handleCharge( charge );

        Donations.insert({
            firstName: name.first,
            lastName: name.last,
            amount: charge.amount,
            email: charge.receipt_email,
            display: display
        });
        
        return payment;
    }
});