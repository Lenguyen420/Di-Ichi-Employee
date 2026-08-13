import { useEffect, useMemo, useState } from 'react'
import { Clock, ClipboardCheck, PlayCircle, Search, X } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '../../components/Common/Badge.jsx'
import { Button } from '../../components/Common/Button.jsx'
import { Card } from '../../components/Common/Card.jsx'
import { PlacementTestsTable } from '../../components/PlacementTests/PlacementTestsTable.jsx'
import { placementResultStatuses } from '../../datas/appStaticData.js'
import { placementTests } from '../../datas/employeePortalData.js'
import { placementTestCatalog } from '../../datas/placementTestCatalogData.js'
import { cn } from '../../utils/cn.js'

const today = new Date().toISOString().slice(0, 10)

const getScoreLabel = (correct, total) => `${Math.round((correct / total) * 60)}/60`

const getDurationSeconds = (duration) => {
  const minutes = Number(String(duration).match(/\d+/)?.[0]) || 0
  return minutes * 60
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

export const PlacementTestsPage = () => {
  const [activeTab, setActiveTab] = useState('tests')
  const [results, setResults] = useState(placementTests)
  const [searchName, setSearchName] = useState('')
  const [selectedTest, setSelectedTest] = useState(null)
  const [studentName, setStudentName] = useState('')
  const [isTesting, setIsTesting] = useState(false)
  const [answers, setAnswers] = useState({})
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false)
  const [editingResult, setEditingResult] = useState(null)
  const [editingStatus, setEditingStatus] = useState(placementResultStatuses[0])
  const filteredResults = useMemo(
    () => results.filter((item) => item.customer.toLowerCase().includes(searchName.trim().toLowerCase())),
    [results, searchName],
  )

  const openTest = (test) => {
    setSelectedTest(test)
    setStudentName('')
    setIsTesting(false)
    setAnswers({})
  }

  const startTest = () => {
    if (!studentName.trim()) {
      toast.error('Vui lòng nhập tên học sinh trước khi bắt đầu test.')
      return
    }

    setIsTesting(true)
  }

  const closeTest = () => {
    setSelectedTest(null)
    setIsTesting(false)
    setAnswers({})
    setIsExitConfirmOpen(false)
  }

  const requestCloseTest = () => {
    if (isTesting) {
      setIsExitConfirmOpen(true)
      return
    }

    closeTest()
  }

  const submitTest = ({ force = false } = {}) => {
    if (!selectedTest) return

    if (!force && Object.keys(answers).length < selectedTest.questions.length) {
      toast.error('Vui lòng trả lời đầy đủ câu hỏi trước khi nộp bài.')
      return
    }

    const correct = selectedTest.questions.reduce((total, question, index) => (
      answers[index] === question.answer ? total + 1 : total
    ), 0)
    const nextResult = {
      id: `TEST-${Date.now()}`,
      customer: studentName.trim(),
      date: today,
      score: getScoreLabel(correct, selectedTest.questions.length),
      level: selectedTest.level,
      recommendation: selectedTest.recommendation,
      status: 'Đã hoàn tất',
    }

    setResults((current) => [nextResult, ...current])
    setSearchName(studentName.trim())
    setActiveTab('results')
    closeTest()
    toast.success(force ? `Hết giờ, đã lưu kết quả test của ${nextResult.customer}.` : `Đã lưu kết quả test của ${nextResult.customer}.`)
  }

  const openEditStatus = (result) => {
    setEditingResult(result)
    setEditingStatus(result.status)
  }

  const saveResultStatus = () => {
    if (!editingResult) return

    setResults((current) => current.map((result) => (
      result.id === editingResult.id ? { ...result, status: editingStatus } : result
    )))
    setEditingResult(null)
    toast.success('Đã cập nhật trạng thái kết quả test.')
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-bold text-orange-600">Kiểm tra đầu vào</p>
          <h1 className="mt-1 text-2xl font-black text-slate-950 md:text-3xl">Danh sách bài test & kết quả</h1>
          <p className="mt-2 text-sm text-slate-500">Tạo bài test, ghi nhận kết quả, đánh giá trình độ và gợi ý khóa học.</p>
        </div>
        {/* <Button type="button" onClick={() => setActiveTab('tests')}><ClipboardCheck size={18} /> Tạo bài test</Button> */}
      </div>

      <div className="inline-flex overflow-hidden rounded-lg border border-orange-100 bg-white p-1 shadow-sm">
        <button
          className={cn(
            'h-10 rounded-md px-4 text-sm font-black transition',
            activeTab === 'tests' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-600 hover:bg-orange-50 hover:text-orange-700',
          )}
          type="button"
          onClick={() => setActiveTab('tests')}
        >
          Danh sách bài test
        </button>
        <button
          className={cn(
            'h-10 rounded-md px-4 text-sm font-black transition',
            activeTab === 'results' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-600 hover:bg-orange-50 hover:text-orange-700',
          )}
          type="button"
          onClick={() => setActiveTab('results')}
        >
          Kết quả test
        </button>
      </div>

      {activeTab === 'tests' ? (
        <div className="grid gap-5 lg:grid-cols-3">
          {placementTestCatalog.map((test) => (
            <Card key={test.id} className="rounded-lg">
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-orange-50 text-orange-600"><ClipboardCheck size={20} /></span>
                <Badge>{test.level}</Badge>
              </div>
              <h2 className="mt-4 text-xl font-black text-slate-950">{test.title}</h2>
              <p className="mt-2 text-sm font-semibold text-slate-500">{test.questions.length} câu hỏi · {test.duration}</p>
              <div className="mt-4 rounded-lg border border-orange-100 p-3">
                <p className="text-xs font-black uppercase text-slate-400">Gợi ý sau test</p>
                <p className="mt-1 font-semibold text-slate-800">{test.recommendation}</p>
              </div>
              <Button className="mt-4 w-full" variant="secondary" type="button" onClick={() => openTest(test)}>
                <PlayCircle size={18} /> Làm bài test
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <Card className="rounded-lg">
            <label className="block">
              <span className="text-sm font-black text-slate-700">Lọc theo tên học sinh</span>
              <div className="relative mt-2">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  className="h-11 w-full rounded-lg border border-orange-100 px-10 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                  placeholder="Nhập tên học sinh cần tìm"
                  value={searchName}
                  onChange={(event) => setSearchName(event.target.value)}
                />
              </div>
            </label>
          </Card>
          <PlacementTestsTable placementTests={filteredResults} onEditStatus={openEditStatus} />
        </div>
      )}

      {selectedTest && (
        <TestModal
          answers={answers}
          isTesting={isTesting}
          selectedTest={selectedTest}
          studentName={studentName}
          onAnswerChange={(questionIndex, answerIndex) => setAnswers((current) => ({ ...current, [questionIndex]: answerIndex }))}
          onClose={requestCloseTest}
          onStart={startTest}
          onStudentNameChange={setStudentName}
          onSubmit={submitTest}
          onTimeUp={() => submitTest({ force: true })}
        />
      )}
      {isExitConfirmOpen && (
        <ConfirmExitModal
          onCancel={() => setIsExitConfirmOpen(false)}
          onConfirm={closeTest}
        />
      )}
      {editingResult && (
        <EditStatusModal
          result={editingResult}
          status={editingStatus}
          statuses={placementResultStatuses}
          onChange={setEditingStatus}
          onClose={() => setEditingResult(null)}
          onSave={saveResultStatus}
        />
      )}
    </div>
  )
}

const TestModal = ({ answers, isTesting, selectedTest, studentName, onAnswerChange, onClose, onStart, onStudentNameChange, onSubmit, onTimeUp }) => {
  const [remainingSeconds, setRemainingSeconds] = useState(getDurationSeconds(selectedTest.duration))

  useEffect(() => {
    setRemainingSeconds(getDurationSeconds(selectedTest.duration))
  }, [selectedTest])

  useEffect(() => {
    if (!isTesting) return undefined

    const timer = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(timer)
          onTimeUp()
          return 0
        }

        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [isTesting, onTimeUp])

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/20 p-4">
      <button className="absolute inset-0 cursor-default" type="button" onClick={onClose} aria-label="Đóng bài test" />
      <section className="relative z-10 w-full max-w-4xl overflow-hidden rounded-lg border border-orange-100 bg-white shadow-2xl shadow-slate-950/20">
        <div className="flex items-start justify-between gap-4 border-b border-orange-100 px-5 py-4">
          <div>
            <p className="text-sm font-bold text-orange-600">Bài test đầu vào</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">{selectedTest.title}</h2>
            <p className="mt-1 text-sm text-slate-500">Level {selectedTest.level} · {selectedTest.duration}</p>
          </div>
          <div className="flex items-center gap-2">
            {isTesting && (
              <span className="inline-flex h-10 items-center gap-2 rounded-lg border border-orange-100 bg-orange-50 px-3 text-sm font-black text-orange-700">
                <Clock size={17} /> {formatTime(remainingSeconds)}
              </span>
            )}
            <Button className="shrink-0" variant="ghost" type="button" onClick={onClose} aria-label="Đóng chi tiết">
              <X size={18} />
            </Button>
          </div>
        </div>

        <div className="max-h-[72vh] overflow-y-auto p-5">
          {!isTesting ? (
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-black text-slate-700">Tên học sinh</span>
                <input
                  className="mt-2 h-11 w-full rounded-lg border border-orange-100 px-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                  placeholder="Nhập tên học sinh làm bài"
                  value={studentName}
                  onChange={(event) => onStudentNameChange(event.target.value)}
                />
              </label>
              <Button type="button" onClick={onStart}><PlayCircle size={18} /> Bắt đầu test</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border border-orange-100 bg-orange-50/60 p-3">
                <p className="text-sm font-black text-slate-950">Học sinh: {studentName}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">Chọn một đáp án cho mỗi câu hỏi rồi bấm nộp bài.</p>
              </div>
              {selectedTest.questions.map((question, questionIndex) => (
                <div key={question.question} className="rounded-lg border border-orange-100 p-4">
                  <p className="font-black text-slate-950">Câu {questionIndex + 1}. {question.question}</p>
                  <div className="mt-3 grid gap-2 md:grid-cols-2">
                    {question.options.map((option, answerIndex) => (
                      <label key={option} className="flex min-h-11 items-center gap-3 rounded-lg border border-orange-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-orange-50">
                        <input
                          className="h-4 w-4 accent-orange-600"
                          checked={answers[questionIndex] === answerIndex}
                          name={`${selectedTest.id}-${questionIndex}`}
                          type="radio"
                          onChange={() => onAnswerChange(questionIndex, answerIndex)}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <Button className="w-full" type="button" onClick={() => onSubmit()}>Nộp bài và lưu kết quả</Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

const ConfirmExitModal = ({ onCancel, onConfirm }) => (
  <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/30 p-4">
    <section className="w-full max-w-md rounded-lg border border-orange-100 bg-white p-5 shadow-2xl shadow-slate-950/20">
      <h2 className="text-lg font-black text-slate-950">Thoát bài test?</h2>
      <p className="mt-2 text-sm font-semibold text-slate-500">Bài làm hiện tại sẽ không được lưu vào kết quả test.</p>
      <div className="mt-5 flex justify-end gap-3">
        <Button variant="ghost" type="button" onClick={onCancel}>Tiếp tục làm bài</Button>
        <Button type="button" onClick={onConfirm}>Thoát, không lưu</Button>
      </div>
    </section>
  </div>
)

const EditStatusModal = ({ result, status, statuses, onChange, onClose, onSave }) => (
  <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/20 p-4">
    <button className="absolute inset-0 cursor-default" type="button" onClick={onClose} aria-label="Đóng sửa trạng thái" />
    <section className="relative z-10 w-full max-w-md rounded-lg border border-orange-100 bg-white p-5 shadow-2xl shadow-slate-950/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-orange-600">Kết quả test</p>
          <h2 className="mt-1 text-lg font-black text-slate-950">{result.customer}</h2>
          <p className="mt-1 text-sm text-slate-500">{result.score} · {result.level} · {result.recommendation}</p>
        </div>
        <Button className="shrink-0" variant="ghost" type="button" onClick={onClose} aria-label="Đóng">
          <X size={18} />
        </Button>
      </div>
      <label className="mt-5 block">
        <span className="text-sm font-black text-slate-700">Trạng thái</span>
        <select
          className="mt-2 h-11 w-full rounded-lg border border-orange-100 px-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
          value={status}
          onChange={(event) => onChange(event.target.value)}
        >
          {statuses.map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
      <div className="mt-5 flex justify-end gap-3">
        <Button variant="ghost" type="button" onClick={onClose}>Hủy</Button>
        <Button type="button" onClick={onSave}>Lưu trạng thái</Button>
      </div>
    </section>
  </div>
)
