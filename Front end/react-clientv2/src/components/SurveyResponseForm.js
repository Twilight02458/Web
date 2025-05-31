import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../axios';

const SurveyResponseForm = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/surveys/${id}`)
      .then(response => setSurvey(response.data))
      .catch(error => console.error('Error fetching survey:', error));

    api.get(`/surveys/${id}/questions`)
      .then(response => setQuestions(response.data))
      .catch(error => console.error('Error fetching questions:', error));
  }, [id]);

  const handleResponseChange = (questionId, value) => {
    setResponses({ ...responses, [questionId]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const responsePromises = Object.keys(responses).map(questionId =>
      api.post('/surveys/responses', {
        survey: { id },
        question: { id: questionId },
        responseText: responses[questionId],
      }, { params: { userId: 2 } }) // Giả sử userId là 2, cần lấy từ phiên đăng nhập
    );

    Promise.all(responsePromises)
      .then(() => navigate('/surveys'))
      .catch(error => console.error('Error submitting responses:', error));
  };

  if (!survey || !questions.length) return <div>Loading...</div>;

  return (
    <div>
      <h2>{survey.title}</h2>
      <p>{survey.description}</p>
      <form onSubmit={handleSubmit}>
        {questions.map(question => (
          <div key={question.id}>
            <label>{question.questionText}</label>
            {question.questionType === 'TEXT' && (
              <textarea
                onChange={e => handleResponseChange(question.id, e.target.value)}
                required
              />
            )}
            {question.questionType === 'MULTIPLE_CHOICE' && (
              <select
                onChange={e => handleResponseChange(question.id, e.target.value)}
                required
              >
                <option value="">Chọn...</option>
                {JSON.parse(question.options || '[]').map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
            )}
            {question.questionType === 'RATING' && (
              <input
                type="number"
                min="1"
                max="5"
                onChange={e => handleResponseChange(question.id, e.target.value)}
                required
              />
            )}
          </div>
        ))}
        <button type="submit">Gửi câu trả lời</button>
      </form>
    </div>
  );
};

export default SurveyResponseForm; 