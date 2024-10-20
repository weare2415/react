import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import Rating from 'react-rating-stars-component';
import { useBookContext } from '../Context/BookContext'; 
import './Mypage.scss';

const Mypage = () => {
    const { books, reviews, editReview, deleteReview, favorites, removeFavorite, getBookDetail } = useBookContext();
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editedReviewTitle, setEditedReviewTitle] = useState("");
    const [editedReviewContent, setEditedReviewContent] = useState("");
    const [inputPassword, setInputPassword] = useState(''); 
    const [editedRating, setEditedRating] = useState(0); 
    const [loadedBooks, setLoadedBooks] = useState({});

    const handleEditReview = (review) => {
        setEditingReviewId(review.id);
        setEditedReviewTitle(review.title);
        setEditedReviewContent(review.content);
        setEditedRating(review.rating); 
    };

    const handleSaveReview = (review) => {
        if (review.password === inputPassword) { 
            editReview(editingReviewId, editedReviewTitle, editedReviewContent, editedRating); 
            setEditingReviewId(null);
            setEditedReviewTitle("");
            setEditedReviewContent("");
            setInputPassword(''); 
            setEditedRating(0);
        } else {
            alert('비밀번호가 일치하지 않습니다.');
        }
    };

    const handleDeleteReview = (review) => {
        const password = prompt('비밀번호를 입력하세요'); 
        if (password === review.password) { 
            deleteReview(review.id);
        } else {
            alert('비밀번호가 일치하지 않습니다.');
        }
    };

    const handleRemoveFavorite = (bookId) => {
        removeFavorite(bookId);
    };

    // 책 정보 가져오기
    const fetchBookDetails = async (bookId) => {
        if (loadedBooks[bookId]) {
            return loadedBooks[bookId]; 
        }
        const localBook = books.find(book => book.id === bookId);
        if (localBook) {
            return localBook;
        } else {
            try {
                const bookDetail = await getBookDetail(bookId);
                setLoadedBooks((prev) => ({ ...prev, [bookId]: bookDetail })); 
                return bookDetail;
            } catch (error) {
                console.error(`Failed to load book details for ${bookId}`, error);
                return null;
            }
        }
    };

    // 즐겨찾기 및 리뷰 목록에 대한 책 정보 미리 로드
    useEffect(() => {
        const bookIds = [...reviews.map(review => review.bookId), ...favorites];
        bookIds.forEach((bookId) => {
            if (!loadedBooks[bookId]) {
                fetchBookDetails(bookId); // 각 책에 대한 상세 정보를 로드
            }
        });
    }, [reviews, favorites, loadedBooks]); // reviews와 favorites가 변경될 때마다 책 정보 로드

    return (
        <div className="container">
            <h1>My Page</h1>

            {/* 리뷰 목록 */}
            <div>
                <h2>내 리뷰 목록</h2>
                <ul>
                    {reviews.length > 0 ? (
                        reviews.map((review) => {
                            const bookDetails = loadedBooks[review.bookId] || books.find(b => b.id === review.bookId); // 로드된 책 정보 사용

                            return (
                                <li key={`review-${review.id}`}>
                                    {editingReviewId === review.id ? (
                                        <div>
                                            <input
                                                type="text"
                                                value={editedReviewTitle}
                                                onChange={(e) => setEditedReviewTitle(e.target.value)}
                                                placeholder="리뷰 제목"
                                            />
                                            <textarea
                                                value={editedReviewContent}
                                                onChange={(e) => setEditedReviewContent(e.target.value)}
                                                placeholder="리뷰 내용"
                                            />
                                            <input
                                                type="password"
                                                value={inputPassword}
                                                onChange={(e) => setInputPassword(e.target.value)}
                                                placeholder="비밀번호"
                                                required
                                            />
                                            {/* 별점 수정 기능 */}
                                            <Rating
                                                count={5}
                                                size={24}
                                                value={editedRating}
                                                onChange={(newRating) => setEditedRating(newRating)}
                                            />
                                            <button onClick={() => handleSaveReview(review)}>저장</button>
                                            <button onClick={() => setEditingReviewId(null)}>취소</button>
                                        </div>
                                    ) : (
                                        <div>
                                            {bookDetails ? (
                                                <div>
                                                    {/* 책 미리보기 이미지 및 제목에 링크 추가 */}
                                                    <Link to={`/books/${review.bookId}`}>
                                                        <h3>{bookDetails.volumeInfo.title}</h3>
                                                        {bookDetails.volumeInfo.imageLinks && (
                                                            <img src={bookDetails.volumeInfo.imageLinks.thumbnail} alt={bookDetails.volumeInfo.title} />
                                                        )}
                                                    </Link>
                                                    <p>{bookDetails.volumeInfo.authors ? bookDetails.volumeInfo.authors.join(", ") : "저자 정보 없음"}</p>
                                                </div>
                                            ) : (
                                                <p>책 정보를 불러오는 중입니다...</p>
                                            )}
                                            <h4>{typeof review.title === 'string' ? review.title : '제목 없음'}</h4>
                                            <p>{typeof review.content === 'string' ? review.content : '내용 없음'}</p>
                                            {/* 별점 표시 */}
                                            <Rating
                                                count={5}
                                                size={20}
                                                value={review.rating}
                                                edit={false} // 읽기 전용 별점
                                            />
                                            <button onClick={() => handleEditReview(review)}>수정</button>
                                            <button onClick={() => handleDeleteReview(review)}>삭제</button>
                                        </div>
                                    )}
                                </li>
                            );
                        })
                    ) : (
                        <li className="no-data">리뷰가 없습니다.</li>
                    )}
                </ul>
            </div>

            {/* 즐겨찾기 목록 */}
            <div>
                <h2>내 즐겨찾기 목록</h2>
                <ul>
                    {favorites.length > 0 ? (
                        favorites.map((favoriteId) => {
                            const bookDetails = loadedBooks[favoriteId] || books.find(b => b.id === favoriteId); // 로드된 책 정보 사용

                            return (
                                <li key={`favorite-${favoriteId}`}>
                                    {bookDetails ? (
                                        <div>
                                            {/* 책 미리보기에 링크 추가 */}
                                            <Link to={`/books/${favoriteId}`}>
                                                <h3>{bookDetails.volumeInfo.title}</h3>
                                                {bookDetails.volumeInfo.imageLinks && (
                                                    <img src={bookDetails.volumeInfo.imageLinks.thumbnail} alt={bookDetails.volumeInfo.title} />
                                                )}
                                            </Link>
                                            <p>{bookDetails.volumeInfo.authors ? bookDetails.volumeInfo.authors.join(", ") : "저자 정보 없음"}</p>
                                            <button onClick={() => handleRemoveFavorite(favoriteId)}>즐겨찾기 삭제</button>
                                        </div>
                                    ) : (
                                        <p>책 정보를 불러오는 중입니다...</p>
                                    )}
                                </li>
                            );
                        })
                    ) : (
                        <li className="no-data">즐겨찾기가 없습니다.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Mypage;
