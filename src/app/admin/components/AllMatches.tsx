// components/Layout/Header.js
"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';


// components/Matches/MatchTabs.js
const MatchTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex space-x-4 mb-4">
      <button
        className={`px-4 py-2 rounded-full ${
          activeTab === 'upcoming' ? 'bg-gray-900 text-white' : 'bg-gray-100'
        }`}
        onClick={() => onTabChange('upcoming')}
      >
        Upcoming
      </button>
      <button
        className={`px-4 py-2 rounded-full ${
          activeTab === 'previous' ? 'bg-gray-900 text-white' : 'bg-gray-100'
        }`}
        onClick={() => onTabChange('previous')}
      >
        Previous
      </button>
      <button
        className={`px-4 py-2 rounded-full ${
          activeTab === 'cancelled' ? 'bg-gray-900 text-white' : 'bg-gray-100'
        }`}
        onClick={() => onTabChange('cancelled')}
      >
        Cancelled
      </button>
    </div>
  );
};

// components/Matches/MatchFilters.js
const MatchFilters = ({ onGameTypeChange, onDateChange }) => {
  return (
    <div className="flex space-x-4 mb-4">
      <select 
        className="px-4 py-2 border rounded-md"
        onChange={(e) => onGameTypeChange(e.target.value)}
      >
        <option value="">Game</option>
        <option value="padel">Padel</option>
        <option value="pickleball">Pickleball</option>
      </select>
      
      <input 
        type="date" 
        className="px-4 py-2 border rounded-md"
        onChange={(e) => onDateChange(e.target.value)}
      />
    </div>
  );
};

// components/Matches/MatchList.js
const MatchList = ({ matches }) => {
  return (
    <div className="space-y-2">
      {matches.map((match) => (
        <div key={match.id} className="flex items-center justify-between p-4 bg-white rounded-lg hover:bg-gray-50">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              {/* <img src={match.team1.avatar} className="w-8 h-8 rounded-full" /> */}
              {/* <span>{match.team1.name}</span> */}
              <span>team1 name</span>
            </div>
            <div className="flex items-center space-x-2">
              {/* <img src={match.team2.avatar} className="w-8 h-8 rounded-full" /> */}
              {/* <span>{match.team2.name}</span> */}
              <span>team2 name</span>
            </div>
          </div>
          <div className="flex items-center space-x-8">
            <span>team1 name</span>
            <span>{match.date}</span>
            <span>15-03-2025</span>
            <button className="p-2 text-gray-600 hover:text-gray-900">
              {/* <DotsHorizontalIcon className="w-5 h-5" /> */}
              dot
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// components/Matches/MatchDetails.js
const MatchDetails = ({ match }) => {
  console.log('match: ', match);
  return (
    <div className="bg-white rounded-lg p-6">
      <div className="relative h-48 mb-4">
        <Image 
          src="/padel-court.jpg" 
          alt="Padel Game"
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{match.gameType}</h2>
          <div className="flex items-center space-x-2">
            <span>{match.duration} Mins</span>
            <span>{match.time}</span>
          </div>
        </div>
        
        <div>
          <p className="text-gray-600">Sector 24, Chandigarh</p>
          <div className="flex items-center mt-2">
            <span>Created by</span>
            {/* <img src={match.creator.avatar} className="w-6 h-6 rounded-full ml-2" /> */}
            {/* <span className="ml-2">{match.creator.name}</span> */}
            playaer name
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-gray-600">Players</span>
            <span className="ml-2 font-medium">{match.playerCount}</span>
          </div>
          <div>
            <span className="text-gray-600">Equipment Rented</span>
            <span className="ml-2 font-medium">{match.equipment}</span>
          </div>
          <div>
            <span className="text-gray-600">Paid for</span>
            {/* <span className="ml-2 font-medium">{match.paidFor}</span> */}
            <span className="ml-2 font-medium">52</span>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Players in the game</h3>
          <div className="flex items-center space-x-4">
            {/* {match.players.map((player) => ( */}
              {/* <div key={player.id} className="text-center"> */}
              <div  className="text-center">
                {/* <img src={player.avatar} className="w-12 h-12 rounded-full mx-auto" /> */}
                {/* <span className="text-sm mt-1 block">{player.name}</span> */}
                <span className="text-sm mt-1 block">player2</span>
              </div>
            {/* ))} */}
          </div>
        </div>
        
        <button className="w-full py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800">
          Edit Game
        </button>
      </div>
    </div>
  );
};

// pages/matches.js
// import { Header, MatchTabs, MatchFilters, MatchList, MatchDetails } from '../components';
import { BellIcon, UserIcon } from 'lucide-react';

const MatchesPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [matches, setMatches] = useState([]);

// Fetch matches data from API or database
const fetchMatchesData = async (): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          "id": 1,
          "homeTeam": "Team A",
          "awayTeam": "Team B",
          "matchDate": "2023-03-01T14:00:00.000Z",
          "matchStatus": "upcoming",
          "score": {
            "home": 0,
            "away": 0
          }
        },
        {
          "id": 2,
          "homeTeam": "Team C",
          "awayTeam": "Team D",
          "matchDate": "2023-03-01T16:00:00.000Z",
          "matchStatus": "upcoming",
          "score": {
            "home": 0,
            "away": 0
          }
        },
        {
          "id": 3,
          "homeTeam": "Team E",
          "awayTeam": "Team F",
          "matchDate": "2023-02-28T14:00:00.000Z",
          "matchStatus": "completed",
          "score": {
            "home": 2,
            "away": 1
          }
        },
        {
          "id": 4,
          "homeTeam": "Team G",
          "awayTeam": "Team H",
          "matchDate": "2023-02-27T16:00:00.000Z",
          "matchStatus": "completed",
          "score": {
            "home": 1,
            "away": 2
          }
        }
      ]);
    }, 1000); // simulate API delay
  });
};
useEffect(() => {
  const fetchData = async () => {
    const data = await fetchMatchesData();
    setSelectedMatch(data);
    setMatches(data);
  };

  fetchData();
}, []);


  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Matches</h1>
        
        <MatchTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <MatchFilters 
              onGameTypeChange={(type) => console.log(type)}
              onDateChange={(date) => console.log(date)}
            />
            <MatchList matches={matches} />
          </div>
          
          <div>
            {selectedMatch && <MatchDetails match={selectedMatch} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MatchesPage;