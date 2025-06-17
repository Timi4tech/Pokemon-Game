import React, { Component } from 'react'
import axios from 'axios'
import Fetchcard from './fetchcard'

 class Computer extends Component {
    constructor(props) {
      super(props)
      this.fetchcard = ()=>{

      }
    
      this.state = {
        cards : [],
        hasError: null,
        pickedCard: null
      }
    }
      componentDidMount=()=>{
        setTimeout(()=>{  const fetchcard = async()=>{
           try {
            const ids =  Array.from({length:5},()=>{ return Math.floor(Math.random()*(50-25+1)+25)})
            const fetch = await Promise.all(
                ids.map(id=>axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`))
            )
            const responses = fetch.map(res=>res.data)
            const cardValue =  Array.from({length:5},()=>Math.floor(Math.random()*14)+1)
            const updatedCards = responses.map((card,index)=>({
                ...card,
                value: cardValue[index]
            }))

            this.setState({cards:updatedCards})

        } catch(error){
            this.setState({hasError:`something went wrong`})

        }
      
      
        } 
      fetchcard()},2000)
       
        
        
      }
        removeCard = ()=>{
          setTimeout( ()=>{
           const picked =  this.state.cards.shift()
           const remaining =  this.state.cards.filter(card=>card[picked])
           this.setState({cards:remaining,pickedCard:picked})
        },1000)
    }
  render() {
    const {cards, pickedCard, hasError}=this.state
    return (
      <div><Fetchcard cardz= {cards} pickedCardz={pickedCard} hasErrorz={hasError} removeCardz={this.removeCard}/></div>
    )
  }
}

export default Computer;