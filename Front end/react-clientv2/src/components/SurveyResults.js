import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../axios';

const SurveyResults = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    api.get(`/surveys/${id}`)
      .then(response => setSurvey(response.data))
      .catch(error => console.error('Error fetching survey:', error));

    api.get(`/surveys/${id}/responses`)
      .then(response => setResponses(response.data))
      .catch(error => console.error('Error fetching responses:', error));
  }, [id]);

  if (!survey || !responses.length) return <div>Loading...</div>;

  return (
    <div>
      <h2>Kết quả khảo sát: {survey.title}</h2>
      {responses.map(response => (
        <div key={response.id}>
          <p>Câu hỏi: {response.question.questionText}</p>
          <p>Câu trả lời: {response.responseText}</p>
          <p>Người trả lời: {response.user.username}</p>
        </div>
      ))}
    </div>
  );
};

export default SurveyResults; 