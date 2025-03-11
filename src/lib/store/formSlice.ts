import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormState {
  category: string;
  title: string;
  priceMode: string;
  price: string;
  mode: string;
  location: string;
  quantity: string;
  classSize: string;
  startDate: string;
  endDate: string;
  days: string;
  gender: string;
  startTime: string;
  endTime: string;
  // ageGroup: string;
  minAge: string;
  maxAge: string;
  description: string;
  trainerId: string;
  isFavorite:boolean;
}

const initialState: FormState = {
      category: 'Music',
      title: 'Violin Class',
      priceMode:'per day',
      price: "100",
      mode: 'Offline',
      location: 'New York',
      quantity: "10",
      classSize: "1 to 1",
      startDate: '2024-09-01',
      endDate: '2024-09-10',
      days: "2",
      gender: 'Any',
      startTime: '10:00 AM',
      endTime: '12:00 PM',
      minAge: '',
      maxAge: '',
      trainerId: '',
      isFavorite:false,
      description: 'The violin, sometimes referred as a fiddle,[a] is a wooden chordophone, and is the smallest, and thus highest-pitched instrument (soprano) in regular use in the violin family. Smaller violin-type instruments exist, including the violino piccolo and the pochette, but these are virtually unused. Most violins have a hollow wooden body, and commonly have four strings (sometimes five), usually tuned in perfect fifths with notes G3, D4, A4, E5, and are most commonly played by drawing a bow across the strings.',
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setForm: (state, action: PayloadAction<Partial<FormState>>) => {
      return { ...state, ...action.payload };
    },
    resetForm: () => initialState,
  },
});

export const { setForm, resetForm } = formSlice.actions;
export default formSlice.reducer;
