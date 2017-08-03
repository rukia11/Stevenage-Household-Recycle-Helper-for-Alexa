/**
 * This skill helper people in Stevenage with recycling waste at their household.
 **/

'use strict';

const Alexa = require('alexa-sdk');
const waste = require('./recycling');

const APP_ID = undefined; // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
    'en': {
        translation: {
            WASTE: waste.WASTE_EN_GB,
            SKILL_NAME: 'Stevenage Household Recyling Helper',
            WELCOME_MESSAGE: "Welcome to Stevenage Household Recyling Helper. What can I help you with?",
            WELCOME_REPROMT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: '%s  - Box for %s.',
            HELP_MESSAGE: "You can ask questions such as, where should I put waste, or, you can say exit. Now, what can I help you with?",
            STOP_MESSAGE: 'Have a nice day',
            WASTE_NOT_FOUND_MESSAGE: "It looks that this thing cannot be recycled in your household recycle boxes.",
        },
    },
};

const handlers = {
    'LaunchRequest': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE');
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'WasteIntent': function () {
        const itemSlot = this.event.request.intent.slots.Item;
        let itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
        }

        const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), itemName);
        const mywaste = this.t('WASTE');
        const rubbish = mywaste[itemName];

        if (rubbish) {
            this.attributes.speechOutput = rubbish;
            this.emit(':askWithCard', rubbish, this.attributes.repromptSpeech, cardTitle, rubbish);
        } else {
            let speechOutput = this.t('WASTE_NOT_FOUND_MESSAGE');
            this.attributes.speechOutput = speechOutput;
            this.emit(':ask', speechOutput);
        }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.emit(':ask', this.attributes.speechOutput);
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'Unhandled': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
                this.emit(':ask', this.attributes.speechOutput);
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
