import React, { useEffect, useState } from 'react';
import api from '../axios';
import { Link } from 'react-router-dom';

const SurveyList = () => {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    api.get('/surveys')
      .then(response => setSurveys(response.data))
      .catch(error => console.error('Error fetching surveys:', error));
  }, []);

  return (
    <div>
      <h2>Danh sách khảo sát</h2>
      <ul>
        {surveys.map(survey => (
          <li key={survey.id}>
            <Link to={`/survey/${survey.id}`}>{survey.title}</Link>
            <span> ({survey.status})</span>
          </li>
        ))}
      </ul>
      <Link to="/survey/create">Tạo khảo sát mới</Link>
    </div>
  );
};

export default SurveyList; 