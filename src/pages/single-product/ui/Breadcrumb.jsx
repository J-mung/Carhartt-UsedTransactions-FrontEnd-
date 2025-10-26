import { Link } from 'react-router-dom';

// Dynamic Breadcrumb 컴포넌트
export default function Breadcrumb({ categories, currentCategoryId }) {
  if (!categories || !currentCategoryId) {
    return null;
  }

  // Array일 경우 > 마지막 ID 사용
  const targetId = Array.isArray(currentCategoryId)
    ? currentCategoryId[currentCategoryId.length - 1] // Take last item
    : currentCategoryId;

  const findCategoryPath = (categoryList, targetId, path = []) => {
    for (const category of categoryList) {
      const currentPath = [...path, category];

      if (category.category_id === targetId) {
        return currentPath;
      }

      if (category.children && category.children.length > 0) {
        const foundPath = findCategoryPath(
          category.children,
          targetId,
          currentPath
        );
        if (foundPath) return foundPath;
      }
    }
    return null;
  };

  const path = findCategoryPath(categories, targetId);

  if (!path) {
    return (
      <>
        <Link to="/" className="breadcrumb__link">
          홈
        </Link>
      </>
    );
  }

  const filteredPath = path.filter((cat) => cat.category_id !== 0);

  return (
    <div className="breadcrumb">
      <Link to="/" className="breadcrumb__link">
        홈
      </Link>
      {filteredPath.map((category, index) => (
        <span key={category.category_id}>
          <span className="breadcrumb__separator">&gt;</span>
          {index === filteredPath.length - 1 ? (
            <span className="breadcrumb__current">
              {category.category_name}
            </span>
          ) : (
            <Link
              to={`/products?category=${category.category_id}`}
              className="breadcrumb__link"
            >
              {category.category_name}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
}
