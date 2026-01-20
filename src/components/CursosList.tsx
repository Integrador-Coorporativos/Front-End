import { useEffect, useState } from 'react';
import './CursosList.css'; // Importando o CSS que criamos
import { getCourses } from '../api/services/courseService';

interface Course {
  id: number;
  name: string;
  description: string | null;
}

export function CursosList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
    // Criamos uma função interna para usar async/await
    const loadData = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar cursos.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div className="loading-state">Carregando cursos...</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="courses-container">
      <h1 className="courses-title text-3xl font-bold">Cursos - IF Performance</h1>
      
      <div className="courses-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <div>
              <h2 className="course-name font-bold">{course.name}</h2>
              <p className="course-description">
                {course.description || "Este curso ainda não possui uma descrição detalhada cadastrada no sistema."}
              </p>
            </div>
            
            <div className="course-footer">
              <span className="course-id">#{course.id}</span>
              <span className="course-tag">Acadêmico</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}