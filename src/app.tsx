import React, { FC, useState, useEffect } from 'react';
import { render } from 'react-dom';
import codes from './codes';
import styled from '@emotion/styled';
import * as _ from 'lodash';

const flagsIcons = require('./assets/flags/**.png');

// Converted from https://mickydore.medium.com/the-dobble-algorithm-b9c9018afc52
const generateCards = (order: number) => {
  let i: number, j: number, k: number;
  let n = order ;                //order of plane, must be a prime number
  let numOfSymbols = n + 1; //order of plane + 1
  let cards: number[][] = []; //the deck of cards
  let card: number[] = []; //the current card we are building
  //to start, we build the first card
  for (i = 1; i<= n+1; i++) {
      card.push(i)
  }
  cards.push(card)
  //then we build the next n number of cards
  for (j=1; j<=n; j++) {
      card = []
      card.push(1)
      
      for (k=1; k<=n; k++) {
          card.push(n * j + (k+1))
      }
      cards.push(card)
  }
  //finally we build the next n² number of cards
  for (i= 1; i<=n; i++) {
      for (j=1; j<=n; j++) {
          card = []
          card.push(i+1)
          
          for (k=1; k<= n; k++) {
              card.push(n+2+n*(k-1)+(((i-1)*(k-1)+j-1)%n))
          }
          cards.push(_.shuffle(card))
      }
  }
  return cards;
}

interface CardProps {
  card: number[];
  flags: string[];
  onFlagClick: (value: number) => void;
}

const CardHolder = styled.div((props: any) => {
  return {
    display: 'flex',
    justifyContent: 'space-evenly',
    width: '100%',
    height: '100%',
    paddingTop: '100px',
    paddingBottom: '100px',
    borderBottom: '1px solid grey'
  }
});

const FlagImage = styled.img(() => {
  let [rotation] = useState(Math.floor(Math.random() * 30) - 15);
  return {
    border: '1px solid grey',
    transform: 'rotate('+rotation+'deg)',
    maxWidth: '90%',
    cursor: 'pointer'

  }
});

const FlagHolder = styled.div(() => {
  return {
    flexGrow: 1,
    display: 'flex',
  }
});

const Card: FC<CardProps> = (props: CardProps) => {
  return <CardHolder>
            {_.map(props.card, (value) => {
              let flagCode = props.flags[value-1];
              let countryName = codes[flagCode];
              let size = Math.floor(Math.random() * 10) + 50;
              return <FlagHolder key={value} onClick={() => {
                props.onFlagClick(value);
              }}>
                  <FlagImage key={value}
                    src={flagsIcons[flagCode]}
                    title={countryName}
                    alt={countryName}/>
                  </FlagHolder>
            })}
        </CardHolder> 
};



const Message = styled.div(() => {
  return {
    fontFamily: 'Arial',
    fontSize: '28px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  }
});

const NextHolder = styled.div(() =>  {
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingTop: '8px'
  }
});

const WhatIsThis = styled.div(() =>  {
  return {
    width: '100%',
    height: '100%',
    background: '#2A9D8F',
    fontFamily: 'Arial'
  }
});
const Next = styled.div(() =>  {
  return {
    background: '#264653',
    fontFamily: 'Arial',
    fontSize: '28px',
    borderRadius: '4px',
    padding: '4px',
    margin: '4px',
    color: '#FFFFFF',
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.8
    }

  }
});

const App: FC = () => {
  let [message, setMessage] = useState('');

  let [order, setOrder] = useState(7);

  let [cards, setCards] = useState(generateCards(order));
  let [flags, setFlags] = useState(_.sampleSize(Object.keys(codes), Math.pow(order, 2) + order + 1));

  useEffect(() => {
    console.log('cards changed');
    setFlags(_.sampleSize(Object.keys(codes), Math.pow(order, 2) + order + 1));
    setChosenTwoCards(_.sampleSize(cards, 2));
  }, [cards]);

  useEffect(async () => {
    await setCards(generateCards(order));

    return;
  }, [order]);

  let [chosenTwoCards, setChosenTwoCards] = useState(_.sampleSize(cards, 2));
 
  return <div>
    {
     _.map(chosenTwoCards, (card, index) => {
        return <Card key={index} onFlagClick={async(value) => {

          if (_.includes(chosenTwoCards[0], value) && _.includes(chosenTwoCards[1], value)) {
            console.log("Correct");
            setMessage("Correct! It is " + codes[flags[value-1]]);
          } else { 
            setMessage("Nope, that is " + codes[flags[value-1]]);
          }
          console.log(value, flags[value-1], codes[flags[value-1]]);
        }} card={card} flags={flags} />
        
      })
    }
    <NextHolder><Next onClick={() => {
      setCards(generateCards(order));
      setMessage('');
    }}>Next</Next></NextHolder>
    <Message>{message}</Message>
    <NextHolder>
    {_.map([3,5,7,11], (num) => {
      return <Next key={num} onClick={() => {
        setOrder(num);
        setMessage('')
      }}>{num+1}</Next>
    })}
    </NextHolder>
    <WhatIsThis>
      <h2>What is this?</h2>
      This is a game where you have to find the matching flag between the two rows. Sounds easy, but can be tricky.
      Bonus points if you know what flag it is. Clicking on the flag will tell you if you are correct and also reveal its name.
      Intended to be played alone or in a group as a social game.
      <h2>Why is this?</h2>
      I saw Matt Parker's <a href="https://www.youtube.com/watch?v=VTDKqW_GLkw">video</a> about the game of <a href='https://www.dobblegame.com/en/homepage/'>Dobble</a> and wanted to make a quick web game similar to it.

      I read <a href="https://mickydore.medium.com/the-dobble-algorithm-b9c9018afc52">this</a> awesome blog and borrowed their algorithm to generate the cards. Instead of using icons of pictures, I decided to use country flags for even more academic value.
      I got the list of flag icons from <a href="https://flagpedia.net/download/icons">Flagpedia.net</a>

      <h2>How is this?</h2>
      This is a very basic hacked together React app that can be hosted on a simple static site. Nothing fancy, and it is currently very utilitarian a.k.a. not pretty but works. Future refinements may be done.
      Some of the countries have been removed from the list, because they are quite small and obscure. Sorry if you are from there! They may be added again in the future, or even more removed.
    </WhatIsThis>

  </div>;
};


window.addEventListener('load', async () => {
  render(<App />, document.getElementById('app'));
});
