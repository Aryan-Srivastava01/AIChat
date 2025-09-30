import React from 'react';
import './App.css'
import ImageGenerator from '../src/components/ImageGenerator';
import ChatGenerator from './components/ChatGenerator';

function App() {
  

  return (
    <>
      <h1 style={{textAlign:"center"}}>Image Generator</h1>
      <ImageGenerator />
      <hr/>
      <ChatGenerator />
    </>
  )
}

export default App
