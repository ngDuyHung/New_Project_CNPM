import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { debounce } from "lodash";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

const translateWord = async (word) => {
  try {
    console.log(`Translating word: ${word}`); // Log từ cần dịch
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        word
      )}&langpair=en|vi`
    );
    const data = await response.json();
    console.log(`API Response for "${word}":`, data); // Log toàn bộ phản hồi từ API
    return data.responseData.translatedText || "N/A";
  } catch (error) {
    console.error(`Error translating word "${word}":`, error);
    return "N/A";
  }
};

const TopicCard = ({ topic, onDelete, onEdit, onClose, editingTopic }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!editingTopic) {
      window.alert("Error: No topic selected to delete.");
      return;
    }

    try {
      // Gửi yêu cầu DELETE để xoá topic và các từ vựng liên quan
      const response = await axiosInstance.delete(
        `/api/topics/delete`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Thêm header xác thực
          },
          data: { id: editingTopic.id }  // Truyền ID của topic cần xoá trong body
        }
      );

      if (response.status === 204) {
        // Nếu xóa thành công, gọi onDelete để xoá topic từ danh sách ở component cha
        onDelete(editingTopic.id);
        alert("Topic deleted successfully.");
      } else {
        alert("Failed to delete topic.");
      }

      // Đóng form chỉnh sửa sau khi xóa
      onClose();
    } catch (error) {
      console.error("API error:", error);
      alert("An error occurred. Please try again.");
    }
  };




  const handleStart = () => {
    // Lưu thông tin topic vào localStorage
    localStorage.setItem('currentTopic', JSON.stringify({
      topic_name: topic.topic_name,
      topic_id: topic.topic_id,
    }));
  
    // Điều hướng đến trang thực hành
    navigate('/practice');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between h-72 text-center relative w-full max-w-xs">
      <h3 className="text-lg font-semibold bg-yellow-400 p-2 rounded-t-md w-full text-center flex justify-center items-center relative">
        {topic.topic_name}
        <button
          onClick={() => handleDelete(topic.topic_id)}  // Truyền đúng id topic vào khi nhấn nút xóa
          className="absolute right-2 top-2 text-red-500 font-bold"
        >
          X
        </button>
      </h3>
      <div className="flex-1 p-2 overflow-auto max-h-32">
        {topic.words &&
          topic.words.map((word, index) => <p key={index}>{word}</p>)}
      </div>
      <div className="flex flex-col gap-2 mt-2 w-full">
        <button
          className="bg-blue-500 text-white py-2 rounded-md w-full"
          onClick={handleStart}
        >
          Start
        </button>
        <button
          className="bg-gray-300 text-black py-2 rounded-md w-full"
          onClick={() => onEdit(topic)}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

const CreateTopic = ({
  isVisible,
  onClose,
  onCreate,
  editingTopic,
  onSaveEdit,
  setEditingTopic,
}) => {
  const [topicName, setTopicName] = useState(
    editingTopic ? editingTopic.title : ""
  );
  const [words, setWords] = useState(
    editingTopic ? editingTopic.words : ["", "", ""]
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (editingTopic) {
      setTopicName(editingTopic.title);
      setWords(editingTopic.words);
    } else {
      setTopicName(topicName);
      setWords(words);
    }
  }, [editingTopic]);

  const handleGenerateAI = async () => {
    if (!topicName.trim()) {
      toast.error("Please enter topic name first!");
      return;
    }
  
    setIsGenerating(true);
    try {
      const requiredCount = words.length; // Số lượng từ cần tạo
      const response = await axiosInstance.post(
        '/api/conversational-ai/generate-vocabulary',
        {
          topic: topicName,
          count: requiredCount,
        }
      );
  
      if (response.status === 200 && Array.isArray(response.data.data)) {
        const generatedWords = response.data.data;
  
        // Điền đủ số lượng ô, nếu không đủ thì để trống
        const paddedWords = [
          ...generatedWords,
          ...Array(requiredCount - generatedWords.length).fill(""),
        ];
  
        setWords(paddedWords);
      } else {
        console.error("Failed to generate words:", response.data);
        alert("Failed to generate words. Please try again!");
      }
    } catch (error) {
      console.error("Error generating words with Gemi:", error);
      alert("An error occurred while generating words. Please try again!");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFillInTheBlankWithGemi = async (word, meaning) => {
    try {
      const response = await axiosInstance.post('/api/conversational-ai/generate-fill-in-the-blank', {
        word,
        meaning,
      });
  
      if (response.status === 200) {
        return response.data;
      } else {
        console.error('Failed to generate fill-in-the-blank:', response.data);
        return null;
      }
    } catch (error) {
      console.error('Error generating fill-in-the-blank:', error);
      return null;
    }
  };

  const addWord = () => {
    if (words.length >= 20) {
       Swal.fire({
                icon: 'error',
                title: 'ADD ÍT THÔI MÀI ĐỊNH PHÁ WEB À !!',
                text: 'You can only add up to 20 words.',
                confirmButtonText: 'Thử lại'
              });
      return;
    }
    setWords([...words, ""]);
  };
  const removeWord = (index) => setWords(words.filter((_, i) => i !== index));

  const handleSave = async () => {
    if (!topicName.trim() || words.some((word) => !word.trim())) {
       toast.error(
        "Error: Topic name and all vocabulary fields must be filled."
      );
      return;
    }

    setIsSaving(true);
    try {
      let getTopicId;

      if (editingTopic) {
        const response = await axiosInstance.put(
          `/api/topics/${editingTopic.id}`,
          { title: topicName }
        );

        if (response.status === 200) {
          onSaveEdit(response.data);
        } else {
          alert("Failed to update topic.");
        }
      } else {
        // Tạo topic mới
        const response = await axiosInstance.post("/api/topics/create", {
          title: topicName,
          user_id: (await axiosInstance.get("/api/auth/me")).data.id,
        });

        console.log("Response from topic create:", response.data);

        getTopicId = response.data.id; // Lấy topic ID vừa tạo
        console.log("Topic ID:", getTopicId);

        // Tạo từ vựng trong bảng Vocabulary
        const vocabularyData = [];
        for (const word of words) {
          try {
            console.log(`Processing word: ${word}`); // Log từ hiện tại

            // Lấy nghĩa tiếng Việt
            const meaning = await translateWord(word);
            console.log(`Meaning for "${word}": ${meaning}`); // Log nghĩa tiếng Việt

            // Lấy phát âm từ dictionaryapi.dev
            const dictRes = await fetch(
              `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
            );
            const dictJson = await dictRes.json();
            const dictData = dictJson[0] || {};
            const pronunciation = dictData.phonetics?.[0]?.text || "N/A";
            console.log(`Pronunciation for "${word}": ${pronunciation}`); // Log phát âm

            // Lấy hình ảnh từ Pixabay
            const imageRes = await fetch(
              `https://pixabay.com/api/?key=49800784-4e1129771727ae88c66c3b86b&q=${encodeURIComponent(
                word
              )}&image_type=photo&per_page=3`
            );
            const imageJson = await imageRes.json();
            const image_path = imageJson.hits?.[0]?.webformatURL || "N/A";
            console.log(`Image for "${word}": ${image_path}`); // Log đường dẫn hình ảnh

            // Tạo đường dẫn âm thanh
            const sound_path = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(
              word
            )}`;
            console.log(`Sound path for "${word}": ${sound_path}`); // Log đường dẫn âm thanh

            // Gửi từ vựng đến API backend
            const resWords = await axiosInstance.post("/api/vocabulary/create", {
              topic_id: getTopicId,
              word: word,
              meaning,
              pronunciation,
              image_path,
              sound_path,
            });

            if (resWords.status === 201) {
              console.log(`Successfully created word: ${word}`); // Log khi tạo thành công
              vocabularyData.push({
                word,
                meaning,
                imageUrl: image_path,
              });
            }
          } catch (error) {
            console.error(`Error creating word "${word}":`, error);
          }

          // Chờ 500ms giữa các lần gọi API
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        // Tạo bài tập trong bảng Exercises
        const exercisesData = [
          {
            type: "flashcard",
            exercises: vocabularyData.map((vocab) => ({
              imageUrl: vocab.imageUrl, // Lấy từ dữ liệu Vocabulary
              engWord: vocab.word,
              vieWord: vocab.meaning, // Lấy từ dữ liệu Vocabulary
            })),
          },
          {
            type: "dienkhuyet",
            exercises: await Promise.all(
              vocabularyData.map(async (vocab) => {
                const generatedExercise = await generateFillInTheBlankWithGemi(
                  vocab.word,
                  vocab.meaning
                );
          
                // Kiểm tra dữ liệu trả về từ API
                if (
                  generatedExercise &&
                  generatedExercise.data &&
                  Array.isArray(generatedExercise.data.options) &&
                  generatedExercise.data.options.length === 4
                ) {
                  return {
                    sentence: generatedExercise.data.sentence,
                    correctAnswer: generatedExercise.data.correctAnswer,
                    answer1: generatedExercise.data.options[0],
                    answer2: generatedExercise.data.options[1],
                    answer3: generatedExercise.data.options[2],
                    answer4: generatedExercise.data.options[3],
                  };
                }
                console.log(`Generated exercise for "${vocab.word}":`, generatedExercise);
                // Fallback logic nếu API không trả về kết quả hợp lệ
                console.warn(`Fallback logic triggered for word: ${vocab.word}`);
                return {
                  sentence: `The word "${vocab.word}" means ___.`,
                  correctAnswer: vocab.meaning,
                  answer1: vocab.meaning,
                  answer2: "Option 1",
                  answer3: "Option 2",
                  answer4: "Option 3",
                };
              })
            ),
          },
          {
            type: "nghenoi",
            exercises: vocabularyData.map((vocab) => ({
              questionText: `How do you pronounce "${vocab.word}"?`,
            })),
          },
          {
            type: "viet",
            exercises: vocabularyData.map((vocab) => ({
              engWord: vocab.word,
              vieWord: vocab.meaning, // Lấy từ dữ liệu Vocabulary
            })),
          },
        ];

        for (const exercise of exercisesData) {
          const exerciseResponse = await axiosInstance.post(
            "/api/exercises/",
            {
              topicId: getTopicId,
              type: exercise.type,
              exercises: exercise.exercises,
            }
          );

          if (exerciseResponse.status === 201) {
            console.log(`Created ${exercise.type} exercise for topic:`, topicName);
          } else {
            console.error(
              `Failed to create ${exercise.type} exercise for topic:`,
              topicName
            );
          }
        }
      }

      setWords(words);
      onClose();
      const newTopic = {
        topic_id: getTopicId,
        topic_name: topicName,
        words,
      };
      onCreate(newTopic);
    } catch (error) {
      console.error("API error:", error);
      if (error.response && error.response.data.message === "Topic name already exists!") {
        toast.error("Topic name already exists! Please choose a different name.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setEditingTopic(null);
    onClose();
  };
  const updateWord = (index, value) => {
    setWords((prevWords) => {
      const newWords = [...prevWords];
      newWords[index] = value;
      return newWords;
    });
  };
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-xs text-center">
        <h2 className="text-xl font-bold mb-4">
          {editingTopic ? "Edit Topic" : "Create New Topic"}
        </h2>

        <input
          type="text"
          placeholder="Enter topic name..."
          className="w-full p-2 border rounded-md"
          value={topicName}
          onChange={(e) => setTopicName(e.target.value)}
        />

        <button
          onClick={handleGenerateAI}
          className="bg-purple-500 text-white px-4 py-2 rounded-md mt-2 w-full relative"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <span className="invisible">Generating...</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              </div>
            </>
          ) : (
            "Generate with AI"
          )}
        </button>

        <div className="overflow-y-auto max-h-40 mt-2">
          {words.map((word, index) => (
            <div key={index} className="flex items-center gap-2 mt-2">
              <input
                type="text"
                placeholder="Enter Word..."
                className="flex-grow p-2 border rounded-md"
                value={word}
                onChange={(e) => {
                  const newWords = [...words];
                  newWords[index] = e.target.value;
                  setWords(newWords);
                }}
              />
              <button
                onClick={() =>
                  setWords(
                    words.length > 1
                      ? words.filter((_, i) => i !== index)
                      : [""]
                  )
                }
                className="text-red-500 font-bold"
              >
                X
              </button>
            </div>
          ))}
        </div>
        <button
          className="bg-yellow-400 text-white px-6 py-2 mt-4 rounded-md w-full"
          onClick={addWord}
        >
          + Add Word
        </button>
        <div className="flex justify-between gap-4 mt-4">
          <button
            className={`bg-green-500 px-4 py-2 rounded-md w-1/2 ${
              isSaving ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              editingTopic ? "Save Changes" : "Save"
            )}
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md w-1/2"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [editingTopic, setEditingTopic] = useState(null);
  const [isCreateTopicVisible, setIsCreateTopicVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      setError("");
      setTopics([]);
      setFilteredTopics([]);

      try {
        const responseAuth = await axiosInstance.get("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("Token:", localStorage.getItem("token"));// check xem có token chưa
        const getUserId = responseAuth.data.id;
        console.log("User ID:", getUserId); // check xem có user id chưa
        const response = await axiosInstance.get("/api/topics/getAllTopicsByUserId", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            user_id: getUserId,
          },
        });
        console.log("Token to get topic:", localStorage.getItem("token"));
        console.log("User ID to get topic:", getUserId);
        console.log("Topics Data:", response.data);
        if (response.status === 200) {
          const topicsData = response.data;
          const newTopics = [];
          const newFilteredTopics = [];
          for (const topic of topicsData) {
            try {
              const wordsResponse = await axiosInstance.get(
                `/api/vocabulary/GetAllByTopicId?topic_id=${encodeURIComponent(
                  topic.topic_id
                )}`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );
              console.log("Words Data:", wordsResponse.data);
              
              const wordsData = await wordsResponse.data;
              console.log("Words Data2:", wordsData);
              const wordsList = wordsData.map((item) => item.word);
              console.log("Words List:", wordsList);
              newTopics.push({
                topic_id: topic.topic_id,
                topic_name: topic.topic_name,
                words: wordsResponse.status === 200 ? wordsList : [],
              });

              newFilteredTopics.push({
                topic_id: topic.topic_id,
                topic_name: topic.topic_name,
                words: wordsResponse.status === 200 ? wordsList : [],
              });
            } catch (err) {
              console.error(`Error fetching words for topic ${topic.topic_id}:`, err);

              newTopics.push({
                topic_id: topic.topic_id,
                topic_name: topic.topic_name,
                words: [],
              });

              newFilteredTopics.push({
                topic_id: topic.topic_id,
                topic_name: topic.topic_name,
                words: [],
              });
            }
          }

          setTopics(newTopics);
          setFilteredTopics(newFilteredTopics);
        } else {
          setError(`Failed to fetch topics. Status: ${response.status}`);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error("Session expired. Please log in again.");
          window.location.href = "/login";
        } else {
          console.error("API error:", error);
          setError("An error occurred while fetching topics.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const filteredTopicsMemo = useMemo(() => {
    if (!isSearching && searchTerm.trim() === "") {
      return topics;
    }
    return topics.filter((topic) =>
      topic.topic_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [topics, searchTerm, isSearching]);

  const handleCreateTopic = (newTopic) => {
    setTopics([...topics, newTopic]);
    setFilteredTopics([...filteredTopics, newTopic]);
    setIsCreateTopicVisible(false);
  };

  const handleSearch = debounce(() => {
    if (searchTerm.trim() === "") {
      setIsSearching(false);
      setFilteredTopics(topics);
      return;
    }
    setIsSearching(true);
    setFilteredTopics(
      topics.filter((topic) =>
        topic.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, 500);

  const handleEditTopic = (title, words) => {
    setEditingTopic({ title, words });
    setIsCreateTopicVisible(true);
  };

  const handleSaveEdit = (updatedTopic) => {
    setTopics(
      topics.map((topic) =>
        topic.id === updatedTopic.id ? updatedTopic : topic
      )
    );
    setFilteredTopics(
      filteredTopics.map((topic) =>
        topic.id === updatedTopic.id ? updatedTopic : topic
      )
    );
    setIsCreateTopicVisible(false); // Đóng modal nếu có
    setEditingTopic(null);
  };

  const handleDeleteTopic = async (topicId) => {
    setTopics((prevTopics) => prevTopics.filter((topic) => topic.topic_id !== topicId));
    setFilteredTopics((prevTopics) => prevTopics.filter((topic) => topic.topic_id !== topicId));
    setEditingTopic(null); // Reset editing topic
    setIsCreateTopicVisible(false); // Đóng modal nếu có
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen p-4 md:p-6">
      <div className="flex-1 p-6 w-full max-w-6xl">
        <input className="mb-6" placeholder="Tran Huy An 23/4/2025 " />

        <div className="flex w-full max-w-3xl gap-2 mb-6">
          <input
            type="text"
            placeholder="Search your topic here..."
            className="w-full p-2 border rounded-md mb-0.25"
            value={searchTerm}
            onChange={(e) => {
              const value = e.target.value;
              setSearchTerm(value);
              if (value.trim() === "") {
                setIsSearching(false);
                setFilteredTopics(topics);
              }
            }}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {loading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        )}
        <button
          className="bg-green-500 text-white px-6 py-2 rounded-md mb-4 w-full max-w-xs"
          onClick={() => {
            setEditingTopic(null);
            setIsCreateTopicVisible(true);
          }}
        >
          + Create New Topic
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
          {filteredTopicsMemo && filteredTopicsMemo.length > 0 ? (
            filteredTopicsMemo.map((topicc) => (
              <TopicCard
                key={topicc.topic_id}
                topic={topicc}
                onDelete={handleDeleteTopic}  // gọi hàm này khi xoá
                onEdit={(topicToEdit) => {
                  setEditingTopic(topicToEdit);
                  setIsCreateTopicVisible(true);
                }}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">No topics available.</p>
          )}
        </div>
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
          {topics.map((topicc) => (
            <TopicCard
              key={topicc.id}
              topic={topicc}
              onDelete={handleDeleteTopic}
              onEdit={(topicc) => {
                setEditingTopic(topicc);
                setIsCreateTopicVisible(true);
              }}
            />
          ))}
        </div> */}
        <CreateTopic
          isVisible={isCreateTopicVisible}
          onClose={() => setIsCreateTopicVisible(false)}
          onCreate={handleCreateTopic}
          editingTopic={editingTopic}
          onSaveEdit={handleSaveEdit}
          setEditingTopic={setEditingTopic}
        />
      </div>
      <ToastContainer />
    </div>
  );
};
export default App;
