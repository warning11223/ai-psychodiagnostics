import './App.css';
import {Link, Route, Routes} from 'react-router-dom';
import {UIButton} from "./components/ui/button";
import Test from "./components/Test";
import {useDispatch} from "react-redux";
import {setStep} from "./store/slices/uploadPhotosSlice.ts";

function App() {
    const dispatch = useDispatch();

    return (
        <div className="container">
            <img className="logo" src="/img/cover.png" alt="cover" width={700}/>

            <Link to="/test" onClick={() => dispatch(setStep(1))}>
                <UIButton>
                    Начать тест
                    <img src="/icons/right.svg" alt="right" width={24} height={24} />
                </UIButton>
            </Link>
        </div>
    );
}

function AppWrapper() {
    return (
        <Routes>
            <Route path="/" element={<App/>}/>
            <Route path="/test" element={<Test/>}/>
        </Routes>
    );
}

export default AppWrapper;
