import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { useSearchParams } from 'react-router-dom';




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
  const [topic_Id, setTopicId] = useState(null); // State để lưu topic_id
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
  const [listeningData, setListeningData] = useState([]); // State để lưu dữ liệu bài tập luyện nói
  const [writingData, setWritingData] = useState([]); // State để lưu dữ liệu bài tập luyện viết
  
  const[exercise_Id, setExerciseId] = useState(null); // ID của exercise bài tập
  const [topic_Name, setTopicName] = useState(null); // Tên chủ đề bài tập
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
  const topicId = 1; // Example topic ID

  // State cho điền khuyết
  const [fillBlankData, setFillBlankData] = useState([]); // State để lưu dữ liệu bài tập điền khuyết


  useEffect(() => {
    const fetchFillBlankData = async () => {
      if (activeFeature !== 'fill-blank') return;
    
      try {
        setLoading(true);
        setError(null);
    
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Vui lòng đăng nhập để xem bài tập điền khuyết');
          setLoading(false);
          return;
        }
    
        // Gọi API để lấy dữ liệu bài tập điền khuyết
        const response = await axiosInstance.get(`/api/exercises/topic/${topic_Id}/dienkhuyet`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
    
        console.log('Response Data:', response.data);
        setExerciseId(response.data.data[0]?.id); // Lưu exercise_Id từ response
        
        const details = response.data.data[0]?.details;
        console.log('Details:', response.data.data[0]?.details);
        if (!Array.isArray(details) || details.length === 0) {
          console.warn('Không có dữ liệu chi tiết trong bài tập điền khuyết.');
          setError('Không có dữ liệu bài tập điền khuyết.');
          return;
        }
    
        const formattedData = details.map(exercise => ({
          sentence: exercise.sentence,
          correctAnswer: exercise.correct_answer,
          options: [
            exercise.answer1,
            exercise.answer2,
            exercise.answer3,
            exercise.correct_answer
          ].sort(() => Math.random() - 0.5) // Xáo trộn các đáp án
        }));
    
        console.log('Formatted Data:', formattedData);
        setFillBlankData(formattedData); // Cập nhật state với dữ liệu đã xử lý
        setFillBlankIndex(0); // Đặt câu hỏi đầu tiên
        console.log('fillBlankData:', formattedData); // Log dữ liệu để kiểm tra
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu bài tập điền khuyết:', error);
        if (error.response) {
          const { status, data } = error.response;
          if (status === 401) {
            setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            localStorage.removeItem('token');
            setTimeout(() => {
              window.location.href = '/login';
            }, 2000);
          } else if (status === 404) {
            setError('Không tìm thấy bài tập.');
          } else {
            setError(data.message || 'Không thể tải dữ liệu bài tập. Vui lòng thử lại sau.');
          }
        } else {
          setError('Không thể kết nối đến server. Vui lòng thử lại sau.');
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchFillBlankData();
  }, [activeFeature, topic_Id]);

  useEffect(() => {
    if (activeFeature === 'fill-blank' && fillBlankData.length > 0) {
      generateFillBlankOptions();
    }
  }, [activeFeature, fillBlankData]);

  

// Lấy topic_id từ localStorage khi component được mount
useEffect(() => {
  const storedTopic = localStorage.getItem('currentTopic');
  if (storedTopic) {
    const parsedTopic = JSON.parse(storedTopic);
    setTopicId(parsedTopic.topic_id); // Lấy topic_id từ localStorage
    setTopicName(parsedTopic.topic_name); // Lấy topic_name từ localStorage
  } else {
    console.error('No topic found in localStorage');
  }
}, []);


  // Gọi API khi component mount hoặc khi chọn tính năng flashcard
  useEffect(() => {
    const fetchFlashcards = async () => {
      if (activeFeature !== 'flash-card') return;

      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          setError('Vui lòng đăng nhập để xem flashcard');
          setLoading(false); // Cập nhật trạng thái loading
          return;
        }

        // Gọi API để lấy dữ liệu flashcard
        const response = await axiosInstance.get(`/api/exercises/topic/${topic_Id}/flashcard`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Response Data:', response.data);
        
        if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
          const flashcardDetails = response.data.data[0]?.details; // Lấy mảng details từ response
          if (Array.isArray(flashcardDetails) && flashcardDetails.length > 0) {
            const formattedData = flashcardDetails.map(card => ({
              word: card.eng_word || '',
              meaning: card.vie_word || '',
              image: card.image_url || ''
            }));

            console.log('Formatted FlashCards:', formattedData);

            setFlashCards(formattedData);
            setFlashCardIndex(0);
          } else {
            console.warn('Không có dữ liệu flashcard trong details.');
            setError('Không có dữ liệu flashcard.');
          }
        } else {
          console.warn('Không có dữ liệu flashcard trong response.');
          setError('Không có dữ liệu flashcard.');
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu flashcard:', error);
        if (error.response) {
          const { status, data } = error.response;
          if (status === 401) {
            setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            localStorage.removeItem('token');
            setTimeout(() => {
              window.location.href = '/login';
            }, 2000);
          } else if (status === 404) {
            setError('Không tìm thấy bài tập.');
          } else {
            setError(data.message || 'Không thể tải dữ liệu flashcard. Vui lòng thử lại sau.');
          }
        } else {
          setError('Không thể kết nối đến server. Vui lòng thử lại sau.');
        }
      } finally {
        setLoading(false); // Đảm bảo trạng thái loading được cập nhật
      }
    };

    fetchFlashcards();
  }, [activeFeature, topicId]);

  useEffect(() => {
    console.log('FlashCards State:', flashCards);
  }, [flashCards]);

  useEffect(() => {
    if (flashCards.length > 0) {
      console.log('FlashCards are being displayed:', flashCards[flashCardIndex]);
    }
  }, [flashCards, flashCardIndex]);

  useEffect(() => {
    const fetchListeningData = async () => {
      if (activeFeature !== 'listen-speak') return;

      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          setError('Vui lòng đăng nhập để xem bài tập luyện nói');
          setLoading(false);
          return;
        }

        // Gọi API để lấy dữ liệu bài tập luyện nói
        const response = await axiosInstance.get(`/api/exercises/topic/${topic_Id}/nghenoi`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Response Data:', response.data);
        setExerciseId(response.data.data[0]?.id); // Lưu exercise_Id từ response
        if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
          const details = response.data.data[0]?.details;
          if (Array.isArray(details) && details.length > 0) {
            const formattedData = details.map(item => ({
              questionText: item.question_text
            }));

            setListeningData(formattedData); // Cập nhật state với dữ liệu đã xử lý
            setListeningIndex(0); // Đặt câu hỏi đầu tiên
          } else {
            console.warn('Không có dữ liệu bài tập luyện nói.');
            setError('Không có dữ liệu bài tập luyện nói.');
          }
        } else {
          console.warn('Không có dữ liệu bài tập luyện nói.');
          setError('Không có dữ liệu bài tập luyện nói.');
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu bài tập luyện nói:', error);
        if (error.response) {
          const { status, data } = error.response;
          if (status === 401) {
            setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            localStorage.removeItem('token');
            setTimeout(() => {
              window.location.href = '/login';
            }, 2000);
          } else if (status === 404) {
            setError('Không tìm thấy bài tập.');
          } else {
            setError(data.message || 'Không thể tải dữ liệu bài tập. Vui lòng thử lại sau.');
          }
        } else {
          setError('Không thể kết nối đến server. Vui lòng thử lại sau.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchListeningData();
  }, [activeFeature, topic_Id]);

  useEffect(() => {
    const fetchWritingData = async () => {
      if (activeFeature !== 'writing') return;

      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          setError('Vui lòng đăng nhập để xem bài tập luyện viết');
          setLoading(false);
          return;
        }

        // Gọi API để lấy dữ liệu bài tập luyện viết
        const response = await axiosInstance.get(`/api/exercises/topic/${topic_Id}/viet`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Response Data:', response.data);
        setExerciseId(response.data.data[0]?.id); // Lưu exercise_Id từ response
        if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
          const details = response.data.data[0]?.details;
          if (Array.isArray(details) && details.length > 0) {
            const formattedData = details.map(item => ({
              vietnamese: item.vie_word,
              english: item.eng_word
            }));

            setWritingData(formattedData); // Cập nhật state với dữ liệu đã xử lý
            setWritingIndex(0); // Đặt câu hỏi đầu tiên
          } else {
            console.warn('Không có dữ liệu bài tập luyện viết.');
            setError('Không có dữ liệu bài tập luyện viết.');
          }
          console.log('Response Data:', response.data);
          console.log('Writing Data:', writingData);
        } else {
          console.warn('Không có dữ liệu bài tập luyện viết.');
          setError('Không có dữ liệu bài tập luyện viết.');
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu bài tập luyện viết:', error);
        if (error.response) {
          const { status, data } = error.response;
          if (status === 401) {
            setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            localStorage.removeItem('token');
            setTimeout(() => {
              window.location.href = '/login';
            }, 2000);
          } else if (status === 404) {
            setError('Không tìm thấy bài tập.');
          } else {
            setError(data.message || 'Không thể tải dữ liệu bài tập. Vui lòng thử lại sau.');
          }
        } else {
          setError('Không thể kết nối đến server. Vui lòng thử lại sau.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchWritingData();
  }, [activeFeature, topic_Id]);

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
    const correctAnswer = listeningData[listeningIndex].questionText.toLowerCase();
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
    message += `Câu cần nói: ${listeningData[listeningIndex].questionText}`;

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
      // Kiểm tra đáp án người dùng chọn với correctAnswer
      const isCorrect = selectedOption === fillBlankData[fillBlankIndex].correctAnswer;
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
  

  const generateFillBlankOptions = () => {
    // Kiểm tra dữ liệu trước khi xử lý
    if (!fillBlankData || fillBlankData.length === 0 || !fillBlankData[fillBlankIndex]) {
      console.error('Dữ liệu fillBlankData không hợp lệ hoặc không tồn tại.');
      return;
    }
  
    // Lấy từ đúng cho câu hiện tại
    const correctWord = fillBlankData[fillBlankIndex].correctAnswer;
  
    // Lọc ra các từ khác (không phải từ đúng)
    const otherWords = fillBlankData
      .filter((item, index) => index !== fillBlankIndex) // Loại bỏ câu hiện tại
      .map(item => item.correctAnswer) // Lấy các đáp án đúng từ các câu khác
      .sort(() => Math.random() - 0.5) // Xáo trộn danh sách
      .slice(0, 3); // Chọn 3 từ ngẫu nhiên khác
  
    // Kết hợp từ đúng với các từ ngẫu nhiên và xáo trộn lại
    const allOptions = [...otherWords, correctWord].sort(() => Math.random() - 0.5);
  
    setOptions(allOptions);
    console.log('fillBlankData:', fillBlankData);
    console.log('fillBlankIndex:', fillBlankIndex);
  };

  const nextQuestion = async () => {
    if (activeFeature === 'flash-card') {
      // Chuyển sang flashcard tiếp theo
      setFlashCardIndex((prev) => (prev + 1) % flashCards.length);
      setIsFlipped(false); // Đặt lại trạng thái không lật flashcard
    } else if (activeFeature === 'fill-blank') {
      if (fillBlankIndex === fillBlankData.length - 1) {
        // Người dùng đã hoàn thành bài tập điền khuyết
        const totalQuestions = fillBlankData.length;
  
        // Gửi kết quả lên API
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            alert('Vui lòng đăng nhập để lưu kết quả.');
            return;
          }
  
          const payload = {
            exerciseId: exercise_Id, // ID của bài tập
            correctAnswers: parseInt(correctAnswers, 10),
            totalQuestions: parseInt(totalQuestions, 10),
            type: 'dienkhuyet',
            topicId:topic_Id,
            topicName: topic_Name,
          };
  
          console.log('Payload:', payload); // Log payload để kiểm tra
  
          const response = await axiosInstance.post('/api/history/result', payload, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
  
          if (response.data.success) {
            alert('🎉 Kết quả đã được lưu vào lịch sử luyện tập!');
          } else {
            console.error('Lỗi khi lưu kết quả:', response.data.message);
            alert('Không thể lưu kết quả. Vui lòng thử lại sau.');
          }
        } catch (error) {
          console.error('Lỗi khi gửi kết quả:', error);
          alert('Không thể kết nối đến server. Vui lòng thử lại sau.');
        }
  
        // Đặt lại trạng thái bài tập
        setFillBlankIndex(0);
        setCorrectAnswers(0);
        setCorrectQuestions(prev => ({ ...prev, fillBlank: new Set() }));
      } else {
        // Chuyển sang câu tiếp theo
        setFillBlankIndex((prev) => (prev + 1) % fillBlankData.length);
        setFillBlankAnswer('');
        setSelectedOption(null);
        generateFillBlankOptions();
      }
    } else if (activeFeature === 'listen-speak') {
      if (listeningIndex === listeningData.length - 1) {
        // Người dùng đã hoàn thành bài tập luyện nghe
        const totalQuestions = listeningData.length;
  
        // Gửi kết quả lên API
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            alert('Vui lòng đăng nhập để lưu kết quả.');
            return;
          }
  
          const payload = {
            exerciseId: exercise_Id,// ID của bài tập
            correctAnswers: parseInt(speakingScore, 10),
            totalQuestions: parseInt(totalQuestions, 10),
            type: 'nghenoi',
            topicId: parseInt(topic_Id, 10),
            topicName: topic_Name,
          };
  
          console.log('Payload:', payload); // Log payload để kiểm tra
  
          const response = await axiosInstance.post('/api/history/result', payload, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
  
          if (response.data.success) {
            alert(`🎉 Bạn đã hoàn thành bài tập nói với ${speakingScore}/${totalQuestions} câu đúng!`);
          } else {
            console.error('Lỗi khi lưu kết quả:', response.data.message);
            alert('Không thể lưu kết quả. Vui lòng thử lại sau.');
          }
        } catch (error) {
          console.error('Lỗi khi gửi kết quả:', error);
          alert('Không thể kết nối đến server. Vui lòng thử lại sau.');
        }
  
        // Đặt lại trạng thái bài tập
        setListeningIndex(0);
        setSpeakingScore(0);
        setCorrectQuestions(prev => ({ ...prev, listenSpeak: new Set() }));
      } else {
        // Chuyển sang câu tiếp theo
        setListeningIndex((prev) => (prev + 1) % listeningData.length);
        setRecognizedSpeech('');
        setInterimTranscript('');
      }
    } else if (activeFeature === 'writing') {
      if (writingIndex === writingData.length - 1) {
        // Người dùng đã hoàn thành bài tập luyện viết
        const totalQuestions = writingData.length;
  
        // Gửi kết quả lên API
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            alert('Vui lòng đăng nhập để lưu kết quả.');
            return;
          }
  
          const payload = {
            exerciseId: exercise_Id, // ID của bài tập
            correctAnswers: parseInt(correctQuestions.writing.size, 10),
            totalQuestions: parseInt(totalQuestions, 10),
            type: 'viet',
            topicId: topic_Id,
            topicName: topic_Name,
          };
  
          console.log('Payload:', payload); // Log payload để kiểm tra
  
          const response = await axiosInstance.post('/api/history/result', payload, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
  
          if (response.data.success) {
            alert(`🎉 Bạn đã hoàn thành bài tập viết với ${correctQuestions.writing.size}/${totalQuestions} câu đúng!`);
          } else {
            console.error('Lỗi khi lưu kết quả:', response.data.message);
            alert('Không thể lưu kết quả. Vui lòng thử lại sau.');
          }
        } catch (error) {
          console.error('Lỗi khi gửi kết quả:', error);
          alert('Không thể kết nối đến server. Vui lòng thử lại sau.');
        }
  
        // Đặt lại trạng thái bài tập
        setWritingIndex(0);
        setCorrectQuestions(prev => ({ ...prev, writing: new Set() }));
      } else {
        // Chuyển sang câu tiếp theo
        setWritingIndex((prev) => (prev + 1) % writingData.length);
        setUserWriting('');
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
              {item.id === 'flash-card' ? (
                <button
                  onClick={() => {
                    setActiveFeature('flash-card');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:opacity-80 transition duration-200"
                >
                  Bắt đầu
                </button>
              ) : item.id === 'fill-blank' ? (
                <button
                  onClick={() => {
                    setActiveFeature('fill-blank');
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:opacity-80 transition duration-200"
                >
                  Bắt đầu
                </button>
              ) : item.id === 'listen-speak' ? (
                <button
                  onClick={() => {
                    setActiveFeature('listen-speak');
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:opacity-80 transition duration-200"
                >
                  Bắt đầu
                </button>
              ) : (
                <button
                  onClick={() => {
                    setActiveFeature('writing');
                  }}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:opacity-80 transition duration-200"
                >
                  Bắt đầu
                </button>
              )}
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
                      onClick={() => setActiveFeature('flash-card')}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                      Thử lại
                    </button>
                  </div>
                ) : flashCards.length > 0 && flashCards[flashCardIndex] ? (
                  <div>
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
                          <p className="text-2xl font-bold">{flashCards[flashCardIndex].meaning}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">Không có flashcard nào</div>
                )}
              </div>
            )}

            {activeFeature === 'fill-blank' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Điền Khuyết</h2>
                {loading ? (
                  <div className="text-center py-4">Đang tải...</div>
                ) : error ? (
                  <div className="text-red-500">{error}</div>
                ) : fillBlankData.length > 0 ? (
                  <div>
                    <p className="text-gray-600 mb-4">Câu {fillBlankIndex + 1}/{fillBlankData.length}</p>
                    <p className="mb-4">{fillBlankData[fillBlankIndex].sentence}</p>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {fillBlankData[fillBlankIndex].options.map((option, index) => (
                        <button
                          key={index}
                          className={`p-2 rounded-lg hover:bg-gray-300 ${selectedOption === option ? 'bg-blue-300' : 'bg-gray-200'}`}
                          onClick={() => setSelectedOption(option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>

                    <button onClick={checkFillBlank} className="bg-green-500 text-white px-4 py-2 rounded-lg">Kiểm tra</button>
                  </div>
                ) : (
                  <div className="text-center py-4">Không có bài tập nào</div>
                )}
              </div>
            )}

            {activeFeature === 'listen-speak' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Luyện Nghe & Nói</h2>
                {loading ? (
                  <div className="text-center py-4">Đang tải...</div>
                ) : error ? (
                  <div className="text-red-500">{error}</div>
                ) : listeningData.length > 0 ? (
                  <div>
                    <p className="text-gray-600 mb-4">Câu {listeningIndex + 1}/{listeningData.length}</p>
                    <p className="text-lg font-semibold mb-4">{listeningData[listeningIndex].questionText}</p>

                    <div className="flex justify-center gap-4 mb-4">
                      <button
                        className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:opacity-80 transition duration-200"
                        onClick={() => handleSpeech(listeningData[listeningIndex].questionText)}
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
                ) : (
                  <div className="text-center py-4">Không có bài tập nào</div>
                )}
              </div>
            )}

            {activeFeature === 'writing' && (
  <div>
    <h2 className="text-xl font-bold mb-4">Luyện Viết</h2>
    {loading ? (
      <div className="text-center py-4">Đang tải...</div>
    ) : error ? (
      <div className="text-red-500">{error}</div>
    ) : writingData.length > 0 && writingData[writingIndex] ? (
      <div>
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
    ) : (
      <div className="text-center py-4">Không có bài tập nào</div>
    )}
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
