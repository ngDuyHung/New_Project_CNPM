import React, { useState } from 'react';


const dictionaryPage = [
  { word: "Apple", phonetic: "/'ap(ə)l/", meaning: "Quả táo", example: "I have an apple." },
  { word: "Banana", phonetic: "/bə'nanə/", meaning: "Quả chuối", example: "I have a banana." },
  { word: "Crab", phonetic: "/krab/", meaning: "Con cua", example: "I have a crab." },
  { word: "Duck", phonetic: "/dək/", meaning: "Con vịt", example: "I have a duck." },
  { word: "Eleven", phonetic: "/əˈlɛv(ə)n/", meaning: "Mười một", example: "I have eleven apples." },
];

const DictionaryPage = () => {
  const [search, setSearch] = useState("");
  const [selectedWord, setSelectedWord] = useState(null);
  const currentDate = new Date().toLocaleDateString();

  const handleWordClick = (wordData) => {
    setSearch(""); // Clear search field
    setSelectedWord(wordData); // Show selected word details
  };

  const filteredWords = dictionaryPage.filter(({ word }) =>
    word.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6 relative">
      <div className="absolute top-2 left-2 text-left">
        <h1 className="text-sm text-gray-500">TruongNgocDinh</h1>
        <p className="text-sm text-gray-500">{currentDate}</p>
      </div>
      <input
        type="text"
        placeholder="Search vocabulary"
        className="w-full p-3 border border-gray-300 rounded-md mb-3 mt-12"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {!selectedWord && (
        <div className="space-y-2">
          {filteredWords.map(({ word, phonetic, meaning, example }) => (
            <div
              key={word}
              className="p-4 border rounded-md bg-gray-100 cursor-pointer"
              onClick={() => handleWordClick({ word, phonetic, meaning, example })}
            >
              <h3 className="font-semibold flex items-center gap-2">
                <span>{word}</span>
                <span className="text-gray-500">{phonetic} :</span>
                <span className="text-gray-700">{meaning}</span>
              </h3>
              <p className="text-sm text-gray-500 italic">Example: {example}</p>
            </div>
          ))}
        </div>
      )}

      {selectedWord && (
        <div className="mt-4 p-4 border rounded-md bg-white shadow-md">
          <h2 className="text-xl font-bold">{selectedWord.word}</h2>
          <p className="text-gray-500">{selectedWord.phonetic}</p>
          <p className="text-gray-700">{selectedWord.meaning}</p>
          <p className="text-sm text-gray-500 italic">Example: {selectedWord.example}</p>
          <button
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={() => setSelectedWord(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default DictionaryPage; 
