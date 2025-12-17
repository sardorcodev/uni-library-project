import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            alert("Muvaffaqiyatli! Endi kirishingiz mumkin.");
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.error || 'Xatolik');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px', marginTop: '50px' }}>
            <div className="card">
                <h1>Ro'yxatdan o'tish</h1>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input type="text" placeholder="Ism" className="btn" style={{ border: '1px solid #ddd', background: '#fff', cursor: 'text' }}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                    <input type="text" placeholder="Familiya" className="btn" style={{ border: '1px solid #ddd', background: '#fff', cursor: 'text' }}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                    <input type="email" placeholder="Email" className="btn" style={{ border: '1px solid #ddd', background: '#fff', cursor: 'text' }}
                        onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    <input type="password" placeholder="Parol" className="btn" style={{ border: '1px solid #ddd', background: '#fff', cursor: 'text' }}
                        onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    <button type="submit" className="btn btn-primary">Yuborish</button>
                </form>
                <p style={{ marginTop: '15px', textAlign: 'center' }}>
                    Allaqachon bormisiz? <Link to="/login">Kirish</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;