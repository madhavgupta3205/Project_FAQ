import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { getFaqs, deleteFaq, createFaq, updateFaq } from "../services/api";
import { Editor } from "@tinymce/tinymce-react";

const Dashboard = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [formData, setFormData] = useState({ question: "", answer: "" });
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const navigate = useNavigate();

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "bn", name: "Bengali" },
  ];

  useEffect(() => {
    loadFaqs();
  }, [currentLanguage]); // Reload when language changes

  const loadFaqs = async () => {
    try {
      const response = await getFaqs(currentLanguage);
      setFaqs(response.data.data);
    } catch (error) {
      console.error("Error loading FAQs:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async () => {
    setSaving(true);
    try {
      console.log('Sending data:', formData); // Log what we're sending
  
      if (editingFaq) {
        await updateFaq(editingFaq.id, { ...formData, lang: currentLanguage });
      } else {
        await createFaq(formData);
      }
      setFormData({ question: "", answer: "" });
      setShowForm(false);
      setEditingFaq(null);
      loadFaqs();
    } catch (error) {
      console.error("Error saving FAQ:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this FAQ?")) {
      try {
        await deleteFaq(id);
        loadFaqs();
      } catch (error) {
        console.error("Error deleting FAQ:", error);
      }
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Language Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Language
          </label>
          <select
            value={currentLanguage}
            onChange={(e) => setCurrentLanguage(e.target.value)}
            className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            FAQ Management (
            {languages.find((l) => l.code === currentLanguage)?.name})
          </h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingFaq(null);
              setFormData({ question: "", answer: "" });
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            {showForm ? "Cancel" : "Create New FAQ"}
          </button>
        </div>

        {showForm && (
          <div className="mb-8 p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              {editingFaq ? "Edit FAQ" : "Create New FAQ"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Question
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md h-12 border-2 border-gray-200 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Answer
                </label>
                <Editor
                  apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                      "advlist autolink lists link image charmap print preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table paste code help wordcount",
                    ],
                    toolbar:
                      "undo redo | formatselect | bold italic | \
                      alignleft aligncenter alignright alignjustify | \
                      bullist numlist outdent indent | removeformat | help",
                  }}
                  value={formData.answer}
                  onEditorChange={(content) =>
                    setFormData({ ...formData, answer: content })
                  }
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-green-400"
              >
                {saving ? "Saving..." : editingFaq ? "Update FAQ" : "Save FAQ"}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-lg">{faq.question}</h3>
              <div
                className="mt-2 prose"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleEdit(faq)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
