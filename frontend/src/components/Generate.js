import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth, db } from "../firebaseConfig"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { Zap, Code, Shield, ChevronRight, AlertCircle, Loader } from "lucide-react"

const Generate = () => {
  const navigate = useNavigate()
  const [credits, setCredits] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCredits = async () => {
      const user = auth.currentUser
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          setCredits(userDoc.data().credits || 0)
        } else {
          setCredits(0)
        }
      }
      setLoading(false)
    }

    fetchCredits()
  }, [])

  const handleUseSorobuilder = async () => {
    const confirm = window.confirm("Do you want to use 1 credit to access Sorobuilder?")
    if (confirm) {
      const user = auth.currentUser
      if (user) {
        const userDocRef = doc(db, "users", user.uid)
        const userDoc = await getDoc(userDocRef)
        if (userDoc.exists()) {
          const currentCredits = userDoc.data().credits || 0
          if (currentCredits >= 1) {
            // Deduce 3 credits
            await updateDoc(userDocRef, { credits: currentCredits - 1 })
            navigate("/smartcontract")
          } else {
            alert("You do not have enough credits.")
          }
        } else {
          alert("User not found.")
        }
      }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 text-transparent bg-clip-text leading-tight py-2">
          Smart Contract Generation
        </h1>
        <p className="text-xl text-center mb-12 text-gray-300 leading-tight py-1">
          Harness the power of AI to create secure and efficient smart contracts in minutes.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm border border-gray-700">
            <Zap className="w-12 h-12 text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
            <p className="text-gray-400">Generate complete smart contracts in minutes, not hours.</p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm border border-gray-700">
            <Code className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Multiple Frameworks</h3>
            <p className="text-gray-400">Support for various blockchain frameworks and standards.</p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm border border-gray-700">
            <Shield className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Security First</h3>
            <p className="text-gray-400">Built-in security checks and best practices for your contracts.</p>
          </div>
        </div>

        <div className="bg-gray-800/50 p-8 rounded-lg backdrop-blur-sm border border-gray-700 mb-16">
          <h2 className="text-3xl font-bold mb-4 text-center">Your Sorobuilder Credits</h2>
          <div className="flex items-center justify-center mb-6">
            <Zap className="w-8 h-8 text-yellow-400 mr-2" />
            <span className="text-4xl font-bold">{credits}</span>
          </div>
          <p className="text-center text-gray-300 mb-6">Each smart contract generation costs 1 credit.</p>
          {credits < 1 ? (
            <div className="text-center">
              <div className="flex items-center justify-center text-red-400 mb-4">
                <AlertCircle className="w-5 h-5 mr-2" />
                <p>You don't have enough credits to use Sorobuilder.</p>
              </div>
              <button
                onClick={() => navigate("/credits")}
                className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-all duration-300 flex items-center justify-center mx-auto"
              >
                Buy More Credits
                <ChevronRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-lg mb-6 text-gray-300">You're ready to create your next smart contract!</p>
              <button
                onClick={handleUseSorobuilder}
                className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-all duration-300 flex items-center justify-center mx-auto"
              >
                Use Sorobuilder 1 <Zap className="w-4 h-4 text-yellow-400 mr-2" /> 
                <ChevronRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Need help getting started?</h2>
          <p className="text-gray-300 mb-6">
            Check out our documentation and tutorials to learn more about creating smart contracts with Sorobuilder.
          </p>
          <button
            onClick={() => navigate("/docs")}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-all duration-300"
          >
            View Documentation
          </button>
        </div>
      </div>
    </div>
  )
}

export default Generate

