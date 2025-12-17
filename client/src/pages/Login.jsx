import { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.get('/api/books');
            
            // Serverdan kelgan TOKEN va USER ma'lumotini saqlaymiz
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            
            alert('Xush kelibsiz!');
            navigate('/'); // Asosiy sahifaga yo'naltiramiz
        } catch (err) {
            alert(err.response?.data?.error || 'Xatolik yuz berdi');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px', marginTop: '50px' }}>
            <div className="card">
                <h1>Kirish</h1>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        className="btn" 
                        style={{ border: '1px solid #ddd', background: '#fff', cursor: 'text' }}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <input 
                        type="password" 
                        placeholder="Parol" 
                        className="btn" 
                        style={{ border: '1px solid #ddd', background: '#fff', cursor: 'text' }}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    <button type="submit" className="btn btn-primary">Kirish</button>
                </form>
                <p style={{ marginTop: '15px', textAlign: 'center' }}>
                    Profilingiz yo'qmi? <Link to="/register">Ro'yxatdan o'tish</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;