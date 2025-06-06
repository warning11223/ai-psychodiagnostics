import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type {Section} from "../../types";

interface QuestionState {
    answers: { [key: string]: string }; // Ответы пользователя
    loading: boolean; // Состояние загрузки
    surveyData: Section[]; // Данные анкеты
    error: string | null; // Ошибка
}

const initialState: QuestionState = {
    answers: {},
    loading: false,
    surveyData: [],
    error: null,
};

// Загрузка анкеты
export const fetchSurveyData = createAsyncThunk(
    'questions/fetchSurveyData',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/questions.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

const questionsSlice = createSlice({
    name: 'questions',
    initialState,
    reducers: {
        setAnswer: (state, action: PayloadAction<{ questionId: string | number, value: string }>) => {
            const { questionId, value } = action.payload;
            state.answers[questionId] = value;

            // Удаляем ключ, если ответ пустой
            if (value === '') {
                delete state.answers[questionId];
            }
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSurveyData.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSurveyData.fulfilled, (state, action) => {
                state.surveyData = action.payload;
                state.loading = false;
            })
            .addCase(fetchSurveyData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setAnswer, setLoading } = questionsSlice.actions;

export default questionsSlice.reducer;
