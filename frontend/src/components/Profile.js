import React, { useState, useEffect } from "react"
import { auth, db } from "../firebaseConfig"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { User, Mail, Zap, Edit2, Save, X, Loader } from "lucide-react"

function Profile() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [updatedName, setUpdatedName] = useState("")

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser
      if (user) {
        const userDocRef = doc(db, "users", user.uid)
        const userDoc = await getDoc(userDocRef)
        if (userDoc.exists()) {
          setUserData(userDoc.data())
          setUpdatedName(userDoc.data().name || "")
        }
      }
      setLoading(false)
    }

    fetchUserData()
  }, [])

  const handleSave = async () => {
    if (updatedName.trim() === "") {
      alert("Name cannot be empty.")
      return
    }

    try {
      const user = auth.currentUser
      if (user) {
        const userDocRef = doc(db, "users", user.uid)
        await updateDoc(userDocRef, { name: updatedName })
        setUserData((prevData) => ({ ...prevData, name: updatedName }))
        setEditing(false)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <Loader className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 text-transparent bg-clip-text">
        Your Profile
      </h1>

      {userData ? (
        <div className="bg-gray-800/50 p-8 rounded-lg shadow-lg backdrop-blur-sm border border-gray-700 max-w-md w-full mx-auto">
          <div className="mb-6 flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
              <User size={48} className="text-white" />
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-400">Email</label>
              <div className="flex items-center bg-gray-700/50 p-3 rounded-md">
                <Mail size={18} className="text-gray-400 mr-2" />
                <p>{userData.email}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-400">Credits</label>
              <div className="flex items-center bg-gray-700/50 p-3 rounded-md">
                <Zap size={18} className="text-yellow-400 mr-2" />
                <p>{userData.credits}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-400">Name</label>
              {editing ? (
                <div className="flex items-center bg-gray-700/50 p-3 rounded-md">
                  <User size={18} className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                    className="w-full bg-transparent text-white focus:outline-none"
                    placeholder="Enter your name"
                  />
                </div>
              ) : (
                <div className="flex items-center bg-gray-700/50 p-3 rounded-md">
                  <User size={18} className="text-gray-400 mr-2" />
                  <p>{userData.name || "No name set"}</p>
                </div>
              )}
            </div>
          </div>
          {editing ? (
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setEditing(false)}
                className="flex items-center justify-center bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-300"
              >
                <X size={18} className="mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center justify-center bg-green-500 px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-300"
              >
                <Save size={18} className="mr-2" />
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 px-4 py-2 rounded-md w-full mt-6 transition-colors duration-300"
            >
              <Edit2 size={18} className="mr-2" />
              Edit Profile
            </button>
          )}
        </div>
      ) : (
        <div className="bg-gray-800/50 p-8 rounded-lg shadow-lg backdrop-blur-sm border border-gray-700 max-w-md w-full mx-auto text-center">
          <p className="text-xl text-gray-400">No user data found.</p>
        </div>
      )}
    </div>
  )
}

export default Profile

