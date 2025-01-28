import React, { useState } from "react"
import { Book, ChevronRight, Search, Code, Zap, Shield, FileText, Mail } from "lucide-react"

const documentationSections = [
  {
    title: "Getting Started",
    icon: <Book className="w-6 h-6" />,
    content: `
      Welcome to Sorobuilder! Start by creating an account and logging in to access the platform.
      - Set up your profile and manage your credits.
      - Navigate to the Generate section to create your first smart contract.
      - Explore the Community page to see contracts created by other users and share ideas.
    `,
  },
  {
    title: "Smart Contract Generation",
    icon: <Code className="w-6 h-6" />,
    content: `
      Sorobuilder leverages AI to simplify the process of generating smart contracts.
      - Enter your contract requirements in plain text.
      - Use the Sorobuilder editor to review and modify the generated code.
      - Download the complete project files directly.
      - Ensure your contracts are secure by following the provided recommendations.
    `,
  },
  {
    title: "Managing Credits",
    icon: <Zap className="w-6 h-6" />,
    content: `
      Credits are the currency of Sorobuilder. Here's how they work:
      - Each smart contract costs 1 credit to generate.
      - You can purchase credits from the Credits page.
    `,
  },
  {
    title: "Security Best Practices",
    icon: <Shield className="w-6 h-6" />,
    content: `
      Security is critical when working with smart contracts. Follow these best practices:
      - Always review the generated code for vulnerabilities.
      - Use the testing suite included in your project to validate contract behavior.
      - Update dependencies regularly to ensure compatibility and security.
      - Avoid exposing sensitive data or private keys in your code.
    `,
  }
];


function Documentation() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeSection, setActiveSection] = useState(null)

  const filteredSections = documentationSections.filter((section) =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 text-transparent bg-clip-text leading-tight py-2">
          Sorobuilder Documentation
        </h1>

        <div className="mb-8 relative">
          <input
            type="text"
            placeholder="Search documentation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400" />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {filteredSections.map((section, index) => (
            <div
              key={index}
              className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm border border-gray-700 hover:border-blue-500 transition-all duration-300 cursor-pointer"
              onClick={() => setActiveSection(activeSection === index ? null : index)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {section.icon}
                  <h2 className="text-xl font-semibold ml-3">{section.title}</h2>
                </div>
                <ChevronRight
                  className={`w-5 h-5 transition-transform duration-300 ${
                    activeSection === index ? "transform rotate-90" : ""
                  }`}
                />
              </div>
              {activeSection === index && (
                <div className="mt-4 text-gray-300">
                  <p>{section.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-lg text-gray-300 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <a
            href="mailto:global-missioia@gmail.com"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 transition-all duration-300"
          >
            <Mail className="w-5 h-5 mr-2" />
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}

export default Documentation

