import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';

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

// Dữ liệu bài tập điền khuyết
const fillBlankData = [
  { sentence: 'I have an ___ (fruit).', answer: 'Apple' },
  { sentence: 'He is eating a ___ (yellow fruit).', answer: 'Banana' },
  { sentence: 'She is drinking ___ juice. (fruit)', answer: 'Orange' },
  { sentence: 'This is a tropical fruit, it is ___ (tropical fruit)', answer: 'Pineapple' }
];

// Dữ liệu bài tập luyện nghe
const listeningData = [
  'Hello, how are you?',
  'Nice to meet you!',
  'What is your favorite color?'
];

// Dữ liệu bài tập luyện viết
const writingData = [
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
  const [fillBlankAnswer, setFillBlankAnswer] = useState('');
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

  // State cho flashcard
  const [flashCards, setFlashCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Gọi API khi component mount hoặc khi chọn tính năng flashcard
  useEffect(() => {
    let isSubscribed = true;

    const getFlashcards = async () => {
      if (activeFeature !== 'flash-card') return;

      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          setError('Vui lòng đăng nhập để xem flashcard');
          return;
        }

        const response = await axiosInstance.get('/api/exercises/topic/1', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            type: 'flashcard'
          }
        });

        if (!isSubscribed) return;

        console.log('API Response:', response.data);

        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          // Tìm exercise có type là flashcard
          const flashcardExercise = response.data.data.find(ex => ex.type === 'flashcard');
          console.log('Found flashcard exercise:', flashcardExercise);

          if (flashcardExercise && Array.isArray(flashcardExercise.details)) {
            const formattedData = await Promise.all(flashcardExercise.details.map(async card => {
              // Lấy ảnh từ Google cho mỗi từ
              const imageUrl = await getGoogleImage(card.eng_word);
              return {
                word: card.eng_word || '',
                meaning: card.vie_word || '',
                image: imageUrl || card.image_url || '' // Sử dụng ảnh từ Google hoặc fallback về ảnh từ database
              };
            }));

            console.log('Formatted data:', formattedData);

            if (formattedData.length > 0) {
              setFlashCards(formattedData);
              setFlashCardIndex(0);
            } else {
              setError('Không có dữ liệu flashcard.');
            }
          } else {
            setError('Không tìm thấy bài tập flashcard.');
          }
        } else {
          setError('Không có dữ liệu từ API.');
        }
      } catch (error) {
        if (!isSubscribed) return;
        console.error('Lỗi khi lấy dữ liệu flashcard:', error);
        if (error.response?.status === 401) {
          setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        } else {
          setError('Không thể tải dữ liệu flashcard. Vui lòng thử lại sau.');
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    getFlashcards();

    return () => {
      isSubscribed = false;
    };
  }, [activeFeature]); // Chỉ chạy lại khi activeFeature thay đổi

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

  // Kiểm tra bài tập điền khuyết
  const checkFillBlank = () => {
    if (!correctQuestions.fillBlank.has(fillBlankIndex)) {
      const isCorrect = fillBlankAnswer === fillBlankData[fillBlankIndex].answer;
      if (isCorrect) {
        setCorrectQuestions(prev => ({
          ...prev,
          fillBlank: new Set([...prev.fillBlank, fillBlankIndex])
        }));
        setCorrectAnswers(prev => prev + 1);
        alert('Chính xác! 🎉');
      } else {
        alert('Sai rồi! Hãy thử lại!');
      }
    } else {
      alert('Bạn đã trả lời đúng câu này rồi!');
    }
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

  // Sinh bài tập ngẫu nhiên
  const generateFillBlankOptions = () => {
    // Lấy từ đúng cho câu hiện tại
    const correctWord = fillBlankData[fillBlankIndex].answer;

    // Lọc ra các từ khác (không phải từ đúng)
    const otherWords = flashCards
      .filter(word => word.word !== correctWord)
      .sort(() => Math.random() - 0.5) // Xáo trộn danh sách
      .slice(0, 3); // Chọn 3 từ ngẫu nhiên khác

    // Kết hợp từ đúng với các từ ngẫu nhiên và xáo trộn lại
    const allOptions = [...otherWords, { word: correctWord }]
      .sort(() => Math.random() - 0.5);

    setOptions(allOptions);
  };

  const nextQuestion = () => {
    setIsFlipped(false);
    if (activeFeature === 'flash-card') {
      setFlashCardIndex((prev) => (prev + 1) % flashCards.length);
    } else if (activeFeature === 'fill-blank') {
      setFillBlankIndex((prev) => (prev + 1) % fillBlankData.length);
      setFillBlankAnswer('');
      setSelectedOption(null);
      generateFillBlankOptions();
      if (fillBlankIndex === fillBlankData.length - 1) {
        alert(`Chúc mừng! Bạn đã hoàn thành bài tập với ${correctAnswers}/${fillBlankData.length} câu đúng!`);
        setCorrectAnswers(0);
        setCorrectQuestions(prev => ({ ...prev, fillBlank: new Set() }));
      }
    } else if (activeFeature === 'listen-speak') {
      setListeningIndex((prev) => (prev + 1) % listeningData.length);
      setRecognizedSpeech('');
      setInterimTranscript('');
      if (listeningIndex === listeningData.length - 1) {
        alert(`🎉 Chúc mừng! Bạn đã hoàn thành bài tập nói với ${speakingScore}/${listeningData.length} câu đúng!`);
        setSpeakingScore(0);
        setCorrectQuestions(prev => ({ ...prev, listenSpeak: new Set() }));
      }
    } else if (activeFeature === 'writing') {
      setWritingIndex((prev) => (prev + 1) % writingData.length);
      setUserWriting('');
      if (writingIndex === writingData.length - 1) {
        setCorrectQuestions(prev => ({ ...prev, writing: new Set() }));
      }
    }
  };

  const previousQuestion = () => {
    if (activeFeature === 'flash-card') {
      setFlashCardIndex((prev) => (prev - 1 + flashCards.length) % flashCards.length);
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
    setFillBlankAnswer(option.word); // Giữ nguyên chữ hoa
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
                      key={index}
                      className={`p-2 rounded-lg hover:bg-gray-300 ${selectedOption && selectedOption.word === option.word ? 'bg-blue-300' : 'bg-gray-200'
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






