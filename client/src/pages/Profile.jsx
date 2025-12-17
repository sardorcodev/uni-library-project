import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Profile = () => {
    const [loans, setLoans] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            fetchMyLoans(storedUser.id);
        }
    }, []);

    const fetchMyLoans = async (userId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/books/my-loans/${userId}`);
            setLoans(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleReturn = async (loanId, bookId) => {
        if(!window.confirm("Bu kitobni haqiqatdan qaytarmoqchimisiz?")) return;

        try {
            await axios.post('http://localhost:5000/api/books/return', {
                loanId,
                bookId // Qaysi kitobligini bilishimiz kerak, sonini ko'paytirish uchun
            });
            alert("Kitob qaytarildi!");
            fetchMyLoans(user.id); // Ro'yxatni yangilaymiz
        } catch (error) {
            alert("Xatolik bo'ldi");
        }
    };

    return (
        <div className="container">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h1>👤 Mening Profilim: {user?.firstName}</h1>
                <Link to="/" className="btn" style={{width: 'auto', background: '#3498db', color: 'white', textDecoration: 'none'}}>
                    ⬅️ Kitoblar bo'limiga qaytish
                </Link>
            </div>

            <div className="card">
                <h2>📚 Olingan kitoblar tarixi</h2>
                {loans.length === 0 ? (
                    <p>Siz hali kitob olmagansiz.</p>
                ) : (
                    <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr style={{ background: '#ecf0f1' }}>
                                <th>Kitob</th>
                                <th>Olgan vaqtingiz</th>
                                <th>Muddat</th>
                                <th>Holat</th>
                                <th>Amal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loans.map((loan) => (
                                <tr key={loan.id}>
                                    <td>{loan.title}</td>
                                    <td>{new Date(loan.loan_date).toLocaleDateString()}</td>
                                    <td>{new Date(loan.due_date).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge`} style={{
                                            background: loan.status === 'active' ? '#fff3cd' : '#d4edda',
                                            color: loan.status === 'active' ? '#856404' : '#155724'
                                        }}>
                                            {loan.status === 'active' ? 'Faol (Qaytarilmagan)' : 'Qaytarilgan'}
                                        </span>
                                    </td>
                                    <td>
                                        {loan.status === 'active' && (
                                            <button 
                                                className="btn" 
                                                style={{ background: '#e74c3c', color: 'white', padding: '5px 10px', fontSize: '14px' }}
                                                onClick={() => handleReturn(loan.id, loan.book_id)} // book_id kerak emas aslida query uchun, lekin backendda updatega kerak
                                            >
                                                Qaytarish
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Profile;