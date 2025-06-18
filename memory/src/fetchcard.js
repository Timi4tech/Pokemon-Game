import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './fetchcards.css'
function Fetchcard() {
  const [cards, setCards] = useState([]);
  const [hasError, setHasError] = useState(null);
  const [pickedCard,setPickedCard] =  useState();
  const [userCard,setUserCard] = useState([]);
  const [computerCard,setComputerCard] = useState([])
  const [computerChoice,setComputerChoice]= useState()
  const [computerScore, setComputerScore]= useState(0)
  const [userScore, setUserScore]= useState(0)
  const [message, setMessage]= useState()
  const [roundComplete, setRoundComplete] = useState(false);

  useEffect(() => {
  const ids = Array.from({ length: 10 }, () => Math.floor(Math.random() * 50) + 1);

  const fetchCards = async () => {
    try {
      const responses = await Promise.all(
        ids.map(id => axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`))
      );
      const data = responses.map(res => res.data);
      const cardValue = Array.from({ length: 10 }, () => Math.floor(Math.random() * 14) + 1);
      const updatedCards = data.map((card, index) => ({
        ...card,
        value: cardValue[index]
      }));
      setCards(updatedCards);
    } catch (error) {
      setHasError(error.message);
    }
  };

  fetchCards();
}, []);

useEffect(() => {
  if (cards.length === 10) {
    setUserCard(cards.slice(0, 5));
    setComputerCard(cards.slice(5));
  }
}, [cards]);

const removeCard = (name) => {
  const cardChoice = userCard.find(card => card.name === name);
  setPickedCard(cardChoice);
  setUserCard(prev => prev.filter(card => card.name !== name));
  removeComputerCard();
};

const removeComputerCard = () => {
  setTimeout(() => {
    setComputerCard(prev => {
      const [firstCard, ...rest] = prev; 
      setComputerChoice(firstCard);
      return rest;
    });
  }, 0.500);
};


useEffect(() => {
  if (pickedCard && computerChoice && !roundComplete) {
    setRoundComplete(true); // 🔒 prevent re-triggering this effect

    if (pickedCard.value === computerChoice.value) {
      setMessage("Draw - no winner");
    } else if (pickedCard.value > computerChoice.value) {
      setUserScore(prev => prev + 1);
      setMessage("You won");
    } else {
      setComputerScore(prev => prev + 1);
      setMessage("Computer won");
    }

    setTimeout(() => {
      setMessage(null);
      setPickedCard(null);         // 👈 reset for next round
      setComputerChoice(null);     // 👈 reset for next round
      setRoundComplete(false);     // 🔓 unlock for next round
    }, 2000);
  }
}, [pickedCard, computerChoice, roundComplete]);

 
  return (
    <div className='body'>
      <div className='header'><button >pokemon Games</button></div>
      <div className='group'>
       {computerCard.map((card, index) => (
        <div key={index} className='cards'>
          <div className='item'>
            <img src={card.sprites.front_default}
            alt={card.name} />
          <h5>{card.name}</h5>
          </div>
         </div> 
          
      ))}
      </div>

      <div id='cardchoices'> <div id='picked'  className='item'>{computerChoice && (
        <div>
          <h5>{computerChoice.value}</h5>
          <img src={computerChoice.sprites.front_default} alt={computerChoice.name} />
          <h4> {computerChoice.name}</h4>
        </div>)}</div>
        <div id='score'>
          <div>
            <h5>Computer Score</h5>
            <h2>{computerScore}</h2>
          </div>
          <div id='message'><h2>{message}</h2></div>

          <div>
            <h5>Your Score</h5>
            <h2>{userScore}</h2>
          </div>
        </div>
         <div  id='picked'     className='item'>{pickedCard && (
        <div >
         <h6>{pickedCard.value}</h6>
          <img src={pickedCard.sprites.front_default} alt={pickedCard.name} />
          <h5>{pickedCard.name}</h5>
        </div>)}</div>
        
        </div>
      <div className='group'>
      {userCard.map((card, index) => (
        <div key={index} onClick={() =>{ !pickedCard && removeCard(card.name)}} className='cards'>
          <div className='item'>
            <h6>{card.value}</h6>
            <img src={card.sprites.front_default}
            alt={card.name} />
          <h5>{card.name}</h5>
          </div>
         </div> 
          
      ))}
      </div>
      
      
       
     
     
          
      {hasError && <h1>{hasError}</h1>}
       
      
    </div>
    
   
  );
}
export default Fetchcard;
