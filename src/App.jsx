import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import { loadData, saveData } from './utils/storage'
import { parseFile, downloadWorkbook, SHEET_CONFIG } from './utils/excelIO'

import Dashboard from './pages/Dashboard'
import WeeklyGoals from './pages/WeeklyGoals'
import CurrentProjects from './pages/CurrentProjects'
import HobbiesGoals from './pages/HobbiesGoals'
import Budget from './pages/Budget'
import GratitudeJournal from './pages/GratitudeJournal'
import Habits from './pages/Habits'
import BooksToRead from './pages/BooksToRead'
import ReadingLog from './pages/ReadingLog'
import ShowsToWatch from './pages/ShowsToWatch'
import MoviesWatched from './pages/MoviesWatched'
import GamesToPlay from './pages/GamesToPlay'
import CookingBaking from './pages/CookingBaking'
import DayReflections from './pages/DayReflections'
import PeopleToHangOut from './pages/PeopleToHangOut'
import JobsApplied from './pages/JobsApplied'
import SymptomTracker from './pages/SymptomTracker'
import CopingMechanisms from './pages/CopingMechanisms'
import SelfHelpResources from './pages/SelfHelpResources'
import ShoppingList from './pages/ShoppingList'
import MeetupGroups from './pages/MeetupGroups'
import WasILate from './pages/WasILate'
import Current from './pages/Current'
import CheckInWith from './pages/CheckInWith'
import MorningCoffeeSites from './pages/MorningCoffeeSites'
import DayPlanGuide from './pages/DayPlanGuide'
import BadEFDayNotepad from './pages/BadEFDayNotepad'
import Gym from './pages/Gym'

function App() {
  async function handleImport(file) {
    try {
      const data = await parseFile(file)
      Object.entries(data).forEach(([key, rows]) => saveData(key, rows))
      window.location.reload()
    } catch (err) {
      alert('Failed to import file: ' + err.message)
    }
  }

  function handleExport() {
    const allData = {}
    Object.keys(SHEET_CONFIG).forEach((key) => {
      allData[key] = loadData(key)
    })
    downloadWorkbook(allData)
  }

  return (
    <Routes>
      <Route element={<Layout onImport={handleImport} onExport={handleExport} />}>
        <Route index element={<Dashboard />} />
        <Route path="weekly-goals" element={<WeeklyGoals />} />
        <Route path="current-projects" element={<CurrentProjects />} />
        <Route path="hobbies-goals" element={<HobbiesGoals />} />
        <Route path="budget" element={<Budget />} />
        <Route path="gratitude-journal" element={<GratitudeJournal />} />
        <Route path="habits" element={<Habits />} />
        <Route path="books-to-read" element={<BooksToRead />} />
        <Route path="reading-log" element={<ReadingLog />} />
        <Route path="shows-to-watch" element={<ShowsToWatch />} />
        <Route path="movies-watched" element={<MoviesWatched />} />
        <Route path="games-to-play" element={<GamesToPlay />} />
        <Route path="cooking-baking" element={<CookingBaking />} />
        <Route path="day-reflections" element={<DayReflections />} />
        <Route path="people-to-hang-out" element={<PeopleToHangOut />} />
        <Route path="jobs-applied" element={<JobsApplied />} />
        <Route path="symptom-tracker" element={<SymptomTracker />} />
        <Route path="coping-mechanisms" element={<CopingMechanisms />} />
        <Route path="self-help-resources" element={<SelfHelpResources />} />
        <Route path="shopping-list" element={<ShoppingList />} />
        <Route path="meetup-groups" element={<MeetupGroups />} />
        <Route path="was-i-late" element={<WasILate />} />
        <Route path="current" element={<Current />} />
        <Route path="check-in-with" element={<CheckInWith />} />
        <Route path="morning-coffee-sites" element={<MorningCoffeeSites />} />
        <Route path="day-plan-guide" element={<DayPlanGuide />} />
        <Route path="bad-ef-day-notepad" element={<BadEFDayNotepad />} />
        <Route path="gym" element={<Gym />} />
      </Route>
    </Routes>
  )
}

export default App
