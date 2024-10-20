import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ImageSlider from '../components/ImageSlider'; 
import { BookContext } from '../Context/BookContext'; 
import './Home.scss'; 

const Home = () => {
  const { books } = useContext(BookContext); 

  if (!books || books.length === 0) {
    return <p>책 목록을 불러오는 중입니다...</p>; // books가 비어 있을 경우
  }

  return (
    <div className="home">
      {/* ImageSlider 추가 */}
      <div className="image-slider-container">
        <ImageSlider />
      </div>

      <div className="title"><h1>도서 목록</h1></div>

      {books.length > 0 ? (
        <div className="book-list">
          {books.map((book) => (
            <div className="book-item" key={book.id}>
              {/* 책 제목에 Link 추가 */}
              <h3 className="book-title">
                <Link to={`/books/${book.id}`}>{book.volumeInfo.title}</Link>
              </h3>
              <p className="book-author">저자: {book.volumeInfo.authors?.join(', ') || '저자 정보 없음'}</p>

              {/* 이미지에 Link 추가 */}
              <Link to={`/books/${book.id}`}>
                {book.volumeInfo.imageLinks?.thumbnail ? (
                  <img src={book.volumeInfo.imageLinks.thumbnail} alt={`${book.volumeInfo.title} 표지`} />
                ) : (
                  <img src="기본 이미지 URL" alt="기본 책 표지" />
                )}
              </Link>

              <p>출판일: {book.volumeInfo.publishedDate ? new Date(book.volumeInfo.publishedDate).toLocaleDateString() : '출판일 정보 없음'}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>책 목록이 없습니다.</p>
      )}
    </div>
  );
};

export default Home;
