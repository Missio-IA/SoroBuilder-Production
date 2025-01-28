import React, { useState } from "react"
import axios from "axios"
import { auth } from "../firebaseConfig"
import { Zap, Minus, Plus, ShoppingCart } from "lucide-react"

function Credits() {
  const [quantity, setQuantity] = useState(1)

  const handleBuyCredits = async () => {
    try {
      const user = auth.currentUser
      if (!user) {
        alert("You must be logged in to buy credits.")
        return
      }

      const userId = user.uid
      const response = await axios.post("/api/create-payment-link", {
        userId,
        quantity: Number(quantity),
      })
      const { url } = response.data
      window.location.href = url
    } catch (err) {
      console.error("Error creating payment link:", err)
      alert("Error creating payment link.")
    }
  }

  const incrementQuantity = () => setQuantity((prev) => Math.min(prev + 1, 100))
  const decrementQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1))

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1e2533] rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-[#3898FF] via-[#40C4AA] to-[#40C4AA] text-transparent bg-clip-text">
            Buy Sorobuilder Credits
          </h1>

          <p className="text-gray-400 text-center text-sm mb-6">
            Each credit costs €3 and can be used to generate one smart contract.
          </p>

          <div className="bg-[#262d3d] rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-xl font-semibold text-white">1 Credit = €3</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-2 text-center">How many credits do you want?</label>
            <div className="flex items-center justify-center bg-[#262d3d] rounded-lg p-1">
              <button
                onClick={decrementQuantity}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#2f374a] rounded-lg transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min={1}
                max={100}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(100, Number.parseInt(e.target.value) || 1)))}
                className="w-16 h-10 bg-transparent text-center text-white text-lg font-semibold focus:outline-none"
              />
              <button
                onClick={incrementQuantity}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#2f374a] rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-[#262d3d] rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Total:</span>
              <span className="text-xl font-bold text-white">€{(quantity * 3).toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleBuyCredits}
            className="w-full h-12 flex items-center justify-center space-x-2 bg-gradient-to-r from-[#3898FF] to-[#40C4AA] hover:from-[#3181e4] hover:to-[#37ab94] text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>
              Buy {quantity} Credit{quantity !== 1 ? "s" : ""}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Credits

