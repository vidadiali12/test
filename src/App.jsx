import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./Componenets/Home/Home"
import Login from "./Componenets/Login/Login"
import { useEffect, useState } from "react"
import { totalUsers } from "./Data"
import Page from "./Componenets/Home/Page"

function App() {
  const [access, setAccess] = useState(false)
  const [userId, setUserId] = useState(null)
  const [loading, setLoading] = useState(true) // refreshdə gözlətmək üçün

  useEffect(() => {
    const encryptedId = localStorage.getItem("chatUserAccess1")
    if (encryptedId) {
      const decryptedId = Number(atob(encryptedId))
      setUserId(decryptedId)
      setAccess(true)
    } else {
      setUserId(null)
      setAccess(false)
    }
    setLoading(false) // artıq yoxlanış bitdi
  }, [])

  useEffect(() => {
    const handleStorageChange = () => {
      const accessToken = localStorage.getItem("chatUserAccess1")
      setAccess(!!accessToken)
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [access])

  const currentUser = totalUsers.find((user) => user.userId === userId)

  // refresh zamanı əvvəlcə boş ekranda qalmamaq üçün
  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Routes>
      {access ? (
        <>
          <Route path="/test" element={<Home userId={userId} setAccess={setAccess} />} />
          {currentUser?.isAdmin && (
            <Route path="/test/page" element={<Page userId={userId} setAccess={setAccess} />} />
          )}

          <Route path="*" element={<Navigate to="/test" replace />} />
        </>
      ) : (
        <>
          <Route path="/test/login" element={<Login setAccess={setAccess} setUserId={setUserId} />} />
          <Route path="*" element={<Navigate to="/test/login" replace />} />
        </>
      )}
    </Routes>
  )
}

export default App
