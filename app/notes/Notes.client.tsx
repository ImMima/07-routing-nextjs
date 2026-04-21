"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import css from "./NotePage.module.css";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";

import { fetchNotes } from "@/lib/api";
import { useDebouncedCallback } from "use-debounce";
import type { FetchNotesResponse } from "@/lib/api";

type Props = {
  tag?: string;
};

export default function NotesClient({ tag }: Props) {
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearch = useDebouncedCallback((event: string) => {
    setSearch(event);
    setPage(1);
  }, 500);

  const { data } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", page, search, tag],
    queryFn: () => fetchNotes(page, search, tag),
    placeholderData: keepPreviousData,
  });
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearch} />
        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={page}
            pageCount={data.totalPages}
            onPageChange={setPage}
          />
        )}
        <button className={css.button} onClick={() => setModal(true)}>
          Create Note +
        </button>
      </header>
      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
      {modal && (
        <Modal onClose={() => setModal(false)}>
          {<NoteForm onClose={() => setModal(false)} />}
        </Modal>
      )}
    </div>
  );
}
