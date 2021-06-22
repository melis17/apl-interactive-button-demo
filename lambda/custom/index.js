/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core')

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
  },
  handle(handlerInput) {
    const speechText = 'APLボタンデモへようこそ。ボタンを押して、どのように動くかを学びましょう。次に、GitHubのコードを参照してください。'

    return handlerInput.responseBuilder
      .speak(speechText)
      // Add this to render APL document
      .addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        version: '1.0',
        document: require('./apl/button'), // Import button APL document
        datasources: {}
      })
      .getResponse()
  },
};

const SendEventIntentHandler = {
  canHandle(handlerInput) {
    // Check for SendEvent sent from the button
    return handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.UserEvent'
  },
  handle(handlerInput) {
    // Take argument sent from the button to speak back to the user
    const speechText = handlerInput.requestEnvelope.request.arguments[0]
    return handlerInput.responseBuilder
        .speak(speechText)
        .getResponse()
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent'
  },
  handle(handlerInput) {
    const speechText = 'ボタンを押してください'

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('ボタンを押してください。ソースコードはGithubで確認できます。', speechText)
      .getResponse()
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent')
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!'

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('デモをお試しいただきありがとうございます。コードはGitHubで見つけることができます。', speechText)
      .getResponse()
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest'
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`)

    return handlerInput.responseBuilder.getResponse()
  },
};

const ErrorHandler = {
  canHandle() {
    return true
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`)
    const speechText = 'リクエストの処理に問題がありました。もう一度やり直してください。問題が解決しない場合は、スキル開発者に連絡してください。何かお助けできますか？'
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse()
  },
};

const skillBuilder = Alexa.SkillBuilders.custom()

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    SendEventIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .withCustomUserAgent('apl-interactive-button/v1')
  .lambda();
