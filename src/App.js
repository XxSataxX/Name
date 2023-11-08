import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import './App.css';

const ArticleListItem = ({ article, onDelete }) => {
  const handleDelete = () => {
    onDelete(article.id);
  };

  return (
    <div key={article.id} className={`Article ${article.category}`}>
      <div className="ArticleContainer">
        <div className="ArticleText">
          <h3>Главный заголовок:</h3>
          <h2>{article.title}</h2>
          <h3>Краткое содержание статьи:</h3>
          <p>{article.summary}</p>
          <p>вид : {article.category}</p>
          <div className="ButtonContainer1">
  <Link to={`/article/${article.id}`} className="LinkReadMore">далее</Link>
  </div>
  <div className="ButtonContainer">
  <Link to={`/edit/${article.id}`} className="LinkEdit">Редакт</Link>
  </div>
  <div className="ButtonContainer2">
  <button className="ButtonDelete" onClick={handleDelete}>delete</button>
</div>
        </div>
        {article.image && (
          <div className="ArticleImage">
            <img src={article.image} alt={article.title} />
          </div>
        )}
      </div>
    </div>
  );
};

const ArticleList = ({ articles, onDelete, onFilterChange }) => {
  return (
    <>
      <select onChange={onFilterChange}>
        <option value="все">Все</option>
        <option value="технологии">Технологии</option>
        <option value="спорт">Спорт</option>
        <option value="путешествия">Путешествия</option>
      </select>

      <div>
        {articles.map((article) => (
          <ArticleListItem key={article.id} article={article} onDelete={onDelete} />
        ))}
      </div>
    </>
  );
};

const ArticleDetail = ({ articles, onAddComment }) => {
  let { id } = useParams();
  let article = articles.find((article) => article.id === id);
  let navigate = useNavigate();
  
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  const handleSubmitComment = (commentText) => {
    onAddComment(article.id, commentText);
  };

  return (
    <div>
      {article ? (
        <>
          {isImageExpanded ? (
  <div className="ExpandedImageOverlay" onClick={() => setIsImageExpanded(false)}>
    <img
      src={article.image}
      alt={article.title}
      className="ExpandedImage"
    />
  </div>
) : (
  article.image && (
    <div className="ImageContainer">
      <img
        src={article.image}
        alt={article.title}
        style={{ width: '500px', height: '350px', cursor: 'pointer' }}
        onClick={() => setIsImageExpanded(true)}
      />
    </div>
  )
)}
          <h1>{article.title}</h1>
          <p>{article.content}</p>
          <CommentList comments={article.comments} />
          <AddComment onAddComment={handleSubmitComment} />
        </>
      ) : (
        <p>Статья не найдена.</p>
      )}
    </div>
  );
};

const CommentList = ({ comments }) => {
  return (
    <div>
      {comments.length > 0 ? (
        <>
          <h3>Комментарии:</h3>
          {comments.map((comment, index) => (
            <div key={index}>
              <p>{comment}</p>
            </div>
          ))}
        </>
      ) : (
        <p>Комментариев пока нет.</p>
      )}
    </div>
  );
};

const AddComment = ({ onAddComment }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddComment(comment);
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Комментарий:
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} required />
      </label>
      <button type="submit">Добавить комментарий</button>
    </form>
  );
};

const AddArticle = ({ onAddArticle }) => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('технологии');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const articleId = Date.now().toString();
    onAddArticle({
      id: articleId,
      title,
      summary,
      content,
      category,
      image,
      comments: [],
    });
    setTitle('');
    setSummary('');
    setContent('');
    setCategory('технологии');
    setImage(null);
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Заголовок:
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label>
        Краткое описание:
        <textarea value={summary} onChange={(e) => setSummary(e.target.value)} required />
      </label>
      <label>
        Содержание статьи:
        <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
      </label>
      <label>
        Категория:
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="технологии">Технологии</option>
          <option value="спорт">Спорт</option>
          <option value="путешествия">Путешествия</option>
        </select>
      </label>
      <label>
        Изображение:
        <input type="file" onChange={handleImageChange} />
        {image && <img src={image} alt="Preview" style={{ width: '500px', height: '350px' }} />}
      </label>
      <button type="submit">Добавить статью</button>
    </form>
  );
};

const EditArticle = ({ articles, onUpdateArticle }) => {
  let { id } = useParams();
  let article = articles.find((article) => article.id === id);
  let navigate = useNavigate();

  const [title, setTitle] = useState(article.title);
  const [summary, setSummary] = useState(article.summary);
  const [content, setContent] = useState(article.content);
  const [category, setCategory] = useState(article.category);
  const [image, setImage] = useState(article.image);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateArticle(id, title, summary, content, category, image);
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Заголовок:
        <input type="text" value={title} onChange={handleTitleChange} required />
      </label>
      <label>
        описание:
        <textarea value={summary} onChange={(e) => setSummary(e.target.value)} required />
      </label>
      <label>
        Содержание статьи:
        <textarea value={content} onChange={handleContentChange} required />
      </label>
      <label>
        Категория:
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="технологии">Технологии</option>
          <option value="спорт">Спорт</option>
          <option value="путешествия">Путешествия</option>
        </select>
      </label>
      <label>
        Изображение:
        <input type="file" onChange={handleImageChange} />
        {image && <img src={image} alt="Preview" style={{ width: '100px', height: '100px' }} />}
      </label>
      <button type="submit">Сохранить изменения</button>
    </form>
  );
};

const App = () => {
  const [articles, setArticles] = useState([]);

  const [filter, setFilter] = useState('все');

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const addNewArticle = (newArticle) => {
    setArticles((prevArticles) => [...prevArticles, newArticle]);
  };

  const updateArticle = (id, title, summary, content, category, image) => {
    setArticles((prevArticles) =>
      prevArticles.map((article) =>
        article.id === id ? { ...article, title, summary, content, category, image } : article
      )
    );
  };

  const addCommentToArticle = (articleId, commentText) => {
    setArticles((prevArticles) =>
      prevArticles.map((article) =>
        article.id === articleId ? { ...article, comments: [...article.comments, commentText] } : article
      )
    );
  };

  const deleteArticle = (articleId) => {
    setArticles((prevArticles) => prevArticles.filter((article) => article.id !== articleId));
  };

  const filteredArticles = filter === 'все' ? articles : articles.filter((article) => article.category === filter);

  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/">Главная</Link>
          <Link to="/add">Добавить статью</Link>
        </nav>
        <Routes>
          <Route
            path="/"
            element={<ArticleList articles={filteredArticles} onDelete={deleteArticle} onFilterChange={handleFilterChange} />}
          />
          <Route path="/article/:id" element={<ArticleDetail articles={articles} onAddComment={addCommentToArticle} />} />
          <Route path="/add" element={<AddArticle onAddArticle={addNewArticle} />} />
          <Route path="/edit/:id" element={<EditArticle articles={articles} onUpdateArticle={updateArticle} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;


