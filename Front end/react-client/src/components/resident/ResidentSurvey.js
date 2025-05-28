import React, { useEffect, useState } from "react";
import { Alert, Button, Spinner } from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";

const ResidentSurvey = () => {
    const [survey, setSurvey] = useState(null);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [msg, setMsg] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                const res = await authApis().get(endpoints["user-survey"]);
                if (res.data) setSurvey(res.data);
            } catch (err) {
                setMsg("Không thể tải khảo sát.");
            } finally {
                setLoading(false);
            }
        };
        fetchSurvey();
    }, []);

    const handleChange = (questionId, optionId) => {
        setAnswers({ ...answers, [questionId]: optionId });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!survey) return;
        const payload = Object.entries(answers).map(([questionId, optionId]) => ({
            questionId,
            optionId,
            surveyId: survey.id
        }));
        try {
            await authApis().post(endpoints["user-survey-submit"], payload);
            setSubmitted(true);
        } catch (err) {
            setMsg("Gửi khảo sát thất bại.");
        }
    };

    if (loading) return <Spinner animation="border" />;

    if (submitted) {
        return <Alert variant="success">Bạn đã gửi khảo sát. Cảm ơn bạn!</Alert>;
    }

    if (!survey) {
        return <Alert variant="info">Không có khảo sát nào hiện tại.</Alert>;
    }

    return (
        <div className="container mt-4">
            <h3>{survey.title}</h3>
            {msg && <Alert variant="danger">{msg}</Alert>}
            <form onSubmit={handleSubmit}>
                {survey.questions.map((q) => (
                    <div key={q.id} className="mb-4">
                        <p><strong>{q.questionText}</strong></p>
                        <div className="d-flex gap-3 flex-wrap">
                            {q.options.map((opt) => (
                                <label key={opt.id} className="btn btn-outline-primary">
                                    <input
                                        type="radio"
                                        name={`question-${q.id}`}
                                        value={opt.id}
                                        checked={answers[q.id] === opt.id}
                                        onChange={() => handleChange(q.id, opt.id)}
                                        required
                                    />
                                    {" " + opt.optionText}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
                <Button type="submit" variant="success" className="mt-3">Gửi khảo sát</Button>
            </form>
        </div>
    );
};

export default ResidentSurvey;