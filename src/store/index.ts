import { configureStore } from '@reduxjs/toolkit';
import uploadPhotosReducer from './slices/uploadPhotosSlice';
import questionsReducer from './slices/questionsSlice';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Настройка конфигурации для Persist
const uploadPhotosPersistConfig = {
    key: "uploadPhotos",
    storage
};

const persistedUploadPhotosReducer = persistReducer(uploadPhotosPersistConfig, uploadPhotosReducer);

export const store = configureStore({
    reducer: {
        uploadPhotos: persistedUploadPhotosReducer,
        questions: questionsReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
