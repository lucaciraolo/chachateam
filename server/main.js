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
            date: Date(),
            firstName: name.first,
            lastName: name.last,
            amount: charge.amount,
            email: charge.receipt_email,
            display: display
        });

        //Meteor.call('sendDonationEmail', name, charge);
        //
        //if (Donations.find().count() % 10 == 0) {
        //    Meteor.call('sendDonationSummary');
        //}
        
        return payment;
    },
    sendDonationEmail(name, charge) {
        var html = 'You have received a new donation! <br><br>';
        html += 'Name: ' + name.first + ' ' + name.last + '<br>';
        html += 'Amount: $' + charge.amount/100 + '<br>';
        html += 'Email: ' + charge.receipt_email;

        this.unblock();

        Email.send({
            to: 'info@chacha.team',
            from: 'ChaCha Team Website <system@chacha.team>',
            subject: 'New Donation!',
            html: html
        });
    },
    sendDonationSummary() {
        var html = '<table style="width:100%"><caption>Donation Summary:</caption><tr><th>Name</th><th>Amount</th><th>Email</th></tr>';


        Donations.find({}, {sort: {date: 1}}).forEach(function (donation) {
            html += '<tr>';
            html += `<td>${donation.firstName} ${donation.lastName}</td>`;
            html += `<td>${donation.amount / 100}</td>`;
            html += `<td>${donation.email}</td>`;
            html += '</tr>';
        });

        html += '</table>';


        this.unblock();

        Email.send({
            to: 'info@chacha.team',
            from: 'ChaCha Team Website <system@chacha.team>',
            subject: 'Donation Summary',
            html: html
        });
    }
});