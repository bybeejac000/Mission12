import { useEffect, useState } from 'react';

function Categories({
  selectedCategories,
  onCheckBoxChange,
}: {
  selectedCategories: string[];
  onCheckBoxChange: (categories: string[]) => void;
}) {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch(
        'https://booksmission-backend.azurewebsites.net/api/BookAPI/categories',
        {
          credentials: 'include',
        }
      );
      const data = await response.json();
      setCategories(data.categories); // Ensure the data is correctly structured
    };
    fetchCategories();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  function handleChange({ target }: { target: HTMLInputElement }) {
    const updatedCategories = selectedCategories.includes(target.value)
      ? selectedCategories.filter((c) => c !== target.value)
      : [...selectedCategories, target.value];

    onCheckBoxChange(updatedCategories);
  }

  return (
    <>
      <label>Choose categories:</label>
      {categories.map((c) => (
        <div key={c}>
          <input
            type="checkbox"
            id={c}
            name="categories"
            value={c}
            onChange={handleChange}
          />
          <label htmlFor={c}>{c}</label>
        </div>
      ))}
    </>
  );
}

export default Categories;
