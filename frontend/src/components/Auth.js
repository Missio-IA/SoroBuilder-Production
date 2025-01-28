import React, { useEffect, useState } from "react"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db } from "../firebaseConfig"
import { useNavigate } from "react-router-dom"
import { Code, Cpu, Shield, Zap, ChevronRight, Github, Users, FileCode } from "lucide-react"

function Auth() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 1) Verificar si el doc existe
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // 2) Si NO existe, creamos con credits=0
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          lastLogin: new Date(),
          credits: 0,
        });
      } else {
        // 3) Si SÍ existe, actualizamos name, email, lastLogin sin tocar credits
        await setDoc(
          userRef,
          {
            name: user.displayName,
            email: user.email,
            lastLogin: new Date(),
            // No ponemos credits
          },
          { merge: true }
        );
      }

      setUser(user);
      navigate("/community");
    } catch (error) {
      console.error("Error during sign-in:", error);
      alert("Error signing in. Please try again.");
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
    })
    return unsubscribe
  }, [])

  const features = [
    {
      icon: <Cpu className="w-12 h-12 text-teal-400" />,
      title: "AI-Powered Generation",
      description: "Create smart contracts effortlessly using advanced artificial intelligence",
    },
    {
      icon: <Shield className="w-12 h-12 text-blue-400" />,
      title: "Security First",
      description: "Built-in security checks and best practices for your smart contracts",
    },
    {
      icon: <Zap className="w-12 h-12 text-green-400" />,
      title: "Lightning Fast",
      description: "Generate complete smart contracts in minutes, not hours",
    },
    {
      icon: <Code className="w-12 h-12 text-purple-400" />,
      title: "Multiple Frameworks",
      description: "Support for various blockchain frameworks and standards",
    },
  ]

  return (
    <div className="min-h-screen py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {user ? (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl w-full space-y-8 text-center">
            <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 text-transparent bg-clip-text leading-tight py-2">
              Welcome back, {user.displayName.split(" ")[0]}!
            </h1>
            <p className="text-xl sm:text-2xl text-center mb-12 text-gray-300 leading-relaxed">
              Start managing your smart contracts and credits now.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              <div className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm border border-gray-700 hover:border-teal-500 transition-all duration-300">
                <Zap className="w-12 h-12 text-yellow-400 mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2">Manage Credits</h3>
                <p className="text-gray-400">View and top up your Sorobuilder credits.</p>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm border border-gray-700 hover:border-blue-500 transition-all duration-300">
                <FileCode className="w-12 h-12 text-blue-400 mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2">Your Contracts</h3>
                <p className="text-gray-400">Access and manage your smart contracts.</p>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm border border-gray-700 hover:border-green-500 transition-all duration-300">
                <Users className="w-12 h-12 text-green-400 mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2">Community</h3>
                <p className="text-gray-400">Explore the Sorobuilder community.</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/community")}
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 md:text-lg md:px-10 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Go to Community
              <ChevronRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="flex flex-col items-center justify-center min-h-screen max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 text-transparent bg-clip-text leading-tight leading-tight py-2">
              The Future of Smart Contract Development
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl leading-tight py-1">
              Harness the power of AI to create, deploy, and manage smart contracts with unprecedented ease and
              security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <button
                onClick={signInWithGoogle}
                className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-8 py-4 rounded-lg font-bold shadow-lg transition-all duration-300 flex items-center justify-center"
              >
                Get Started with Google
                <ChevronRight className="ml-2 w-5 h-5" />
              </button>
              <a
                href="https://github.com/missio-ia"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-lg font-bold shadow-lg transition-all duration-300 flex items-center justify-center"
              >
                <Github className="mr-2 w-5 h-5" />
                View on GitHub
              </a>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm border border-gray-700 hover:border-gray-600 transition-all duration-300"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Statistics */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-gray-800/30 p-6 rounded-lg">
                <div className="text-4xl font-bold text-teal-400 mb-2">100+</div>
                <div className="text-gray-400">Smart Contracts Generated</div>
              </div>
              <div className="bg-gray-800/30 p-6 rounded-lg">
                <div className="text-4xl font-bold text-blue-400 mb-2">50+</div>
                <div className="text-gray-400">Active Users</div>
              </div>
              <div className="bg-gray-800/30 p-6 rounded-lg">
                <div className="text-4xl font-bold text-green-400 mb-2">99%</div>
                <div className="text-gray-400">Success Rate</div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 my-16 rounded-2xl border border-gray-700 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Ready to revolutionize your smart contract development?</h2>
              <p className="text-gray-300 mb-6">
                Join the growing community of developers using Sorobuilder to create the future of blockchain
                technology.
              </p>
              <button
                onClick={signInWithGoogle}
                className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-8 py-4 rounded-lg font-bold shadow-lg transition-all duration-300"
              >
                Start Building Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Auth

