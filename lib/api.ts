import axios from "axios";
import type { Note, NoteTag } from "@/types/note";

const BASE_URL = "https://notehub-public.goit.study/api";
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  page: number,
  search: string = "",
  tag?: string,
): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = {
    page,
  };
  if (search.trim() !== "") {
    params.search = search;
  }

  if (tag) {
    params.tag = tag;
  }

  const { data } = await instance.get<FetchNotesResponse>("/notes", { params });
  return data;
};

export interface CreateNote {
  title: string;
  content: string;
  tag: NoteTag;
}

export const createNote = async (note: CreateNote): Promise<Note> => {
  const { data } = await instance.post<Note>("/notes", note);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await instance.delete<Note>(`/notes/${id}`);
  return data;
};

export const fetchNotesById = async (id: string): Promise<Note> => {
  const { data } = await instance.get<Note>(`/notes/${id}`);
  return data;
};
