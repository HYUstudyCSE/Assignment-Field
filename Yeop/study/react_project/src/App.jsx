import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import RandomPokemon from "./RandomPokemon";
import Slots from './Slots';
import PropertyList from './PropertyList';
import Clicker from './Clicker';

const properties = [
  { id: 129031, name: "Desert Yurt", rating: 4.9, price: 150},
  { id: 129331, name: "Lone Mountain Cabin", rating: 4.8, price: 250}
]

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/*<RandomPokemon/>*/}

      {/*<Slots val1="1" val2="1" val3="1"/>
      <Slots val1="0" val2="1" val3="1"/>*/}

      {/*<PropertyList properties = {properties}/>*/}

      <Clicker message="HI" buttonText="Click me!"/>
    </>
  )
}
