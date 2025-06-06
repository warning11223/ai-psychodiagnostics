import {createSlice, type PayloadAction} from '@reduxjs/toolkit';

interface UploadPhotosState {
    descItems: string[];
    descPhotos: string;
    taskId: string;
    step: number;
}

const initialState: UploadPhotosState = {
    descItems: ['Дом, дерево, человек', 'Несуществующее животное', 'Автопортрет'], // Описание файлов
    descPhotos: 'Допустимые форматы файлов: jpg, jpeg, png. Размер не более 5 МБ', // Сообщение о формате
    taskId: '', // Идентификатор задания
    step: 1, // Отслеживаем текущий шаг
};

export const uploadPhotosSlice = createSlice({
    name: 'uploadPhotos',
    initialState,
    reducers: {
        setTaskId: (state, action: PayloadAction<string>) => {
            state.taskId = action.payload;
        },
        setStep: (state, action: PayloadAction<number>) => {
            state.step = action.payload;
        }
    },
});

export const { setTaskId, setStep } = uploadPhotosSlice.actions;

export default uploadPhotosSlice.reducer;
