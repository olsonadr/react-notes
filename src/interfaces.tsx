// Profile interface
export interface Profile {
  name: string;
  email: string;
  picture: string;
  notes: Note[];
}

// Note interface
export interface Note {
  note_id: number;
  name: string;
  new_name: string;
  data: string;
  orig_data: string;
}
