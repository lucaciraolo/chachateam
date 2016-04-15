import { Template } from 'meteor/templating';

import './donations.template.html';

var $ = jQuery.noConflict();

var checkout =
    StripeCheckout.configure({
        key: Meteor.settings.public.stripe,
        locale: 'auto',
        token( token ) {
            let charge  = {
                amount: token.amount || parseInt($('#donationAmount').val() * 100),
                currency: token.currency || 'usd',
                source: token.id,
                receipt_email: token.email
            };

            let name = {
                first: $('input[name=firstName]').val(),
                last: $('input[name=lastName]').val()
            };

            let display = $('input[name=display]').is(':checked');

            Meteor.call( 'processPayment', charge, name, display, ( error, response ) => {
                if ( error ) {
                    alert(error.reason);
                } else {
                    $('#donationForm')
                        .trigger('reset')
                        .after('<div class="alert alert-success" style="margin-top: 10px;">Thank you! Your donation has been successfully received.</div>');
                }
            });
        }
    });


Template.donations.helpers({
    donationsProgress() {
        var total = 0;
        var donations = Donations.find({});
        donations.forEach(function(donation) {
            total += donation.amount;
        });
        var value = Math.round(total / 60000);

        var swimmerMargin = value / 100 * 594 - 60;
        if (swimmerMargin < 0) swimmerMargin = 0;
        $(document).ready(function($) {
            $('#swimmer').css('margin-left', swimmerMargin + 'px');
            $('#donationsProgressBar').css('width', value + '%');
        });
        return (total/100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    donors() {
        return Donations.find({display: true});
    }
});

Template.body.events({
    'submit #donationForm'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const amount = target.amount.value;

        checkout.open({
            name: 'ChaCha Team',
            description: 'Donation to help raise money for Obstetric Fistula',
            amount: amount * 100
        });
    }
});

