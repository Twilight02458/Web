import React, { useState } from 'react';
import api from '../axios';
import { useNavigate } from 'react-router-dom';

const SurveyForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([{ questionText: '', questionType: 'TEXT', options: '' }]);
  const navigate = useNavigate();

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: '', questionType: 'TEXT', options: '' }]);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const surveyRequest = {
      title,
      description,
      adminId: 1, // Giả sử admin ID là 1, cần lấy từ phiên đăng nhập thực tế
      questions: questions.map(q => ({
        questionText: q.questionText,
        questionType: q.questionType,
        options: q.questionType === 'MULTIPLE_CHOICE' ? JSON.stringify(q.options.split(',')) : null,
      })),
    };

    api.post('/surveys', surveyRequest)
      .then(() => navigate('/surveys'))
      .catch(error => console.error('Error creating survey:', error));
  };

  return (
    <div>
      <h2>Tạo khảo sát mới</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tiêu đề:</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mô tả:</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <h3>Câu hỏi</h3>
        {questions.map((question, index) => (
          <div key={index}>
            <label>Câu hỏi {index + 1}:</label>
            <input
              type="text"
              value={question.questionText}
              onChange={e => handleQuestionChange(index, 'questionText', e.target.value)}
              required
            />
            <select
              value={question.questionType}
              onChange={e => handleQuestionChange(index, 'questionType', e.target.value)}
            >
              <option value="TEXT">Văn bản</option>
              <option value="MULTIPLE_CHOICE">Trắc nghiệm</option>
              <option value="RATING">Đánh giá</option>
            </select>
            {question.questionType === 'MULTIPLE_CHOICE' && (
              <input
                type="text"
                placeholder="Các lựa chọn, cách nhau bằng dấu phẩy"
                value={question.options}
                onChange={e => handleQuestionChange(index, 'options', e.target.value)}
              />
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddQuestion}>Thêm câu hỏi</button>
        <button type="submit">Tạo khảo sát</button>
      </form>
    </div>
  );
};

export default SurveyForm; 