import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminPanel = () => {
    const [formData, setFormData] = useState({
        title: '',
        isbn: '',
        categoryId: 1, // Default: Badiiy Adabiyot
        year: '',
        copies: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/books/add', formData);
            alert("Kitob muvaffaqiyatli qo'shildi!");
            // Formani tozalash
            setFormData({ title: '', isbn: '', categoryId: 1, year: '', copies: '' });
        } catch (error) {
            alert("Xatolik: " + (error.response?.data?.error || "Server xatosi"));
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>🛠 Admin Panel</h1>
                <Link to="/" className="btn" style={{ width: 'auto', background: '#95a5a6', color: 'white', textDecoration: 'none' }}>
                    Asosiy menyuga
                </Link>
            </div>

            <div className="card">
                <h2>Yangi kitob qo'shish</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                    <label>Kitob nomi:</label>
                    <input type="text" className="btn" style={{ background: 'white', border: '1px solid #ddd', cursor: 'text', textAlign: 'left' }}
                        value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />

                    <label>ISBN (Kod):</label>
                    <input type="text" className="btn" style={{ background: 'white', border: '1px solid #ddd', cursor: 'text', textAlign: 'left' }}
                        value={formData.isbn} onChange={e => setFormData({...formData, isbn: e.target.value})} required />

                    <label>Janr (ID):</label>
                    <select className="btn" style={{ background: 'white', border: '1px solid #ddd' }}
                        value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
                        <option value="1">Badiiy Adabiyot</option>
                        <option value="2">Dasturlash va IT</option>
                        <option value="3">Biznes</option>
                        <option value="4">Tarix</option>
                    </select>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <label>Yil:</label>
                            <input type="number" className="btn" style={{ background: 'white', border: '1px solid #ddd', cursor: 'text' }}
                                value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} required />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>Nusxalar soni:</label>
                            <input type="number" className="btn" style={{ background: 'white', border: '1px solid #ddd', cursor: 'text' }}
                                value={formData.copies} onChange={e => setFormData({...formData, copies: e.target.value})} required />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary">Bazaga qo'shish</button>
                </form>
            </div>
        </div>
    );
};

export default AdminPanel;