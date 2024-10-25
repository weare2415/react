React 및 React Router 도입
BrowserRouter를 사용하여 각 페이지에 대한 경로(Route)를 정의하고, Routes와 Route를 통해 컴포넌트별 경로 설정을 구성

React Context API를 활용한 전역 상태 관리
BookProvider를 Context API로 정의하여, Header, SearchResults, BookDetail 등 컴포넌트에서 검색 결과나 책 관련 데이터를 쉽게 공유

Context 및 상태 관리
BookContext: 앱 전반에서 책, 검색 결과, 로딩 상태, 오류, 리뷰, 즐겨찾기를 접근할 수 있도록 컨텍스트를 제공합니다.
useReducer 훅을 사용하여 bookListReducer로 books와 searchResults 상태를 관리합니다.

Reducer 
bookListReducer: 책과 관련된 상태를 관리합니다. 성공적인 책 데이터 불러오기(FETCH_SUCCESS), 실패(FETCH_ERROR), 검색 성공(SEARCH_SUCCESS) 등의 
액션을 통해 책 목록과 로딩 상태, 오류 메시지를 업데이트

무한 스크롤
handleScroll: 페이지의 스크롤 위치를 감지하여 하단에 도달하면 loadMoreBooks()를 호출하여 추가 데이터 가져옵니다.

URL에서 검색어 추출
new URLSearchParams(location.search).get('q')를 통해 쿼리 문자열에서 q 값을 추출해 검색어로 사용

검색 API 호출
useEffect()를 사용하여 query가 변경될 때마다 searchBooks(query) 함수를 호출합니다.
searchBooks(query)는 Google Books API에서 데이터를 가져오며, BookContext의 상태를 업데이트합니다.

검색 결과 렌더링
searchResults, loading, error 값을 useBookContext()로부터 가져옵니다.
검색된 책을 map()을 사용해 리스트 형태로 렌더링합니다. 각 책에 대한 제목, 이미지, 설명 등을 표시하고, 클릭 시 해당 책의 상세 페이지로 이동할 수 있도록 Link 컴포넌트를 사용

별점 기능
import Rating from 'react-rating-stars-component'
별점 기능을 제공하는 라이브러리

CRUD 기능 
Create 
새 리뷰를 작성하고 제출할 수 있는 기능 구현, handleReviewSubmit 함수를 호출하여 리뷰를 추가
Read
선택한 책에 대한 리뷰는 reviews 배열에서 bookId에 따라 필터링
Update 
handleReviewEdit 함수가 호출되어 제목, 내용, 별점이 입력하고 수정 후 editReview 함수를 통해 리뷰를 업데이트
Delete 
handleReviewDelete 함수를 호출하여 리뷰를 삭제합니다.

