import { HashRouter, Routes, Route } from 'react-router-dom';
import { NotesProvider } from './contexts/NotesContext';
import { TodosProvider } from './contexts/TodosContext';
import { SchedulesProvider } from './contexts/SchedulesContext';
import { QAProvider } from './contexts/QAContext';
import { BottomNav } from './components/layout/BottomNav';
import { HomePage } from './pages/HomePage';
import { QuickCapturePage } from './pages/QuickCapturePage';
import { WeekPlanPage } from './pages/WeekPlanPage';
import { InterviewPrepPage } from './pages/InterviewPrepPage';
import { AddQAPage } from './pages/AddQAPage';
import styles from './App.module.css';

export default function App() {
  return (
    <HashRouter>
      <NotesProvider>
        <TodosProvider>
          <SchedulesProvider>
            <QAProvider>
              <div className={styles.appShell}>
                <div className={styles.pageContainer}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/capture" element={<QuickCapturePage />} />
                    <Route path="/capture/:id" element={<QuickCapturePage />} />
                    <Route path="/week-plan" element={<WeekPlanPage />} />
                    <Route path="/interview-prep" element={<InterviewPrepPage />} />
                    <Route path="/add-qa" element={<AddQAPage />} />
                    <Route path="/edit-qa/:id" element={<AddQAPage />} />
                  </Routes>
                </div>
                <BottomNav />
              </div>
            </QAProvider>
          </SchedulesProvider>
        </TodosProvider>
      </NotesProvider>
    </HashRouter>
  );
}
