import { Note, NoteTarget } from 'src/types';
import {
  _getData,
  _mockResponse,
  _paginate,
  _escapeCsv,
  _download,
  _filterString,
  _filterArray,
  _filterExact,
  _compareOptionalTransString,
} from './_utils';
import { _getGoals } from './goal';
import { _getOutputs } from './output';
import { _getMissions } from './mission';
import { _getUnitObjectives } from './unitObjective';
import { _getLoggedUser, _getUsers } from './user';

const defaultNotes: Note[] = [];

export function _getNotes(): Note[] {
  const notes = _getData<Note>('data_notes', defaultNotes);
  return notes;
}

function _updateNotes(notes: Note[]) {
  localStorage.data_notes = JSON.stringify(notes);
}

export function getNotes(target: NoteTarget, targetId: string) {
  return _mockResponse(() => {
    const users = _getUsers();
    return _getNotes()
      .filter(note => note.target === target && note.targetId === targetId)
      .map(note => {
        return {
          ...note,
          author: users.find(x => x.id === note.authorId),
        };
      });
  });
}

export function createNote(values: Note) {
  return _mockResponse(() => {
    const { user } = _getLoggedUser();
    const users = _getUsers();
    const item: Note = {
      ...values,
      authorId: user!.id,
      createdAt: new Date().toISOString(),
      id: String(Date.now()),
    };
    const items = _getNotes();
    _updateNotes([...items, item]);
    return {
      ...item,
      author: users.find(x => x.id === item.authorId),
    };
  });
}

export function updateNote(id: string, values: Note) {
  return _mockResponse(() => {
    const items = _getNotes();
    const newItems = items.map(item => {
      if (item.id === id) {
        return values;
      }
      return item;
    });
    _updateNotes(newItems);
    return values;
  });
}

export function deleteNote(id: string) {
  return _mockResponse(() => {
    const items = _getNotes();
    const newItems = items.filter(item => {
      return item.id !== id;
    });
    _updateNotes(newItems);
  });
}
