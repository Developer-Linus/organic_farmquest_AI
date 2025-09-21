import {generateText } from 'ai'
// import the Google module from ai-sdk package
import { google } from "@ai-sdk/google"

// Specify the model for generating text and a prompt
const {text} = await generateText({
    model: google('models/gemini-2.5-flash'),
    prompt: 'Write a short story about organic vegetable farming using rabbit manure. Use a simple and engaging language.'
})
console.log(text)