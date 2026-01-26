export type Classes = {
  id: number;
  name: string;
  shift: string;
  course: {
    id: number;
    name: string;
  } | null;
};
