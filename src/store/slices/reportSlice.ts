import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface ReportState {
    reportStatus: 'loading' | 'в обработке' | 'ready' | 'error';
    pdfUrl: string;
}

const initialState: ReportState = {
    reportStatus: 'loading',
    pdfUrl: '',
};

export const fetchReportStatus = createAsyncThunk(
    'report/fetchReportStatus',
    async (taskId: string) => {
        const response = await fetch(`https://sirius-draw-test-94500a1b4a2f.herokuapp.com/report/${taskId}`);

        if (!response.ok) {
            throw new Error('Не удалось получить статус отчета');
        }

        const data = await response.json();

        console.log(data)
        return data;
    }
);

const reportSlice = createSlice({
    name: 'report',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchReportStatus.pending, (state) => {
                state.reportStatus = 'loading';
            })
            .addCase(fetchReportStatus.fulfilled, (state, action) => {
                const { status, reportUrl } = action.payload;
                state.reportStatus = status;
                state.pdfUrl = reportUrl;
            })
            .addCase(fetchReportStatus.rejected, (state) => {
                state.reportStatus = 'error';
            });
    },
});

export default reportSlice.reducer;
