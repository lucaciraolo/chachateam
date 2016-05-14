import { Template } from 'meteor/templating';

import './thanks.template.html';

Template.thanks.helpers({
    donors() {
        return Donations.find({display: true}, {sort: {date: 1}});
    }
});
