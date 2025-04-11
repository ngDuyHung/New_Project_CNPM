import React, { useState, useEffect, useCallback } from 'react';

// Hàm lấy ảnh từ Google
const getGoogleImage = async (searchTerm) => {
  try {
    const API_KEY = 'AIzaSyDZWnwLm6Ql-g3bOdZOqxBQHUDOZVzD0Ik'; // API key của Google
    const CX = '2d618b61a6c5c4016'; // Search Engine ID

    // Thêm từ khóa "illustration" để lấy hình ảnh minh họa đẹp hơn
    const query = `${searchTerm} illustration`;

    // Thử gọi API Google
    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?` +
        `key=${API_KEY}&` +
        `cx=${CX}&` +
        `q=${encodeURIComponent(query)}&` +
        `searchType=image&` +
        `num=1&` +
        `safe=active&` + // Lọc nội dung an toàn
        `imgSize=MEDIUM&` + // Kích thước ảnh vừa phải
        `imgType=clipart` // Ưu tiên hình vẽ minh họa
      );

      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }

      const data = await response.json();
      console.log('Google Image Search Response:', data);

      if (!data.items || data.items.length === 0) {
        throw new Error('No image found');
      }

      return data.items[0].link;
    } catch (error) {
      console.error('Lỗi khi gọi Google API:', error);
      // Nếu không lấy được ảnh từ Google, trả về ảnh mặc định
      return `https://via.placeholder.com/300x300?text=${encodeURIComponent(searchTerm)}`;
    }
  } catch (error) {
    console.error('Lỗi khi lấy ảnh:', error);
    // Trả về ảnh mặc định nếu có lỗi
    return `https://via.placeholder.com/300x300?text=${encodeURIComponent(searchTerm)}`;
  }
};

// Dữ liệu flashcard tĩnh
const flashCardData = [
  { word: 'Apple', meaning: 'Quả táo', image: '' },
  { word: 'Banana', meaning: 'Quả chuối', image: '' },
  { word: 'Orange', meaning: 'Quả cam', image: '' },
  { word: 'Pineapple', meaning: 'Quả dứa', image: '' }
];

// Dữ liệu bài tập điền khuyết
const fillBlankDataStatic = [
  { sentence: 'I have an ___ (fruit).', answer: 'Apple' },
  { sentence: 'He is eating a ___ (yellow fruit).', answer: 'Banana' },
  { sentence: 'She is drinking ___ juice. (fruit)', answer: 'Orange' },
  { sentence: 'This is a tropical fruit, it is ___ (tropical fruit)', answer: 'Pineapple' }
];

// Dữ liệu bài tập luyện nghe
const listeningDataStatic = [
  'Hello, how are you?',
  'Nice to meet you!',
  'What is your favorite color?'
];

// Dữ liệu bài tập luyện viết
const writingDataStatic = [
  { vietnamese: 'Con cáo nhanh nhẹn màu nâu nhảy qua con chó lười biếng.', english: 'The quick brown fox jumps over the lazy dog.' },
  { vietnamese: 'Cô ấy bán vỏ sò biển ở bờ biển.', english: 'She sells seashells by the seashore.' },
  { vietnamese: 'Tôi thích ăn táo và chuối.', english: 'I like eating apples and bananas.' },
  { vietnamese: 'Mặt trời chiếu sáng trên bầu trời xanh.', english: 'The sun shines in the blue sky.' }
];

