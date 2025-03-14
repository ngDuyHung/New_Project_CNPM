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
}



//   const [searchTerm, setSearchTerm] = useState('');

//   return (
//     <div className="p-3 md:p-5">


//       {/* Search section */}
//       <div className="mb-4">
//         <div className="flex flex-col md:flex-row gap-2">
//           <div className="flex-1">
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search for a word..."
//               className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
//             Search
//           </button>
//         </div>
//         <div className="mt-1 text-sm text-gray-500">
//           Example: adventure, knowledge, experience aaa
//         </div>
//       </div>

//       {/* Dictionary content */}
//       <div>
//         <div>
//           <span>
//             <strong>Word:</strong> adventure
//           </span>
//         </div>
//         <h2 className="text-2xl font-semibold mb-2">Word: adventure</h2>
//         <p>
//           <strong>Part of speech:</strong> noun
//         </p>
//         <p>
//           <strong>Definition:</strong> an unusual and exciting or daring experience
//         </p>
//         <p>
//           <strong>Synonyms:</strong> experience, exploit, escapade, deed, feat, feat, happening
//         </p>
//         <p>
//           <strong>Antonyms:</strong> inactivity, inaction, idleness
//         </p>
//       </div>
//     </div>
//   );
// };

export default DictionaryPage; 