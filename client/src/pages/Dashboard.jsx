import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const [books, setBooks] = useState([])
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // 1. Tizimga kirganmi yo'qmi tekshiramiz
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    if (!storedUser || !token) {
      navigate('/login') // Kirmagan bo'lsa, Login sahifasiga haydaymiz
    } else {
      setUser(JSON.parse(storedUser))
      fetchBooks()
    }
  }, [])

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/books')
      setBooks(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleBorrow = async bookId => {
    try {
      // Endi haqiqiy User ID ni yuboramiz
      await axios.post('http://localhost:5000/api/books/borrow', {
        userId: user.id,
        bookId: bookId,
      })
      alert('Kitob olindi!')
      fetchBooks()
    } catch (error) {
      alert(error.response?.data?.error)
    }
  }

  const handleLogout = () => {
    localStorage.clear() // Xotirani tozalash
    navigate('/login')
  }

  return (
    <div className='container'>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h1>📚 Kutubxona</h1>
        <div>
          <span style={{ marginRight: '15px', fontWeight: 'bold' }}>
            👤 {user?.firstName} {user?.role === 'admin' ? '(Admin)' : ''}
          </span>
          {user?.role === 'admin' && (
            <Link
              to='/admin'
              className='btn'
              style={{
                marginRight: '10px',
                background: '#2c3e50',
                color: 'white',
                textDecoration: 'none',
                padding: '10px',
              }}
            >
              🛠 Admin Panel
            </Link>
          )}
          <Link
            to='/profile'
            className='btn'
            style={{
              marginRight: '10px',
              background: '#3498db',
              color: 'white',
              textDecoration: 'none',
              padding: '10px',
            }}
          >
            Mening Kitoblarim
          </Link>
          <button
            onClick={handleLogout}
            className='btn'
            style={{ width: 'auto', background: '#e74c3c', color: 'white' }}
          >
            Chiqish
          </button>
        </div>
      </div>

      <div className='grid'>
        {books.map(book => (
          <div key={book.id} className='card'>
            <div>
              <h2>{book.title}</h2>
              <p className='author'>ISBN: {book.isbn}</p>
              <div className='info-row'>
                <span className='badge'>{book.category}</span>
                <strong
                  style={{ color: book.available_copies > 0 ? 'green' : 'red' }}
                >
                  {book.available_copies} ta
                </strong>
              </div>
            </div>
            <button
              className={`btn ${
                book.available_copies > 0 ? 'btn-primary' : 'btn-disabled'
              }`}
              onClick={() => handleBorrow(book.id)}
              disabled={book.available_copies === 0}
            >
              Olish
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
