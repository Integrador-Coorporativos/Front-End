import './CursosList.css';
import { useCourses } from '../hooks/courses/useCourses';

export function CursosList() {
  // Chamamos o nosso hook customizado
  const { courses, loading, error } = useCourses();

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
                {course.description || "Este curso ainda não possui uma descrição..."}
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