const PracticePage = () => {
  const [activeFeature, setActiveFeature] = useState(null);
  const [flashCardIndex, setFlashCardIndex] = useState(0);
  const [fillBlankIndex, setFillBlankIndex] = useState(0);
  const [listeningIndex, setListeningIndex] = useState(0);
  const [writingIndex, setWritingIndex] = useState(0);
  const [userWriting, setUserWriting] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [recognizedSpeech, setRecognizedSpeech] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [speakingScore, setSpeakingScore] = useState(0);
  const [correctQuestions, setCorrectQuestions] = useState({
    flashCard: new Set(),
    fillBlank: new Set(),
    listenSpeak: new Set(),
    writing: new Set()
  });

  // State cho các loại bài tập
  const [flashCards, setFlashCards] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [fillBlankData, setFillBlankData] = useState(fillBlankDataStatic);
  // eslint-disable-next-line no-unused-vars
  const [listeningData, setListeningData] = useState(listeningDataStatic);
  // eslint-disable-next-line no-unused-vars
  const [writingData, setWritingData] = useState(writingDataStatic);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sinh bài tập điền khuyết với 4 đáp án (đảm bảo có 3 sai, 1 đúng)
  const generateFillBlankOptions = useCallback(() => {
    try {
      if (!fillBlankData || fillBlankData.length === 0 || fillBlankIndex >= fillBlankData.length) {
        console.error("Không có dữ liệu điền khuyết hoặc index không hợp lệ:", { fillBlankData, fillBlankIndex });
        setOptions([
          { id: 1, word: "Option 1", isCorrect: true },
          { id: 2, word: "Option 2", isCorrect: false },
          { id: 3, word: "Option 3", isCorrect: false },
          { id: 4, word: "Option 4", isCorrect: false }
        ]);
        return;
      }

      // Lấy đáp án đúng từ câu hỏi hiện tại
      const correctAnswer = fillBlankData[fillBlankIndex].answer;
      
      // Tạo danh sách các từ làm đáp án sai
      const possibleWrongAnswers = [
        'is', 'are', 'am', 'was', 'were', 'be', 'being', 'been',
        'do', 'does', 'did', 'done', 'doing',
        'have', 'has', 'had', 'having',
        'go', 'goes', 'went', 'gone', 'going',
        'eat', 'eats', 'ate', 'eaten', 'eating',
        'see', 'sees', 'saw', 'seen', 'seeing',
        'take', 'takes', 'took', 'taken', 'taking',
        'make', 'makes', 'made', 'making',
        'come', 'comes', 'came', 'coming',
        'play', 'plays', 'played', 'playing',
        'run', 'runs', 'ran', 'running',
        'jump', 'jumps', 'jumped', 'jumping',
        'walk', 'walks', 'walked', 'walking',
        'talk', 'talks', 'talked', 'talking'
      ];

      // Lọc bỏ đáp án đúng và lấy 3 đáp án sai ngẫu nhiên
      const wrongAnswers = possibleWrongAnswers
        .filter(word => word.toLowerCase() !== correctAnswer.toLowerCase())
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      // Nếu không đủ 3 đáp án sai, thêm các đáp án mặc định
      const finalWrongAnswers = [...wrongAnswers];
      while (finalWrongAnswers.length < 3) {
        const defaultOptions = ['incorrect', 'wrong', 'false', 'error', 'missing'];
        const randomDefault = defaultOptions[Math.floor(Math.random() * defaultOptions.length)];
        if (!finalWrongAnswers.includes(randomDefault) && 
            randomDefault.toLowerCase() !== correctAnswer.toLowerCase()) {
          finalWrongAnswers.push(randomDefault);
        }
      }

      // Hàm viết hoa chữ cái đầu
      const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
      };

      // Tạo mảng 4 đáp án (1 đúng, 3 sai) với chữ cái đầu viết hoa
      const options = [
        { id: 1, word: capitalizeFirstLetter(correctAnswer), isCorrect: true },
        { id: 2, word: capitalizeFirstLetter(finalWrongAnswers[0]), isCorrect: false },
        { id: 3, word: capitalizeFirstLetter(finalWrongAnswers[1]), isCorrect: false },
        { id: 4, word: capitalizeFirstLetter(finalWrongAnswers[2]), isCorrect: false }
      ];

      // Xáo trộn thứ tự các đáp án
      const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
      
      setOptions(shuffledOptions);
    } catch (error) {
      console.error("Lỗi khi tạo đáp án:", error);
      
      // Fallback nếu có lỗi
      setOptions([
        { id: 1, word: "Option 1", isCorrect: true },
        { id: 2, word: "Option 2", isCorrect: false },
        { id: 3, word: "Option 3", isCorrect: false },
        { id: 4, word: "Option 4", isCorrect: false }
      ]);
    }
  }, [fillBlankData, fillBlankIndex]);

  // Tải dữ liệu flashcard khi component được mount hoặc khi active feature thay đổi
  useEffect(() => {
    const loadFlashcards = async () => {
      if (activeFeature === 'flash-card') {
        setLoading(true);
        try {
          // Tạo flashcard từ dữ liệu tĩnh và thêm ảnh từ Google
          const cardsWithImages = await Promise.all(
            flashCardData.map(async (card) => {
              const imageUrl = await getGoogleImage(card.word);
              return { ...card, image: imageUrl };
            })
          );
          setFlashCards(cardsWithImages);
        } catch (error) {
          console.error('Lỗi khi tải flashcard:', error);
          setError('Không thể tải flashcard. Vui lòng thử lại sau.');
        } finally {
          setLoading(false);
        }
      } else if (activeFeature === 'fill-blank') {
        generateFillBlankOptions();
      }
    };

    loadFlashcards();
  }, [activeFeature, generateFillBlankOptions]);

  // Phát âm khi bấm vào câu luyện nghe
  const handleSpeech = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  // Thêm hàm đếm thời gian
  const startTimer = () => {
    setRecordingTime(0);
    const timer = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    return timer;
  };

  // Thêm hàm kiểm tra kết quả nói
  const checkSpeakingResult = (userSpeech) => {
    const correctAnswer = listeningData[listeningIndex].toLowerCase();
    const userAnswer = userSpeech.toLowerCase();

    // Tính điểm dựa trên độ chính xác
    let score = 0;
    const words = correctAnswer.split(' ');
    const userWords = userAnswer.split(' ');

    // Kiểm tra từng từ
    words.forEach(word => {
      if (userWords.includes(word)) {
        score += 1;
      }
    });

    // Tính tỷ lệ đúng
    const accuracy = (score / words.length) * 100;

    // Tạo thông báo chi tiết
    let message = '';
    if (accuracy >= 80) {
      message = '🎉 Chúc mừng! Bạn đã phát âm rất tốt!\n';
      if (!correctQuestions.listenSpeak.has(listeningIndex)) {
        setCorrectQuestions(prev => ({
          ...prev,
          listenSpeak: new Set([...prev.listenSpeak, listeningIndex])
        }));
        setSpeakingScore(prev => prev + 1);
      }
    } else if (accuracy >= 60) {
      message = '👍 Khá tốt! Bạn đã nói đúng một số từ.\n';
    } else {
      message = '💪 Hãy thử lại! Bạn cần luyện tập thêm.\n';
    }

    message += `\nĐộ chính xác: ${Math.round(accuracy)}%\n`;
    message += `Số từ đúng: ${score}/${words.length}\n`;
    message += `Câu cần nói: ${listeningData[listeningIndex]}`;

    alert(message);
  };

  // Sửa lại hàm startSpeechRecognition
  const startSpeechRecognition = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'en-US';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
        const timer = startTimer();
        recognition.timer = timer;
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setInterimTranscript(interimTranscript);
        if (finalTranscript) {
          setRecognizedSpeech(finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
        clearInterval(recognition.timer);
      };

      recognition.onend = () => {
        setIsRecording(false);
        clearInterval(recognition.timer);
        if (recognizedSpeech) {
          checkSpeakingResult(recognizedSpeech);
        }
      };

      recognition.start();
    } else {
      alert("Sorry, your browser doesn't support speech recognition.");
    }
  };

  // Sửa lại hàm stopRecording
  const stopRecording = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsRecording(false);
    if (recognizedSpeech) {
      checkSpeakingResult(recognizedSpeech);
    }
  };

  // Format thời gian
  const formatTime = (seconds) => {
    return `${seconds}s`;
  };

  // Kiểm tra bài viết
  const checkWriting = () => {
    const correctAnswer = writingData[writingIndex].english.toLowerCase();
    const userAnswer = userWriting.toLowerCase();

    // Tính điểm dựa trên độ chính xác
    let score = 0;
    const words = correctAnswer.split(' ');
    const userWords = userAnswer.split(' ');

    // Kiểm tra từng từ
    words.forEach(word => {
      if (userWords.includes(word)) {
        score += 1;
      }
    });

    // Tính tỷ lệ đúng
    const accuracy = (score / words.length) * 100;

    // Tạo thông báo chi tiết
    let message = '';
    
    if (accuracy >= 80) {
      message = '🎉 Chúc mừng! Bạn đã viết rất tốt!\n';
      if (!correctQuestions.writing.has(writingIndex)) {
        setCorrectQuestions(prev => ({
          ...prev,
          writing: new Set([...prev.writing, writingIndex])
        }));
      }
    } else if (accuracy >= 60) {
      message = '👍 Khá tốt! Bạn đã viết đúng một số từ.\n';
    } else {
      message = '💪 Hãy thử lại! Bạn cần luyện tập thêm.\n';
    }

    message += `\nĐộ chính xác: ${Math.round(accuracy)}%\n`;
    message += `Số từ đúng: ${score}/${words.length}\n`;
    message += `Câu đúng: ${writingData[writingIndex].english}`;

    alert(message);
  };

  const nextQuestion = () => {
    setIsFlipped(false);
    if (activeFeature === 'flash-card') {
      const nextIndex = (flashCardIndex + 1) % flashCards.length;
      setFlashCardIndex(nextIndex);
    } else if (activeFeature === 'fill-blank') {
      const nextIndex = (fillBlankIndex + 1) % fillBlankData.length;
      setFillBlankIndex(nextIndex);
      setSelectedOption(null);
      generateFillBlankOptions();
      
      if (nextIndex === 0) {
        alert(`Chúc mừng! Bạn đã hoàn thành bài tập với ${correctAnswers}/${fillBlankData.length} câu đúng!`);
        setCorrectAnswers(0);
        setCorrectQuestions(prev => ({ ...prev, fillBlank: new Set() }));
      }
    } else if (activeFeature === 'listen-speak') {
      const nextIndex = (listeningIndex + 1) % listeningData.length;
      setListeningIndex(nextIndex);
      setRecognizedSpeech('');
      setInterimTranscript('');
      
      if (nextIndex === 0) {
        alert(`🎉 Chúc mừng! Bạn đã hoàn thành bài tập nói với ${speakingScore}/${listeningData.length} câu đúng!`);
        setSpeakingScore(0);
        setCorrectQuestions(prev => ({ ...prev, listenSpeak: new Set() }));
      }
    } else if (activeFeature === 'writing') {
      const nextIndex = (writingIndex + 1) % writingData.length;
      setWritingIndex(nextIndex);
      setUserWriting('');
      
      if (nextIndex === 0) {
        const correctCount = [...correctQuestions.writing].length;
        alert(`Chúc mừng! Bạn đã hoàn thành bài tập viết với ${correctCount}/${writingData.length} câu đúng!`);
        setCorrectQuestions(prev => ({ ...prev, writing: new Set() }));
      }
    }
  };

  const previousQuestion = () => {
    if (activeFeature === 'flash-card') {
      setFlashCardIndex((prev) => (prev - 1 + flashCards.length) % flashCards.length);
    } else if (activeFeature === 'fill-blank') {
      setFillBlankIndex((prev) => (prev - 1 + fillBlankData.length) % fillBlankData.length);
      setSelectedOption(null); // Reset selected option
      generateFillBlankOptions(); // Tạo lại các tùy chọn ngẫu nhiên
    } else if (activeFeature === 'listen-speak') {
      setListeningIndex((prev) => (prev - 1 + listeningData.length) % listeningData.length);
    } else if (activeFeature === 'writing') {
      setWritingIndex((prev) => (prev - 1 + writingData.length) % writingData.length);
      setUserWriting('');
    }
  };

  // Xử lý khi chọn đáp án
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    
    // Kiểm tra đáp án dựa trên thuộc tính isCorrect - không hiển thị ra ngoài
    if (option.isCorrect) {
      if (!correctQuestions.fillBlank.has(fillBlankIndex)) {
        setCorrectQuestions(prev => ({
          ...prev,
          fillBlank: new Set([...prev.fillBlank, fillBlankIndex])
        }));
        setCorrectAnswers(prev => prev + 1);
      }
    }

    // Đợi một chút rồi chuyển sang câu tiếp theo
    setTimeout(() => {
      // Nếu là câu cuối cùng
      if (fillBlankIndex === fillBlankData.length - 1) {
        // Tính luôn kết quả cuối cùng và hiển thị
        const finalScore = option.isCorrect && !correctQuestions.fillBlank.has(fillBlankIndex) 
          ? correctAnswers + 1 
          : correctAnswers;
          
        // Tính phần trăm độ chính xác
        const accuracy = Math.round((finalScore / fillBlankData.length) * 100);
        
        // Hiển thị thông báo chi tiết hơn
        let message = `🎯 Kết quả cuối cùng: ${finalScore}/${fillBlankData.length} câu đúng\n`;
        message += `📊 Độ chính xác: ${accuracy}%\n\n`;
        
        if (accuracy >= 80) {
          message += '🏆 Tuyệt vời! Bạn đã hoàn thành xuất sắc!';
        } else if (accuracy >= 60) {
          message += '👍 Khá tốt! Hãy tiếp tục luyện tập!';
        } else {
          message += '💪 Cố gắng hơn nữa, bạn sẽ làm tốt hơn lần sau!';
        }
        
        alert(message);
        
        // Reset lại dữ liệu
        setFillBlankIndex(0); // Quay lại câu đầu tiên
        setCorrectAnswers(0);
        setCorrectQuestions(prev => ({ ...prev, fillBlank: new Set() }));
      } else {
        // Chuyển sang câu tiếp theo
        setFillBlankIndex(prev => prev + 1);
      }
      setSelectedOption(null);
      generateFillBlankOptions();
    }, 500); // Giảm thời gian chờ xuống
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
                {loading ? (
                  <div className="text-center py-4">Đang tải...</div>
                ) : error ? (
                  <div>
                    <p className="text-red-500 mb-2">{error}</p>
                    <button
                      onClick={() => {
                        setActiveFeature('flash-card');
                        setFlashCardIndex(0);
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                      Thử lại
                    </button>
                  </div>
                ) : flashCards.length > 0 ? (
                  <>
                    <p className="text-gray-600 mb-4">Câu {flashCardIndex + 1}/{flashCards.length}</p>
                    <div
                      className="relative h-[400px] cursor-pointer"
                      style={{ perspective: '1000px' }}
                      onClick={() => setIsFlipped(!isFlipped)}
                    >
                      <div
                        className={`relative w-full h-full transition-transform duration-500`}
                        style={{
                          transformStyle: 'preserve-3d',
                          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                        }}
                      >
                        <div
                          className="absolute w-full h-full bg-blue-100 rounded-lg shadow-lg flex flex-col items-center justify-center p-8"
                          style={{ backfaceVisibility: 'hidden' }}
                        >
                          {flashCards[flashCardIndex].image && (
                            <img
                              src={flashCards[flashCardIndex].image}
                              alt={flashCards[flashCardIndex].word}
                              className="w-48 h-48 object-cover rounded-lg mb-4"
                            />
                          )}
                          <p className="text-2xl font-bold">{flashCards[flashCardIndex].word}</p>
                        </div>
                        <div
                          className="absolute w-full h-full bg-green-100 rounded-lg shadow-lg flex flex-col items-center justify-center p-8"
                          style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)'
                          }}
                        >
                          {flashCards[flashCardIndex].image && (
                            <img
                              src={flashCards[flashCardIndex].image}
                              alt={flashCards[flashCardIndex].word}
                              className="w-48 h-48 object-cover rounded-lg mb-4"
                            />
                          )}
                          <p className="text-2xl font-bold">{flashCards[flashCardIndex].meaning}</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    Không có flashcard nào
                  </div>
                )}
              </div>
            )}

            {activeFeature === 'fill-blank' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Điền Khuyết</h2>
                <p className="text-gray-600 mb-4">Câu {fillBlankIndex + 1}/{fillBlankData.length}</p>
                <p className="text-green-600 font-semibold mb-2">Số câu đúng: {correctAnswers}/{fillBlankData.length}</p>
                <p className="mb-2">{fillBlankData[fillBlankIndex].sentence}</p>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  {options.map((option, index) => (
                    <button
                      key={option.id || index}
                      className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-normal"
                      style={{ fontWeight: 'normal' }}
                      onClick={() => handleOptionClick(option)}
                      disabled={selectedOption !== null}
                    >
                      {option.word}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeFeature === 'listen-speak' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Luyện Nghe & Nói</h2>
                <p className="text-gray-600 mb-4">Câu {listeningIndex + 1}/{listeningData.length}</p>
                <p className="text-green-600 font-semibold mb-2">Số câu đúng: {speakingScore}/{listeningData.length}</p>
                <p className="text-lg font-semibold mb-4">{listeningData[listeningIndex]}</p>

                <div className="flex justify-center gap-4 mb-4">
                  <button
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:opacity-80 transition duration-200"
                    onClick={() => handleSpeech(listeningData[listeningIndex])}
                  >
                    Lặp lại
                  </button>

                  {!isRecording ? (
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:opacity-80 transition duration-200"
                      onClick={startSpeechRecognition}
                    >
                      Bắt đầu nói
                    </button>
                  ) : (
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:opacity-80 transition duration-200"
                      onClick={stopRecording}
                    >
                      Dừng
                    </button>
                  )}
                </div>

                {isRecording && (
                  <div className="text-center mb-4">
                    <p className="text-xl font-bold text-red-500">{formatTime(recordingTime)}</p>
                  </div>
                )}

                {(interimTranscript || recognizedSpeech) && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                    <p className="text-gray-600 mb-2">Bạn nói:</p>
                    {interimTranscript && (
                      <p className="text-blue-500 italic">{interimTranscript}</p>
                    )}
                    {recognizedSpeech && (
                      <p className="text-green-600 font-medium">{recognizedSpeech}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeFeature === 'writing' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Luyện Viết</h2>
                <p className="text-gray-600 mb-4">Câu {writingIndex + 1}/{writingData.length}</p>
                <p className="text-lg font-semibold mb-2">Viết câu tiếng Anh tương ứng:</p>
                <p className="text-blue-600 mb-4">{writingData[writingIndex].vietnamese}</p>
                <textarea
                  className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  value={userWriting}
                  onChange={(e) => setUserWriting(e.target.value)}
                  placeholder="Nhập câu tiếng Anh của bạn..."
                ></textarea>
                <button
                  onClick={checkWriting}
                  className="bg-amber-500 text-white px-4 py-2 rounded-lg mt-2 hover:opacity-80 transition duration-200"
                >
                  Kiểm tra
                </button>
              </div>
            )}

            <div className="flex justify-between mt-4">
              {activeFeature !== 'fill-blank' && (
                <>
                  <button className="bg-gray-400 text-white px-4 py-2 rounded-lg" onClick={previousQuestion}>Quay lại</button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={nextQuestion}>Tiếp tục</button>
                </>
              )}
              {activeFeature === 'fill-blank' && (
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg mx-auto" onClick={() => setActiveFeature(null)}>Đóng</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticePage;


