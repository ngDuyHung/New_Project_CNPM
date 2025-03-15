import React, { useState } from 'react';

// Dữ liệu từ vựng
const flashCardData = [
  { word: 'Apple', meaning: 'Quả táo' },
  { word: 'Banana', meaning: 'Quả chuối' },
  { word: 'Orange', meaning: 'Quả cam' },
  { word: 'Grapes', meaning: 'Nho' },
  { word: 'Pineapple', meaning: 'Dứa' }
];

// Dữ liệu bài tập điền khuyết
const fillBlankData = [
  { sentence: 'I have an ___ (fruit).', answer: 'apple' },
  { sentence: 'He is eating a ___ (yellow fruit).', answer: 'banana' },
  { sentence: 'She is drinking ___ juice. (fruit)', answer: 'orange' },
  { sentence: 'This is a tropical fruit, it is ___ (tropical fruit)', answer: 'pineapple' }
];

// Dữ liệu bài tập luyện nghe
const listeningData = [
  'Hello, how are you?',
  'Nice to meet you!',
  'What is your favorite color?'
];

// Dữ liệu bài tập luyện viết
const writingData = [
  'The quick brown fox jumps over the lazy dog.',
  'She sells seashells by the seashore.'
];

const PracticePage = () => {
  const [activeFeature, setActiveFeature] = useState(null);
  const [flashCardIndex, setFlashCardIndex] = useState(0);
  const [fillBlankIndex, setFillBlankIndex] = useState(0);
  const [listeningIndex, setListeningIndex] = useState(0);
  const [writingIndex, setWritingIndex] = useState(0);
  const [fillBlankAnswer, setFillBlankAnswer] = useState('');
  const [userWriting, setUserWriting] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isListening, setIsListening] = useState(false);
  const [recognizedSpeech, setRecognizedSpeech] = useState('');
  const [options, setOptions] = useState([]); // Options for fill-in-the-blank
  const [selectedOption, setSelectedOption] = useState(null); // Track the selected option for fill-in-the-blank

  // Phát âm khi bấm vào câu luyện nghe
  const handleSpeech = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };
  
  // Sử dụng Web Speech API để nhận diện giọng nói
  const startSpeechRecognition = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'en-US'; // Ngôn ngữ nhận diện là tiếng Anh
      recognition.interimResults = false; // Không cần nhận diện tạm thời
      recognition.maxAlternatives = 1; // Chỉ lấy kết quả tốt nhất

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const result = event.results[0][0].transcript; // Kết quả nhận diện giọng nói
        setRecognizedSpeech(result); // Cập nhật kết quả nhận diện
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error); // In lỗi nếu có
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start(); // Bắt đầu nhận diện giọng nói
    } else {
      alert("Sorry, your browser doesn't support speech recognition.");
    }
  };

  // Kiểm tra bài tập điền khuyết
  const checkFillBlank = () => {
    alert(fillBlankAnswer.toLowerCase() === fillBlankData[fillBlankIndex].answer ? 'Đúng rồi!' : 'Sai, thử lại!');
  };

  // Kiểm tra bài viết
  const checkWriting = () => {
    alert(userWriting.toLowerCase() === writingData[writingIndex].toLowerCase() ? 'Viết đúng!' : 'Có lỗi chính tả!');
  };

  // Sinh bài tập ngẫu nhiên
  const generateFillBlankOptions = () => {
    const randomWords = flashCardData
      .sort(() => Math.random() - 0.5) // Xáo trộn danh sách
      .slice(0, 4); // Chọn 4 từ ngẫu nhiên
    setOptions(randomWords);
  };

  const nextQuestion = () => {
    setIsFlipped(false);
    if (activeFeature === 'flash-card') {
      setFlashCardIndex((prev) => (prev + 1) % flashCardData.length);
    } else if (activeFeature === 'fill-blank') {
      setFillBlankIndex((prev) => (prev + 1) % fillBlankData.length);
      setFillBlankAnswer('');
      setSelectedOption(null); // Reset selected option
      generateFillBlankOptions(); // Tạo lại các tùy chọn ngẫu nhiên
    } else if (activeFeature === 'listen-speak') {
      setListeningIndex((prev) => (prev + 1) % listeningData.length);
    } else if (activeFeature === 'writing') {
      setWritingIndex((prev) => (prev + 1) % writingData.length);
      setUserWriting('');
    }
  };

  const previousQuestion = () => {
    if (activeFeature === 'flash-card') {
      setFlashCardIndex((prev) => (prev - 1 + flashCardData.length) % flashCardData.length);
    } else if (activeFeature === 'fill-blank') {
      setFillBlankIndex((prev) => (prev - 1 + fillBlankData.length) % fillBlankData.length);
      setFillBlankAnswer('');
      setSelectedOption(null); // Reset selected option
      generateFillBlankOptions(); // Tạo lại các tùy chọn ngẫu nhiên
    } else if (activeFeature === 'listen-speak') {
      setListeningIndex((prev) => (prev - 1 + listeningData.length) % listeningData.length);
    } else if (activeFeature === 'writing') {
      setWritingIndex((prev) => (prev - 1 + writingData.length) % writingData.length);
      setUserWriting('');
    }
  };

  // Xử lý chọn từ vựng điền vào chỗ trống
  const handleOptionClick = (option) => {
    setSelectedOption(option); // Set the selected option to highlight
    setFillBlankAnswer(option.word);
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Practice Your English</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {[{ id: 'flash-card', title: 'Flash Card', color: 'bg-blue-600' },
          { id: 'fill-blank', title: 'Điền Khuyết', color: 'bg-green-600' },
          { id: 'listen-speak', title: 'Luyện Nghe & Nói', color: 'bg-purple-600' },
          { id: 'writing', title: 'Luyện Viết', color: 'bg-amber-600' }].map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className={`h-40 ${item.color} flex items-center justify-center`}>
              <h2 className="text-2xl font-bold text-white">{item.title}</h2>
            </div>
            <div className="p-6">
              <button 
                onClick={() => {
                  setActiveFeature(item.id);
                  if (item.id === 'fill-blank') {
                    generateFillBlankOptions(); // Sinh bài tập điền khuyết ngẫu nhiên khi bắt đầu
                  }
                }}
                className={`px-4 py-2 ${item.color} text-white rounded-lg hover:opacity-80 transition duration-200`}
              >
                Bắt đầu
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeFeature && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative">
            <button className="absolute top-2 right-2 text-gray-600" onClick={() => setActiveFeature(null)}>✖</button>

            {activeFeature === 'flash-card' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Flash Card</h2>
                <div 
                  className="p-4 border rounded-lg cursor-pointer" 
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  {isFlipped ? flashCardData[flashCardIndex].meaning : flashCardData[flashCardIndex].word}
                </div>
              </div>
            )}

            {activeFeature === 'fill-blank' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Điền Khuyết</h2>
                <p className="mb-2">{fillBlankData[fillBlankIndex].sentence}</p>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  {options.map((option, index) => (
                    <button 
                      key={index} 
                      className={`p-2 rounded-lg hover:bg-gray-300 ${
                        selectedOption && selectedOption.word === option.word ? 'bg-blue-300' : 'bg-gray-200'
                      }`}
                      onClick={() => handleOptionClick(option)}
                    >
                      {option.word}
                    </button>
                  ))}
                </div>

                <button onClick={checkFillBlank} className="bg-green-500 text-white px-4 py-2 rounded-lg ml-2">Kiểm tra</button>
              </div>
            )}

            {activeFeature === 'listen-speak' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Luyện Nghe & Nói</h2>
                <p>{listeningData[listeningIndex]}</p>

                <button
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg mt-2"
                  onClick={() => handleSpeech(listeningData[listeningIndex])}
                >
                  Lặp lại
                </button>

                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2"
                  onClick={startSpeechRecognition}
                >
                  Nói
                </button>

                {recognizedSpeech && (
                  <p className="mt-2">Bạn nói: {recognizedSpeech}</p>
                )}
              </div>
            )}

            {activeFeature === 'writing' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Luyện Viết</h2>
                <p className="mb-2">Viết lại câu: {writingData[writingIndex]}</p>
                <textarea className="border p-2 w-full" rows="3" value={userWriting} onChange={(e) => setUserWriting(e.target.value)}></textarea>
                <button onClick={checkWriting} className="bg-amber-500 text-white px-4 py-2 rounded-lg mt-2">Kiểm tra</button>
              </div>
            )}

            <div className="flex justify-between mt-4">
              <button className="bg-gray-400 text-white px-4 py-2 rounded-lg" onClick={previousQuestion}>Quay lại</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={nextQuestion}>Tiếp tục</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticePage;



