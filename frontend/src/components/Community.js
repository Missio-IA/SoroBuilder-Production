// src/components/Community.js
import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Cpu, Code, Globe, Mail, Github, FileText, Download, Zap} from "lucide-react";

function Community() {
  const [contracts, setContracts] = useState([]);

  // Obtiene usuario actual
  const user = auth.currentUser;

  // Cargar contratos del usuario
  useEffect(() => {
    if (!user) return;

    async function fetchContracts() {
      const q = query(
        collection(db, "contracts"),
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc")
      );
      const snapshot = await getDocs(q);

      const loadedContracts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setContracts(loadedContracts);
    }
  
    fetchContracts();
  }, [user]);

  // Genera un .zip con la estructura de archivos
  const handleDownloadZip = async (contract) => {
    if (!contract.files) return;

    const zip = new JSZip();
    // "files" es un objeto: { "src/main.rs": {content, path}, "test/test_main.rs": {...}, ... }

    for (const filePath in contract.files) {
      const fileData = contract.files[filePath];
      // filePath podría ser "src/main.rs" -> se crearán subcarpetas automáticamente
      zip.file(filePath, fileData.content || "");
    }

    const content = await zip.generateAsync({ type: "blob" });
    const fileName = (contract.project_name || "contract") + ".zip";
    saveAs(content, fileName);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 text-transparent bg-clip-text leading-tight py-2">
            Welcome to Sorobuilder Community
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mb-8 leading-tight py-1">
            Discover the future of smart contract development with our AI-powered platform. 
            Sorobuilder combines cutting-edge artificial intelligence with blockchain technology 
            to revolutionize how smart contracts are created and managed.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm border border-gray-700">
              <Cpu className="w-8 h-8 text-teal-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI-Powered Generation</h3>
              <p className="text-gray-400">
                Advanced AI algorithms that understand your requirements and generate secure smart contracts.
              </p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm border border-gray-700">
              <Code className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Smart Contract Library</h3>
              <p className="text-gray-400">
                Access a growing collection of community-generated smart contracts and templates.
              </p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm border border-gray-700">
              <Globe className="w-8 h-8 text-green-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Global Community</h3>
              <p className="text-gray-400">
                Join developers worldwide in building the future of decentralized applications.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Contracts Section */}
      <div className="flex-1 px-4 max-w-7xl mx-auto w-full py-16">
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 text-transparent bg-clip-text">
          Your Generated Contracts
        </h2>

        {contracts.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/30 rounded-lg border border-gray-700">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No contracts generated yet.</p>
            <p className="text-gray-500 mt-2">Start creating smart contracts to see them here!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contracts.map((contract) => (
              <div
                key={contract.id}
                className="bg-[#1e2533] border border-gray-700 rounded-lg overflow-hidden 
                        hover:bg-[#262d3d] transition-all duration-300 flex flex-col"
              >
                <div className="p-6 flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white truncate">
                      {contract.project_name || "Unnamed Project"}
                    </h3>
                    <Zap className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm flex items-center">
                      <Code className="w-4 h-4 mr-2 text-blue-400" />
                      {contract.file_metrics?.total_files || 0} files
                    </p>
                    <p className="text-gray-400 text-sm">
                      Created: {contract.timestamp?.toDate?.().toLocaleDateString() ?? "No date"}
                    </p>
                  </div>
                </div>
                <div className="bg-[#1a1f2b] p-4">
                  <button
                    onClick={() => handleDownloadZip(contract)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-[#3898FF] hover:bg-blue-600 
                            text-white rounded transition-colors duration-200"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* About Section */}
      <div className="bg-gray-900/80 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 text-transparent bg-clip-text">
                About Missio IA
              </h2>
              <p className="text-gray-300 mb-4">
                Missio IA is a pioneering technology company specializing in artificial 
                intelligence solutions for blockchain development...
              </p>
              <p className="text-gray-300">
                Through innovative AI technology and a commitment to the developer community, 
                we're building the tools that will shape the future of decentralized applications.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 text-transparent bg-clip-text">
                Contact Us
              </h2>
              <div className="space-y-4">
                <a
                  href="mailto:global.missioia@gmail.com"
                  className="flex items-center text-gray-300 hover:text-teal-400 transition-colors"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  global.missioia@gmail.com
                </a>
                <a
                  href="https://github.com/missio-ia"
                  className="flex items-center text-gray-300 hover:text-teal-400 transition-colors"
                >
                  <Github className="w-5 h-5 mr-2" />
                  github.com/missio-ia
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Missio IA. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/terms" className="text-gray-400 hover:text-teal-400 text-sm">
                Terms of Service
              </a>
              <a href="/privacy" className="text-gray-400 hover:text-teal-400 text-sm">
                Privacy Policy
              </a>
              <a href="/contact" className="text-gray-400 hover:text-teal-400 text-sm">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Community;
