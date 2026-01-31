export interface EditableClass {
  id: number;
  name: string;
  shift: string;
  semester: string; 
  classId: string;  
  course: {
    id: number;
    name: string;
  } | null; 
}