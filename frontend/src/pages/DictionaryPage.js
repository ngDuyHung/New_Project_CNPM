import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';

const DictionaryPage = () => {
  const [search, setSearch] = useState("");
  const [selectedWord, setSelectedWord] = useState(null);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const currentDate = new Date().toLocaleDateString();

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/api/vocabulary/GetAll');
      const processedData = Array.isArray(response.data) ? response.data : [];
      setWords(processedData);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu từ vựng:', error);
      setError('Không thể tải dữ liệu từ vựng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleWordClick = (wordData) => {
    setSearch("");
    setSelectedWord(wordData);
    setIsPlaying(false);
  };

  const playGoogleTTS = (text, lang = 'en') => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => {
      console.error('Lỗi phát âm thanh');
      setIsPlaying(false);
    };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handlePlaySound = () => {
    playGoogleTTS(selectedWord.word);
  };

  const filteredWords = words.filter((item) => {
    if (!item || !item.word) return false;
    return item.word.toLowerCase().includes(search.toLowerCase());
  }).sort((a, b) => {
    return a.word.toLowerCase().localeCompare(b.word.toLowerCase());
  });

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center text-lg">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center text-red-500">{error}</div>
        <button
          onClick={fetchWords}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 relative">
      <div className="absolute top-2 left-2 text-left">
        <h1 className="text-sm text-gray-500">TruongNgocDinh</h1>
        <p className="text-sm text-gray-500">{currentDate}</p>
      </div>
      <input
        type="text"
        placeholder="Tìm kiếm từ vựng"
        className="w-full p-3 border border-gray-300 rounded-md mb-3 mt-12"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {!selectedWord && (
        <div className="space-y-2">
          {filteredWords.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              Không tìm thấy từ vựng nào phù hợp
            </div>
          ) : (
            filteredWords.map((item) => (
              <div
                key={item.word_id}
                className="p-4 border rounded-md bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleWordClick(item)}
              >
                <h3 className="font-semibold">{item.word}</h3>
                <p className="text-gray-500">{item.pronunciation || ''}</p>
                <p className="text-gray-700">{item.meaning}</p>
              </div>
            ))
          )}
        </div>
      )}

      {selectedWord && (
        <div className="mt-4 p-4 border rounded-md bg-white shadow-md">
          <div className="flex items-center gap-4">
            <img
              src={selectedWord.image_path}
              alt={selectedWord.word}
              className="w-24 h-24 object-cover rounded-md"
            />
            <div>
              <h2 className="text-xl font-bold">{selectedWord.word}</h2>
              <p className="text-gray-500 mt-2">{selectedWord.pronunciation || ''}</p>
              <p className="text-gray-700 mt-1">{selectedWord.meaning}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={handlePlaySound}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                isPlaying ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              disabled={isPlaying}
            >
              {isPlaying ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M4.5 12h4m6 0h4M8 10v4l4-2-4-2z"
                    />
                  </svg>
                  <span>Phát âm</span>
                </>
              )}
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              onClick={() => setSelectedWord(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DictionaryPage;
