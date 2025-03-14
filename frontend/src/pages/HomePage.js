import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const TopicCard = ({ title, words, onDelete, onEdit }) => {
  const navigate = useNavigate();

  const confirmDelete = () => {
    if (window.confirm("Are you sure you want to delete this topic?")) {
      onDelete();
    }
  };
  const handleStart = () => {
    navigate(`/practice?topic=${encodeURIComponent(title)}`);
  };
  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-72 flex flex-col justify-center items-center text-center relative">
      <h3 className="text-lg font-semibold bg-yellow-400 p-2 rounded-t-md w-full text-center flex justify-center items-center relative">
        {title}
        <button 
          onClick={confirmDelete} 
          className="absolute right-2 top-2 text-red-500 font-bold"
        >X</button>
      </h3>
      <div className="flex-1 p-2">
        {words.map((word, index) => (
          <p key={index}>{word}</p>
        ))}
      </div>
      <div className="flex flex-col gap-2 w-full">
      <button 
          className="w-full h-12 bg-blue-500 text-white text-lg font-semibold rounded-md"
          onClick={handleStart}
        >
          Start
        </button>
        <button 
          className="w-full h-12 bg-gray-300 text-black text-lg font-semibold rounded-md"
          onClick={onEdit}
          >Edit</button>
          </div>
      </div>
  )
};

const App = () => {

  const [isCreateTopicVisible, setIsCreateTopicVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [topics, setTopics] = useState([

    { title: "Food and Fruit", words: ["Everyday Meals (10 words)", "Cooking and Ingredients (10 words)", "Common Fruits (10 words)"] },
    { title: "Animals", words: ["Insects and Small Creatures (10 words)", "Wild Animal (10 words)", "Marine Animal (10 words)"] },
    { title: "Travel and Tourism", words: ["Airport and Flight (10 words)", "Hotel and Accommodation (10 words)", "Tourists and Attractions (10 words)"] },
    { title: "Daily Communication", words: ["Greeting and Introductions (10 words)", "Asking for Directions (10 words)", "Shopping (10 words)"] },
    { title: "Life and Healthy", words: ["Going to the Doctors (10 words)", "Healthy Lifestyles (10 words)"] },
    { title: "Work and Business", words: ["Job (10 words)", "Workplace Communication (10 words)"] }
  ]);

  const [editingTopic, setEditingTopic] = useState(null);

  
  const filteredTopics = searchTerm ? topics.filter(topic => topic.title.toLowerCase().includes(searchTerm.toLowerCase())) : topics;

  const handleCreateTopic = (newTopic) => {
    if (editingTopic) {
      setTopics(topics.map(topic => (topic.title === editingTopic.title ? newTopic : topic)));
      setEditingTopic(null);
    } else {
      setTopics([...topics, newTopic]);
    }
  };

  const handleEditTopic = (index) => {
    setEditingTopic({ ...topics[index], index });
    setIsCreateTopicVisible(true);
  };

  const handleSaveEdit = (updatedTopic) => {
    const newTopics = [...topics];
    newTopics[editingTopic.index] = updatedTopic;
    setTopics(newTopics);
    setEditingTopic(null);
  };

  

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <div className="flex-1 p-6">
        <input className ="mb-6" placeholder="Tran Huy An 13/3/2025 "/>
        
      <div className="flex w-3/4 gap-1 mb-6">
          <input type="text" placeholder="Search your topic here..." className="w-3/4 p-2 border rounded-md" value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md"onClick={() => {}}>Search</button>
        </div>
        <button 
            className="bg-green-500 text-white px-6 py-3 text-sm md:text-base rounded border border-green-700 mb-6"
            onClick={() => setIsCreateTopicVisible(true)}
          >
            + Create New Topic
          </button>
          
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {filteredTopics.map((topic, index) => (
          <TopicCard 
              key={index} 
              title={topic.title} 
              words={topic.words} 
              onDelete={() => setTopics(topics.filter((_, i) => i !== index))} 
              onEdit={() => handleEditTopic(index)}
            />          ))}
        </div>
        
        <CreateTopic isVisible={isCreateTopicVisible} onClose={() => setIsCreateTopicVisible(false)} onCreate={handleCreateTopic} editingTopic={editingTopic} onSaveEdit={handleSaveEdit} />


      </div>
    </div>
  );
};

const CreateTopic = ({ isVisible, onClose, onCreate, editingTopic, onSaveEdit }) => {

  const [topicName, setTopicName] = useState(editingTopic ? editingTopic.title : "");
  const [words, setWords] = useState(editingTopic ? editingTopic.words : ["", "", ""]);
  const [message, setMessage] = useState("");


  const addWord = () => setWords([...words, ""]);
  const removeWord = (index) => setWords(words.filter((_, i) => i !== index));

  if (!isVisible) return null;

  const handleSave = () => {
    if (topicName.trim() && words.some(word => word.trim())) {
      if (editingTopic) {
        onSaveEdit({ title: topicName, words });
      } else {
        onCreate({ title: topicName, words });
      }
      setTopicName(""); // Reset input
      setWords(["", "", ""]); // Reset words list
      setMessage("Topic saved successfully!");
      setTimeout(() => setMessage(""), 3000);
      alert("Topic saved successfully!");
      onClose();

    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
      <h2 className="text-xl font-bold">{editingTopic ? "Edit Topic" : "Create New Topic"}</h2>
      {message && <p className="text-green-500 font-semibold">{message}</p>}

        <input 
          type="text" 
          placeholder="Enter topic name..." 
          className="w-full p-2 border rounded-md mt-2" 
          value={topicName} 
          onChange={(e) => setTopicName(e.target.value)} 
        />
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
            <button onClick={() => removeWord(index)} className="text-red-500 font-bold">X</button>
          </div>
        ))}
        <button className="bg-green-500 text-white px-6 py-3 mt-3 rounded-md" onClick={addWord}>+ Add New Word</button>
        <button className="bg-yellow-400 px-6 py-3 mt-3 ml-2 rounded-md" onClick={handleSave}>{editingTopic ? "Save Changes" : "Save"}</button>
        <button className="bg-red-500 text-white px-4 py-2 mt-3 ml-2 rounded-md" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};



export default App; 